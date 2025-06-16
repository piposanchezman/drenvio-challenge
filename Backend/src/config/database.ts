import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables")
}

// Establecer conexión con MongoDB
export const connectDatabase = async (): Promise<void> => {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("Successfully connected to MongoDB")
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

// Cerrar conexión con MongoDB
export const disconnectDatabase = async (): Promise<void> => {
  try {
    console.log("Closing database connection...")
    await mongoose.disconnect()
    console.log("Database connection closed gracefully")
  } catch (error) {
    console.error("Error during disconnection:", error instanceof Error ? error.message : "Unknown error")
  }
}

// Eventos de conexión
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB")
})

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err)
})

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB")
})

// Manejo de cierre de proceso
const gracefulShutdown = async () => {
  await disconnectDatabase()
  process.exit(0)
}

process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)