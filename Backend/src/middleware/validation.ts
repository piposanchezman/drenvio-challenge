import { body, param, validationResult } from "express-validator"
import type { Request, Response, NextFunction } from "express"
import type { ApiResponse } from "../types"

// Manejar errores de validación
export const handleValidationErrors = (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: "Validation errors",
      data: errors.array(),
    })
    return
  }
  next()
}

// Validar email
export const validateEmail = [
  param("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
  handleValidationErrors,
]

// Validar creación de precio especial
export const validateCreateSpecialPrice = [
  body("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
  body("user")
    .notEmpty()
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Username must be between 2 and 100 characters"),
  body("products").isArray({ min: 1 }).withMessage("Must include at least one product"),
  body("products.*.sku").notEmpty().withMessage("SKU is required").trim(),
  body("products.*.specialPrice")
    .isNumeric()
    .withMessage("Special price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Special price must be greater than or equal to 0"),
  handleValidationErrors,
]

// Validar actualización de precio especial
export const validateUpdateSpecialPrice = [
  param("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
  body("user")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Username must be between 2 and 100 characters"),
  body("products").optional().isArray({ min: 1 }).withMessage("Must include at least one product"),
  body("products.*.sku").if(body("products").exists()).notEmpty().withMessage("SKU is required").trim(),
  body("products.*.specialPrice")
    .if(body("products").exists())
    .isNumeric()
    .withMessage("Special price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Special price must be greater than or equal to 0"),
  handleValidationErrors,
]
