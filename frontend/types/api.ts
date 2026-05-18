import type { CatalogProduct, CategorySlug } from '~/data/catalog'
import type { DeliveryMethod, Order, OrderStatus } from '~/data/orders'

export type UserRole = 'user' | 'admin'

export interface AuthUser {
  id: string
  fullName: string
  email: string
  phone: string
  birthDate?: string | null
  role?: UserRole
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export interface CatalogListResponse {
  items: CatalogProduct[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CartLineResponse {
  product: CatalogProduct
  quantity: number
  lineTotal: number
}

export interface CartResponse {
  lines: CartLineResponse[]
  subtotal: number
  count: number
  isEmpty: boolean
}

export type ApiOrder = Order

export interface CreateOrderBody {
  deliveryMethod: DeliveryMethod
  address: string
  recipientName: string
  phone: string
  comment?: string
}

export type { CategorySlug, OrderStatus }
