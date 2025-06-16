"use client"

import { useEffect } from "react"
import { useStore } from "@/store/useStore"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/useToast"
import LoadingSpinner from "@/components/LoadingSpinner"
import Toast from "@/components/Toast"
import SearchableDropdown from "@/components/SearchableDropdown"
import { Package } from "lucide-react"

export default function ArticulosPage() {
  const {
    products,
    users,
    selectedUser,
    specialPrices,
    isLoadingProducts,
    isLoadingUsers,
    isLoadingSpecialPrices,
    setProducts,
    setUsers,
    setSelectedUser,
    setSpecialPrices,
    setIsLoadingProducts,
    setIsLoadingUsers,
    setIsLoadingSpecialPrices,
    getSpecialPriceForProduct,
  } = useStore()

  const { toasts, showError, removeToast } = useToast()

  // Cargar productos al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true)
      try {
        const response = await api.getProducts()
        if (response.success && response.data) {
          setProducts(response.data)
        }
      } catch (error) {
        showError("Error loading products")
        console.error("Error loading products:", error)
      } finally {
        setIsLoadingProducts(false)
      }
    }

    loadProducts()
  }, [setProducts, setIsLoadingProducts, showError])

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
        showError("Error loading users")
        console.error("Error loading users:", error)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    loadUsers()
  }, [setUsers, setIsLoadingUsers, showError])

  // Cargar precios especiales cuando se selecciona un usuario
  useEffect(() => {
    if (!selectedUser) {
      setSpecialPrices(null)
      return
    }

    const loadSpecialPrices = async () => {
      setIsLoadingSpecialPrices(true)
      try {
        const response = await api.getSpecialPricesByEmail(selectedUser.email)
        if (response.success && response.data) {
          setSpecialPrices(response.data)
        }
      } catch (error) {
        showError("Error loading special prices")
        console.error("Error loading special prices:", error)
        setSpecialPrices(null)
      } finally {
        setIsLoadingSpecialPrices(false)
      }
    }

    loadSpecialPrices()
  }, [selectedUser, setSpecialPrices, setIsLoadingSpecialPrices, showError])

  const handleUserSelect = (user: (typeof users)[0] | null) => {
    setSelectedUser(user)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Package className="w-6 h-6 mr-2" />
            Artículos
          </h1>
          <p className="mt-1 text-sm text-gray-600">Gestiona el catálogo de productos y precios especiales</p>
        </div>

        {/* Selector de usuario */}
        <div className="mt-4 sm:mt-0">
          <SearchableDropdown
            options={users.map((user) => ({
              value: user._id,
              label: user.user,
              sublabel: user.email,
            }))}
            value={
              selectedUser
                ? {
                    value: selectedUser._id,
                    label: selectedUser.user,
                    sublabel: selectedUser.email,
                  }
                : null
            }
            onChange={(option) => {
              if (option) {
                const user = users.find((u) => u._id === option.value)
                handleUserSelect(user || null)
              } else {
                handleUserSelect(null)
              }
            }}
            placeholder={isLoadingUsers ? "Loading users..." : "Select user"}
            searchPlaceholder="Search by name or email..."
            disabled={isLoadingUsers}
            className="w-full sm:w-80"
          />
        </div>
      </div>

      {/* Indicador de carga de precios especiales */}
      {selectedUser && isLoadingSpecialPrices && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-sm text-blue-700">Loading special prices for {selectedUser.user}...</span>
          </div>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const specialPrice = getSpecialPriceForProduct(product.sku)
                const hasSpecialPrice = specialPrice !== null

                return (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.imagen ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={product.imagen || "/placeholder.svg"}
                              alt={product.nombre}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                          {product.descripcion && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.descripcion}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.categoria || "Sin categoría"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (product.stock || 0) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock || 0} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {hasSpecialPrice ? (
                        <div className="space-y-1">
                          <div className="text-gray-500">
                            <del>{formatPrice(product.precio)}</del>
                          </div>
                          <div className="text-green-600 font-semibold">{formatPrice(specialPrice)}</div>
                          <div className="text-xs text-green-600">Precio especial</div>
                        </div>
                      ) : (
                        <div className="text-gray-900 font-medium">{formatPrice(product.precio)}</div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">No products found in the system.</p>
          </div>
        )}
      </div>

      {/* Notificaciones toast */}
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}