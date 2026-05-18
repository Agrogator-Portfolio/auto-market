export function useAddToCart() {
  const router = useRouter()
  const { add } = useCart()

  async function addToCart(productId: number, options?: { goToCart?: boolean }) {
    try {
      await add(productId)
      if (import.meta.client) {
        sessionStorage.setItem('cart-just-added', '1')
        if (options?.goToCart) {
          router.push('/cart')
        }
      }
    } catch {
      /* auth modal opened */
    }
  }

  return { addToCart }
}
