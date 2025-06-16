"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/useToast"
import Toast from "@/components/Toast"
import LoadingSpinner from "@/components/LoadingSpinner"
import SearchableDropdown from "@/components/SearchableDropdown"
import { Upload, Plus, Trash2, Save } from "lucide-react"
import type { CreateSpecialPriceRequest, Product } from "@/types"

interface ProductForm {
  productId: string
  specialPrice: string
}

export default function SubidaPage() {
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [products, setProducts] = useState<ProductForm[]>([{ productId: "", specialPrice: "" }])
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingUser, setIsCheckingUser] = useState(false)
  const [existingUser, setExistingUser] = useState<any>(null)
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  const { toasts, showSuccess, showError, removeToast } = useToast()

  // Cargar productos disponibles al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true)
      try {
        const response = await api.getProducts()
        if (response.success && response.data) {
          setAvailableProducts(response.data)
        }
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setIsLoadingProducts(false)
      }
    }

    loadProducts()
  }, [])

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoadingUsers(true)
      try {
        const response = await api.getUsers()
        if (response.success && response.data) {
          setUsers(response.data)
        }
      } catch (error) {
        console.error("Error loading users:", error)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    loadUsers()
  }, [])

  // Verificar si el usuario existe cuando cambia el email
  useEffect(() => {
    const checkUser = async () => {
      if (!email || !email.includes("@")) {
        setExistingUser(null)
        return
      }

      // Verificar si es un usuario existente de la lista
      const existingUserFromList = users.find((u) => u.email === email)
      if (existingUserFromList && !userName) {
        setUserName(existingUserFromList.user)
      }

      setIsCheckingUser(true)
      try {
        const response = await api.getSpecialPricesByEmail(email)
        if (response.success && response.data) {
          setExistingUser(response.data)
          setUserName(response.data.user)
          setProducts(
            response.data.products.map((p) => {
              const product = availableProducts.find((ap) => ap.sku === p.sku)
              return {
                productId: product?._id || "",
                specialPrice: p.specialPrice.toString(),
              }
            }),
          )
        }
      } catch (error) {
        setExistingUser(null)
      } finally {
        setIsCheckingUser(false)
      }
    }

    const timeoutId = setTimeout(checkUser, 500)
    return () => clearTimeout(timeoutId)
  }, [email, users, availableProducts])

  const addProduct = () => {
    setProducts([...products, { productId: "", specialPrice: "" }])
  }

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index))
    }
  }

  const updateProduct = (index: number, field: keyof ProductForm, value: string) => {
    const updatedProducts = [...products]
    updatedProducts[index][field] = value
    setProducts(updatedProducts)
  }

  const validateForm = (): string | null => {
    if (!email.trim()) return "Email is required"
    if (!email.includes("@")) return "Invalid email format"
    if (!userName.trim()) return "Username is required"
    if (products.length === 0) return "At least one product is required"

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      if (!product.productId.trim()) return `Product ${i + 1} must be selected`
      if (!product.specialPrice.trim()) return `Special price for product ${i + 1} is required`

      const price = Number.parseFloat(product.specialPrice)
      if (isNaN(price) || price < 0) return `Special price for product ${i + 1} must be a valid number >= 0`
    }

    // Verificar productos duplicados
    const productIds = products.map((p) => p.productId)
    const uniqueProductIds = new Set(productIds)
    if (productIds.length !== uniqueProductIds.size) return "Duplicate products are not allowed"

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      showError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const requestData: CreateSpecialPriceRequest = {
        email: email.toLowerCase().trim(),
        user: userName.trim(),
        products: products.map((p) => {
          const product = availableProducts.find((ap) => ap._id === p.productId)
          return {
            sku: product?.sku || "",
            specialPrice: Number.parseFloat(p.specialPrice),
          }
        }),
      }

      if (existingUser) {
        await api.updateSpecialPrice(email.toLowerCase().trim(), requestData)
        showSuccess("User updated successfully")
      } else {
        await api.createSpecialPriceUser(requestData)
        showSuccess("User created successfully")
      }

      // Resetear formulario
      setEmail("")
      setUserName("")
      setProducts([{ productId: "", specialPrice: "" }])
      setExistingUser(null)
    } catch (error: any) {
      showError(error.message || "Error processing request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Upload className="w-6 h-6 mr-2" />
          Subida de Precios Especiales
        </h1>
        <p className="mt-1 text-sm text-gray-600">Registra o actualiza usuarios con sus precios especiales</p>
      </div>

      {/* Formulario */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del usuario */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico *</label>
              <div className="mt-1 relative">
                <SearchableDropdown
                  options={users.map((user) => ({
                    value: user.email,
                    label: user.email,
                    sublabel: user.user,
                  }))}
                  value={email ? { value: email, label: email } : null}
                  onChange={(option) => {
                    if (option) {
                      setEmail(option.value)
                      const existingUser = users.find((u) => u.email === option.value)
                      if (existingUser) {
                        setUserName(existingUser.user)
                      }
                    } else {
                      setEmail("")
                    }
                  }}
                  placeholder={isLoadingUsers ? "Loading users..." : "Search user or enter new email"}
                  searchPlaceholder="Search by email or name..."
                  disabled={isLoadingUsers || isCheckingUser}
                  allowCustomValue={true}
                  customValueLabel="New user:"
                  className="w-full"
                />
                {isCheckingUser && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
              {existingUser && <p className="mt-1 text-sm text-blue-600">Existing user found - data will be updated</p>}
            </div>

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                Nombre de Usuario *
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Username"
                required
              />
            </div>
          </div>

          {/* Sección de productos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Productos con Precios Especiales</h3>
              <button
                type="button"
                onClick={addProduct}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar Producto
              </button>
            </div>

            <div className="space-y-4">
              {products.map((product, index) => {
                const selectedProduct = availableProducts.find((p) => p._id === product.productId)

                return (
                  <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Producto *</label>
                        <div className="mt-1">
                          <SearchableDropdown
                            options={availableProducts.map((p) => ({
                              value: p._id,
                              label: p.nombre,
                              sublabel: `${p.sku} - €${p.precio.toFixed(2)}`,
                            }))}
                            value={
                              selectedProduct
                                ? {
                                    value: selectedProduct._id,
                                    label: selectedProduct.nombre,
                                    sublabel: `${selectedProduct.sku} - €${selectedProduct.precio.toFixed(2)}`,
                                  }
                                : null
                            }
                            onChange={(option) => {
                              updateProduct(index, "productId", option?.value || "")
                            }}
                            placeholder={isLoadingProducts ? "Loading products..." : "Select product"}
                            searchPlaceholder="Search by name or SKU..."
                            disabled={isLoadingProducts}
                            allowClear={false}
                          />
                          {selectedProduct && (
                            <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              <div>
                                <strong>SKU:</strong> {selectedProduct.sku}
                              </div>
                              <div>
                                <strong>Current price:</strong> €{selectedProduct.precio.toFixed(2)}
                              </div>
                              <div>
                                <strong>Stock:</strong> {selectedProduct.stock || 0} units
                              </div>
                              {selectedProduct.categoria && (
                                <div>
                                  <strong>Category:</strong> {selectedProduct.categoria}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Precio Especial (€) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={product.specialPrice}
                          onChange={(e) => updateProduct(index, "specialPrice", e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                          required
                        />
                        {selectedProduct && product.specialPrice && (
                          <div className="mt-1 text-xs">
                            <span className="text-gray-500">
                              Current price: <del>€{selectedProduct.precio.toFixed(2)}</del>
                            </span>
                            <span className="ml-2 text-green-600 font-medium">
                              New: €{Number.parseFloat(product.specialPrice || "0").toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="mt-6 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || isCheckingUser}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {existingUser ? "Update User" : "Create User"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Notificaciones toast */}
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}