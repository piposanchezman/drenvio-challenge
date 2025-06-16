export interface Product {
  _id: string;
  sku: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioBase: number;
  categoria?: string;
  stock?: number;
  imagen?: string;
  marca?: string;
  rating?: number;
}

export interface ProductSpecialPrice {
  sku: string;
  specialPrice: number;
  product?: {
    name: string;
    price: number;
  } | null;
}

export interface User {
  _id: string;
  email: string;
  user: string;
}

export interface SpecialPrice {
  _id: string;
  email: string;
  user: string;
  products: ProductSpecialPrice[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CreateSpecialPriceRequest {
  email: string;
  user: string;
  products: {
    sku: string;
    specialPrice: number;
  }[];
}