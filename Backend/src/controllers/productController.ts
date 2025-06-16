import type { Request, Response, NextFunction } from "express"
import Product from "../models/Products"
import type { ApiResponse } from "../types"

// Obtener todos los productos
export const getProducts = async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find()
      .select("nombre descripcion precio precioBase categoria stock imagen sku marca rating")
      .sort({ nombre: 1 })

    res.status(200).json({
      success: true,
      data: products,
      message: `${products.length} products found`,
    })
  } catch (error) {
    next(error)
  }
}

// Obtener producto por SKU
export const getProductBySku = async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
  try {
    const { sku } = req.params
    const product = await Product.findOne({ sku: sku.toUpperCase() })

    if (!product) {
      res.status(404).json({
        success: false,
        error: "Product not found",
      })
      return
    }

    res.status(200).json({
      success: true,
      data: product,
    })
  } catch (error) {
    next(error)
  }
}