import type { CategorySlug } from './catalog'
import { formatPrice } from './mock'

export type OrderStatus =
  | 'pending_confirmation'
  | 'in_progress'
  | 'awaiting_pickup'
  | 'completed'

export interface OrderStatusMeta {
  label: string
  icon: string
  tone: 'neutral' | 'warning' | 'info' | 'success'
}

export const orderStatusMeta: Record<OrderStatus, OrderStatusMeta> = {
  pending_confirmation: {
    label: 'В ожидании подтверждения',
    icon: 'lucide:clock',
    tone: 'warning',
  },
  in_progress: {
    label: 'В работе',
    icon: 'lucide:package',
    tone: 'info',
  },
  awaiting_pickup: {
    label: 'Ожидает получения',
    icon: 'lucide:map-pin',
    tone: 'info',
  },
  completed: {
    label: 'Завершён',
    icon: 'lucide:check-circle',
    tone: 'success',
  },
}

export const orderStatusFilters: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Все заказы' },
  { value: 'pending_confirmation', label: orderStatusMeta.pending_confirmation.label },
  { value: 'in_progress', label: orderStatusMeta.in_progress.label },
  { value: 'awaiting_pickup', label: orderStatusMeta.awaiting_pickup.label },
  { value: 'completed', label: orderStatusMeta.completed.label },
]

export type DeliveryMethod = 'courier' | 'pickup' | 'post'

export const deliveryLabels: Record<DeliveryMethod, string> = {
  courier: 'Курьером по адресу',
  pickup: 'Самовывоз из пункта выдачи',
  post: 'Почта России',
}

export interface OrderLineItem {
  productId: number
  categorySlug: CategorySlug
  name: string
  brand: string
  sku: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  number: string
  createdAt: string
  status: OrderStatus
  items: OrderLineItem[]
  subtotal: number
  deliveryCost: number
  total: number
  deliveryMethod: DeliveryMethod
  address: string
  recipientName: string
  phone: string
  comment?: string
}

export function calcDeliveryCost(method: DeliveryMethod, subtotal: number): number {
  if (method === 'pickup') return 0
  if (subtotal >= 10000) return 0
  return method === 'courier' ? 490 : 350
}

export function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export { formatPrice }
