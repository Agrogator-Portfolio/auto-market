import type { CatalogProduct, CategorySlug } from '~/data/catalog'
import type { OrderStatus } from '~/data/orders'

export interface AdminUserStats {
  totalSpent: number
  itemsPurchased: number
  completedOrders: number
}

export interface AdminUser {
  id: string
  email: string
  fullName: string
  phone: string
  birthDate: string | null
  role: string
  createdAt: string
  stats?: AdminUserStats
}

export interface AdminUserDetail extends AdminUser {
  stats: AdminUserStats & { totalOrders: number }
}

export interface AdminOrder {
  id: string
  number: string
  createdAt: string
  status: OrderStatus
  subtotal: number
  deliveryCost: number
  total: number
  deliveryMethod: string
  address: string
  recipientName: string
  phone: string
  comment?: string
  user: { id: string; email: string; fullName: string }
  items: Array<{
    productId: number
    categorySlug: string
    name: string
    brand: string
    sku: string
    price: number
    quantity: number
  }>
}

export type CategoryFieldDef = Record<
  CategorySlug,
  Array<{ key: string; label: string; type: string; options?: { label: string; value: string }[] }>
>

export function useAdmin() {
  const { apiFetch } = useApi()

  function listUsers() {
    return apiFetch<AdminUser[]>('/admin/users')
  }

  function createUser(body: {
    email: string
    password: string
    fullName: string
    phone: string
    birthDate?: string
  }) {
    return apiFetch<AdminUser>('/admin/users', { method: 'POST', body })
  }

  function updateUser(
    id: string,
    body: Partial<{
      email: string
      password: string
      fullName: string
      phone: string
      birthDate: string
    }>,
  ) {
    return apiFetch<AdminUser>(`/admin/users/${id}`, { method: 'PATCH', body })
  }

  function deleteUser(id: string) {
    return apiFetch(`/admin/users/${id}`, { method: 'DELETE' })
  }

  function getUser(id: string) {
    return apiFetch<AdminUserDetail>(`/admin/users/${id}`)
  }

  function getUserOrders(id: string) {
    return apiFetch<AdminOrder[]>(`/admin/users/${id}/orders`)
  }

  function getOrder(id: string) {
    return apiFetch<AdminOrder>(`/admin/orders/${id}`)
  }

  function getCategoryFields() {
    return apiFetch<CategoryFieldDef>('/admin/products/category-fields')
  }

  function listProducts() {
    return apiFetch<CatalogProduct[]>('/admin/products')
  }

  function getProduct(id: number) {
    return apiFetch<CatalogProduct>(`/admin/products/${id}`)
  }

  function createProduct(body: Record<string, unknown>) {
    return apiFetch<CatalogProduct>('/admin/products', { method: 'POST', body })
  }

  function updateProduct(id: number, body: Record<string, unknown>) {
    return apiFetch<CatalogProduct>(`/admin/products/${id}`, { method: 'PATCH', body })
  }

  function deleteProduct(id: number) {
    return apiFetch(`/admin/products/${id}`, { method: 'DELETE' })
  }

  function listOrders(status?: string) {
    return apiFetch<AdminOrder[]>('/admin/orders', {
      query: status && status !== 'all' ? { status } : undefined,
    })
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    return apiFetch<AdminOrder>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: { status },
    })
  }

  return {
    listUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getUserOrders,
    getOrder,
    getCategoryFields,
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    listOrders,
    updateOrderStatus,
  }
}
