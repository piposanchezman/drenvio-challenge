import type { Request, Response, NextFunction } from "express"
import type { ApiResponse } from "../types"

interface CustomError extends Error {
  statusCode?: number
  code?: number
  keyValue?: Record<string, any>
  errors?: Record<string, any>
}

// Middleware para manejo de errores
export const errorHandler = (err: CustomError, req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
  const error = { ...err }
  error.message = err.message

  console.error("Error:", err)

  // Error de validación de Mongoose
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors || {})
      .map((val: any) => val.message)
      .join(", ")
    error.message = `Validation error: ${message}`
    error.statusCode = 400
  }

  // Error de duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0]
    error.message = `Duplicate resource: ${field} already exists`
    error.statusCode = 400
  }

  // Error de cast
  if (err.name === "CastError") {
    error.message = "Resource not found"
    error.statusCode = 404
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal server error",
  })
}

// Middleware para rutas no encontradas
export const notFound = (req: Request, res: Response<ApiResponse>): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  })
}
