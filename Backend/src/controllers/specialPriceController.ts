import type { Request, Response, NextFunction } from "express"
import SpecialPrice from "../models/SpecialPrices"
import Product from "../models/Products"
import type { ApiResponse, ISpecialPrice } from "../types"

// Obtener todos los usuarios con precios especiales
export const getUsers = async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
  try {
    const users = await SpecialPrice.find().select("email user").sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: users,
      message: `${users.length} users with special prices found`,
    })
  } catch (error) {
    next(error)
  }
}

// Obtener precios especiales por email
export const getSpecialPricesByEmail = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.params

    const specialPrice = await SpecialPrice.findOne({
      email: email.toLowerCase(),
    })

    if (!specialPrice) {
      res.status(404).json({
        success: false,
        error: "User not found",
      })
      return
    }

    // Obtener información de productos
    const productsInfo = await Promise.all(
      specialPrice.products.map(async (prodEspecial) => {
        const product = await Product.findOne({ sku: prodEspecial.sku })

        return {
          sku: prodEspecial.sku,
          specialPrice: prodEspecial.specialPrice,
          product: product
            ? {
                name: product.nombre,
                price: product.precio,
              }
            : null,
        }
      }),
    )

    res.status(200).json({
      success: true,
      data: {
        _id: specialPrice._id,
        email: specialPrice.email,
        user: specialPrice.user,
        createdAt: specialPrice.createdAt,
        updatedAt: specialPrice.updatedAt,
        products: productsInfo,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Crear usuario con precios especiales
export const createSpecialPriceUser = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, user, products }: ISpecialPrice = req.body

    // Validar que los SKUs existen
    const skus = products.map((p) => p.sku.toUpperCase())
    const existingProducts = await Product.find({ sku: { $in: skus } })

    if (existingProducts.length !== skus.length) {
      const foundSkus = existingProducts.map((p) => p.sku)
      const missingSkus = skus.filter((sku) => !foundSkus.includes(sku))

      res.status(400).json({
        success: false,
        error: `SKUs not found: ${missingSkus.join(", ")}`,
      })
      return
    }

    const newSpecialPrice = new SpecialPrice({
      email: email.toLowerCase(),
      user,
      products: products.map((p) => ({
        sku: p.sku.toUpperCase(),
        specialPrice: p.specialPrice,
      })),
    })

    const savedSpecialPrice = await newSpecialPrice.save()

    res.status(201).json({
      success: true,
      data: savedSpecialPrice,
      message: "Special price created successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Actualizar precios especiales
export const updateSpecialPrice = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.params
    const { user, products }: Partial<ISpecialPrice> = req.body

    const specialPrice = await SpecialPrice.findOne({
      email: email.toLowerCase(),
    })

    if (!specialPrice) {
      res.status(404).json({
        success: false,
        error: "User not found",
      })
      return
    }

    // Validar productos si se proporcionan
    if (products && products.length > 0) {
      const skus = products.map((p) => p.sku.toUpperCase())
      const existingProducts = await Product.find({ sku: { $in: skus } })

      if (existingProducts.length !== skus.length) {
        const foundSkus = existingProducts.map((p) => p.sku)
        const missingSkus = skus.filter((sku) => !foundSkus.includes(sku))

        res.status(400).json({
          success: false,
          error: `SKUs not found: ${missingSkus.join(", ")}`,
        })
        return
      }

      specialPrice.products = products.map((p) => ({
        sku: p.sku.toUpperCase(),
        specialPrice: p.specialPrice,
      }))
    }

    if (user) {
      specialPrice.user = user
    }

    specialPrice.updatedAt = new Date()
    const updatedSpecialPrice = await specialPrice.save()

    res.status(200).json({
      success: true,
      data: updatedSpecialPrice,
      message: "Special price updated successfully",
    })
  } catch (error) {
    next(error)
  }
}