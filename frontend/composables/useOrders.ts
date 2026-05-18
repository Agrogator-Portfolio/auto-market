import type { CreateOrderBody, ApiOrder } from '~/types/api'
import type { OrderStatus } from '~/data/orders'

export type { CreateOrderBody as CreateOrderPayload }

export function useOrders() {
  const { apiFetch } = useApi()
  const orders = useState<ApiOrder[]>('user-orders', () => [])
  const loaded = useState('orders-loaded', () => false)

  async function fetchOrders(status: OrderStatus | 'all' = 'all') {
    const list = await apiFetch<ApiOrder[]>('/orders', {
      query: { status: status === 'all' ? undefined : status },
    })
    orders.value = list
    loaded.value = true
    return list
  }

  async function getById(id: string): Promise<ApiOrder | null> {
    try {
      return await apiFetch<ApiOrder>(`/orders/${id}`)
    } catch {
      return null
    }
  }

  async function createOrder(payload: CreateOrderBody): Promise<ApiOrder> {
    const order = await apiFetch<ApiOrder>('/orders', {
      method: 'POST',
      body: payload,
    })
    orders.value = [order, ...orders.value]
    return order
  }

  async function confirmReceived(id: string) {
    const order = await apiFetch<ApiOrder>(`/orders/${id}/complete`, {
      method: 'PATCH',
    })
    const idx = orders.value.findIndex((o) => o.id === id)
    if (idx >= 0) orders.value[idx] = order
    return order
  }

  function filterByStatus(status: OrderStatus | 'all'): ApiOrder[] {
    const list = [...orders.value].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    if (status === 'all') return list
    return list.filter((o) => o.status === status)
  }

  return {
    orders,
    loaded,
    fetchOrders,
    createOrder,
    getById,
    filterByStatus,
    confirmReceived,
  }
}
