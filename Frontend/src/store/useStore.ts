import { create } from "zustand"
import type { Product, User, SpecialPrice } from "@/types"

interface AppState {
  // Productos
  products: Product[]
  isLoadingProducts: boolean

  // Usuarios
  users: User[]
  selectedUser: User | null
  isLoadingUsers: boolean

  // Precios especiales
  specialPrices: SpecialPrice | null
  isLoadingSpecialPrices: boolean

  // Acciones
  setProducts: (products: Product[]) => void
  setIsLoadingProducts: (loading: boolean) => void

  setUsers: (users: User[]) => void
  setSelectedUser: (user: User | null) => void
  setIsLoadingUsers: (loading: boolean) => void

  setSpecialPrices: (specialPrices: SpecialPrice | null) => void
  setIsLoadingSpecialPrices: (loading: boolean) => void

  // Métodos helper
  getSpecialPriceForProduct: (sku: string) => number | null
}

export const useStore = create<AppState>((set, get) => ({
  // Estado inicial
  products: [],
  isLoadingProducts: false,

  users: [],
  selectedUser: null,
  isLoadingUsers: false,

  specialPrices: null,
  isLoadingSpecialPrices: false,

  // Acciones
  setProducts: (products) => set({ products }),
  setIsLoadingProducts: (isLoadingProducts) => set({ isLoadingProducts }),

  setUsers: (users) => set({ users }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setIsLoadingUsers: (isLoadingUsers) => set({ isLoadingUsers }),

  setSpecialPrices: (specialPrices) => set({ specialPrices }),
  setIsLoadingSpecialPrices: (isLoadingSpecialPrices) => set({ isLoadingSpecialPrices }),

  // Métodos helper
  getSpecialPriceForProduct: (sku: string) => {
    const { specialPrices } = get()
    if (!specialPrices) return null

    const productSpecialPrice = specialPrices.products.find((p) => p.sku === sku)
    return productSpecialPrice ? productSpecialPrice.specialPrice : null
  },
}))