export interface IProduct {
  sku: string
  nombre: string
  descripcion?: string
  precio: number
  precioBase: number
  categoria?: string
  stock?: number
  imagen?: string
  marca?: string
  rating?: number
}

export interface IProductSpecialPrice {
  sku: string
  specialPrice: number
}

export interface ISpecialPrice {
  email: string
  user: string
  products: IProductSpecialPrice[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ApiResponse {
  success: boolean
  data?: any
  message?: string
  error?: string
}