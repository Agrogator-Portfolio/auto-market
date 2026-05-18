<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    productId: number
    compact?: boolean
    primary?: boolean
    goToCartOnAdd?: boolean
  }>(),
  { compact: false, primary: false, goToCartOnAdd: false },
)

const { getQuantity, add, setQuantity } = useCart()
const router = useRouter()
const busy = ref(false)

const quantity = computed(() => getQuantity(props.productId))
const inCart = computed(() => quantity.value > 0)

async function onAdd() {
  if (busy.value) return
  busy.value = true
  try {
    await add(props.productId)
    if (import.meta.client) {
      sessionStorage.setItem('cart-just-added', '1')
      if (props.goToCartOnAdd) router.push('/cart')
    }
  } catch {
    /* auth modal */
  } finally {
    busy.value = false
  }
}

async function change(delta: number) {
  if (busy.value) return
  const next = quantity.value + delta
  busy.value = true
  try {
    await setQuantity(props.productId, next)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div
    class="product-cart"
    :class="{
      'product-cart--compact': compact,
      'product-cart--primary': primary,
    }"
  >
    <button
      v-if="!inCart"
      type="button"
      class="btn btn--block product-cart__add"
      :class="[
        primary ? 'btn--primary' : 'btn--outline',
        { 'btn--lg': !compact || primary },
      ]"
      :disabled="busy"
      @click.stop="onAdd"
    >
      <UiAppIcon name="lucide:shopping-cart" :size="compact ? 18 : 20" />
      В корзину
    </button>

    <div v-else class="product-cart__in-cart">
      <span class="product-cart__label">Уже в корзине</span>
      <div class="product-cart__stepper">
        <button type="button" aria-label="Меньше" :disabled="busy || quantity <= 1" @click.stop="change(-1)">
          <UiAppIcon name="lucide:minus" :size="16" />
        </button>
        <span class="product-cart__qty">{{ quantity }}</span>
        <button type="button" aria-label="Больше" :disabled="busy" @click.stop="change(1)">
          <UiAppIcon name="lucide:plus" :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-cart {
  width: 100%;
}

.product-cart__add {
  gap: 0.4rem;
}

.product-cart__in-cart {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  min-height: 42px;
  padding: 0.45rem 0.55rem 0.45rem 0.75rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
}

.product-cart--primary .product-cart__in-cart {
  border-color: color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
  background: var(--color-primary-soft);
}

.product-cart--compact .product-cart__in-cart {
  min-height: 38px;
  padding: 0.35rem 0.45rem 0.35rem 0.65rem;
}

.product-cart__label {
  flex: 1;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-success);
  white-space: nowrap;
}

.product-cart--compact .product-cart__label {
  font-size: 0.75rem;
}

.product-cart__stepper {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  flex-shrink: 0;
}

.product-cart__stepper button {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  cursor: pointer;
}

.product-cart--compact .product-cart__stepper button {
  width: 28px;
  height: 28px;
}

.product-cart__stepper button:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.product-cart__stepper button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.product-cart__qty {
  min-width: 1.5rem;
  text-align: center;
  font-weight: 800;
  font-size: 0.9rem;
}
</style>
