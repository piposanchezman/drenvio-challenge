import dotenv from "dotenv"
import { initializeApp } from "./app"

dotenv.config()

const PORT = process.env.PORT || 3000

// Iniciar servidor
const startServer = async (): Promise<void> => {
  try {
    const app = await initializeApp()

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

    // Manejo de cierre del servidor
    const gracefulShutdown = (signal: string) => {
      console.log(`\nReceived ${signal}. Closing server...`)
      server.close((err) => {
        if (err) {
          console.error("Server shutdown error:", err)
          process.exit(1)
        }
        console.log("Server closed successfully")
        process.exit(0)
      })
    }

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))
  } catch (error) {
    console.error("Error starting server:", error)
    process.exit(1)
  }
}

if (require.main === module) {
  startServer()
}

export { startServer }
