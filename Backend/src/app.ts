import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import { connectDatabase } from "./config/database"
import { errorHandler, notFound } from "./middleware/errorHandler"
import productsRoutes from "./routes/products"
import specialPricesRoutes from "./routes/specialPrices"

dotenv.config()

const ORIGIN_URL = process.env.FRONTEND_URL || "http://localhost:3001"

// Crear y configurar la aplicación Express
export const createApp = () => {
  const app = express()

  // Middlewares de seguridad y configuración
  app.use(helmet())
  app.use(cors({ origin: ORIGIN_URL, credentials: true }))
  app.use(express.json({ limit: "10mb" }))
  app.use(express.urlencoded({ extended: true, limit: "10mb" }))

  // Middleware de logging simplificado
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`)
    next()
  })

  // Rutas de la API
  app.use("/api/v1/products", productsRoutes)
  app.use("/api/v1/special-prices", specialPricesRoutes)

  // Ruta de estado del servidor
  app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running smoothly",
      timestamp: new Date().toISOString(),
    })
  })

  // Middlewares de error
  app.use(notFound)
  app.use(errorHandler)

  return app
}

// Inicializar aplicación y base de datos
export const initializeApp = async () => {
  try {
    console.log("Initializing application...")
    await connectDatabase()
    console.log("Database connection established")

    const app = createApp()
    console.log("Express application configured")
    return app
  } catch (error) {
    console.error("Critical initialization error:", error instanceof Error ? error.message : error)
    process.exit(1)
  }
}