import type { ApiResponse, Product, User, SpecialPrice, CreateSpecialPriceRequest } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Función helper para realizar peticiones a la API
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.error || "An error occurred")
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "Network error occurred")
  }
}

export const api = {
  // Productos
  getProducts: () => fetchApi<Product[]>("/products"),
  getProductBySku: (sku: string) => fetchApi<Product>(`/products/${sku}`),

  // Usuarios
  getUsers: () => fetchApi<User[]>("/special-prices/users"),

  // Precios especiales
  getSpecialPricesByEmail: (email: string) => fetchApi<SpecialPrice>(`/special-prices/${email}`),
  createSpecialPriceUser: (data: CreateSpecialPriceRequest) =>
    fetchApi<SpecialPrice>("/special-prices", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSpecialPrice: (email: string, data: Partial<CreateSpecialPriceRequest>) =>
    fetchApi<SpecialPrice>(`/special-prices/${email}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}