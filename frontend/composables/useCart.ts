import type { CatalogProduct } from '~/data/catalog'
import type { CartResponse } from '~/types/api'

export interface CartItem {
  productId: number
  quantity: number
}

export interface CartLineView {
  product: CatalogProduct
  quantity: number
  lineTotal: number
}

export function useCart() {
  const { apiFetch } = useApi()
  const { isLoggedIn } = useUser()

  const cart = useState<CartResponse | null>('cart-state', () => null)
  const loading = useState('cart-loading', () => false)

  function applyCart(data: CartResponse) {
    cart.value = data
  }

  async function refresh() {
    if (!isLoggedIn.value) {
      cart.value = { lines: [], subtotal: 0, count: 0, isEmpty: true }
      return
    }
    loading.value = true
    try {
      const data = await apiFetch<CartResponse>('/cart')
      applyCart(data)
    } finally {
      loading.value = false
    }
  }

  async function add(productId: number, quantity = 1) {
    if (!isLoggedIn.value) {
      const { openLogin } = useAuthModal()
      openLogin()
      throw new Error('Требуется авторизация')
    }
    const data = await apiFetch<CartResponse>('/cart/items', {
      method: 'POST',
      body: { productId, quantity },
    })
    applyCart(data)
  }

  /** Добавляет несколько позиций (количество 1 каждая); существующие строки корзины дополняются. */
  async function addMany(productIds: number[]): Promise<boolean> {
    const ids = [...new Set(productIds)].filter((id) => Number.isFinite(id))
    if (!ids.length) return false

    if (!isLoggedIn.value) {
      const { openLogin } = useAuthModal()
      openLogin()
      return false
    }

    for (const productId of ids) {
      const data = await apiFetch<CartResponse>('/cart/items', {
        method: 'POST',
        body: { productId, quantity: 1 },
      })
      applyCart(data)
    }
    return true
  }

  async function setQuantity(productId: number, quantity: number) {
    if (!isLoggedIn.value) return
    const data = await apiFetch<CartResponse>(`/cart/items/${productId}`, {
      method: 'PATCH',
      body: { quantity },
    })
    applyCart(data)
  }

  async function remove(productId: number) {
    if (!isLoggedIn.value) return
    const data = await apiFetch<CartResponse>(`/cart/items/${productId}`, {
      method: 'DELETE',
    })
    applyCart(data)
  }

  async function clear() {
    if (!isLoggedIn.value) return
    const data = await apiFetch<CartResponse>('/cart', { method: 'DELETE' })
    applyCart(data)
  }

  const lines = computed<CartLineView[]>(() =>
    (cart.value?.lines ?? []).map((l) => ({
      product: l.product,
      quantity: l.quantity,
      lineTotal: l.lineTotal,
    })),
  )

  const count = computed(() => cart.value?.count ?? 0)
  const subtotal = computed(() => cart.value?.subtotal ?? 0)
  const isEmpty = computed(() => cart.value?.isEmpty ?? true)

  function getQuantity(productId: number): number {
    const line = cart.value?.lines.find((l) => l.product.id === productId)
    return line?.quantity ?? 0
  }

  if (import.meta.client) {
    watch(isLoggedIn, (logged) => {
      if (logged) refresh()
      else cart.value = { lines: [], subtotal: 0, count: 0, isEmpty: true }
    }, { immediate: true })
  }

  return {
    cart,
    loading,
    lines,
    count,
    subtotal,
    isEmpty,
    add,
    addMany,
    setQuantity,
    remove,
    clear,
    refresh,
    getQuantity,
  }
}
