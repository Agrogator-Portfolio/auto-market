<script setup lang="ts">
import { formatPrice } from '~/data/catalog'

const props = defineProps<{
  subtotal: number
  itemCount: number
  savings?: number
  freeDeliveryFrom?: number
  showCheckout?: boolean
}>()

const threshold = computed(() => props.freeDeliveryFrom ?? 10000)
const freeDeliveryProgress = computed(() =>
  Math.min(100, Math.round((props.subtotal / threshold.value) * 100)),
)
const amountToFree = computed(() => Math.max(0, threshold.value - props.subtotal))
const hasFreeDelivery = computed(() => props.subtotal >= threshold.value)
</script>

<template>
  <aside class="cart-summary">
    <div class="cart-summary__card">
      <h2 class="cart-summary__title">Ваш заказ</h2>

      <div class="cart-summary__delivery" :class="{ 'cart-summary__delivery--done': hasFreeDelivery }">
        <div class="cart-summary__delivery-head">
          <UiAppIcon :name="hasFreeDelivery ? 'lucide:gift' : 'lucide:truck'" :size="18" />
          <span v-if="hasFreeDelivery">Бесплатная доставка!</span>
          <span v-else>
            До бесплатной доставки
            <strong>{{ formatPrice(amountToFree) }}</strong>
          </span>
        </div>
        <div class="cart-summary__progress">
          <div
            class="cart-summary__progress-fill"
            :style="{ width: `${freeDeliveryProgress}%` }"
          />
        </div>
        <span class="cart-summary__progress-label">
          {{ formatPrice(subtotal) }} из {{ formatPrice(threshold) }}
        </span>
      </div>

      <dl class="cart-summary__rows">
        <div class="cart-summary__row">
          <dt>Товаров</dt>
          <dd>{{ itemCount }} шт.</dd>
        </div>
        <div v-if="savings && savings > 0" class="cart-summary__row cart-summary__row--save">
          <dt>Экономия</dt>
          <dd>−{{ formatPrice(savings) }}</dd>
        </div>
        <div class="cart-summary__row">
          <dt>Доставка</dt>
          <dd class="cart-summary__muted">при оформлении</dd>
        </div>
        <div class="cart-summary__row cart-summary__row--total">
          <dt>К оплате</dt>
          <dd>{{ formatPrice(subtotal) }}</dd>
        </div>
      </dl>

      <NuxtLink
        v-if="showCheckout !== false"
        to="/checkout"
        class="btn btn--primary btn--block btn--lg cart-summary__checkout"
      >
        Оформить заказ
        <UiAppIcon name="lucide:arrow-right" :size="20" />
      </NuxtLink>

      <NuxtLink to="/catalog" class="cart-summary__continue">
        <UiAppIcon name="lucide:arrow-left" :size="16" />
        Продолжить покупки
      </NuxtLink>
    </div>

    <ul class="cart-summary__trust">
      <li>
        <UiAppIcon name="lucide:shield-check" :size="16" />
        Гарантия подлинности
      </li>
      <li>
        <UiAppIcon name="lucide:rotate-ccw" :size="16" />
        Возврат 14 дней
      </li>
      <li>
        <UiAppIcon name="lucide:car" :size="16" />
        Проверка по VIN
      </li>
    </ul>

    <div class="cart-summary__vin">
      <UiAppIcon name="lucide:scan-search" :size="20" />
      <p>Укажите VIN в личном кабинете — проверим совместимость перед отправкой</p>
    </div>
  </aside>
</template>

<style scoped>
.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: calc(var(--header-h) + 1rem);
}

.cart-summary__card {
  padding: 1.35rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.cart-summary__title {
  margin: 0 0 1.15rem;
  font-size: 1.2rem;
  font-weight: 800;
}

.cart-summary__delivery {
  margin-bottom: 1.15rem;
  padding: 0.9rem 1rem;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
  border: 1px solid #bfdbfe;
}

.cart-summary__delivery--done {
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border-color: #86efac;
}

.cart-summary__delivery-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-accent);
}

.cart-summary__delivery-head strong {
  color: var(--color-primary);
}

.cart-summary__progress {
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  margin-bottom: 0.4rem;
}

.cart-summary__progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--color-primary), #f97316);
  transition: width 0.4s ease;
}

.cart-summary__delivery--done .cart-summary__progress-fill {
  background: linear-gradient(90deg, var(--color-success), #34d399);
}

.cart-summary__progress-label {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

.cart-summary__rows {
  margin: 0 0 1.15rem;
}

.cart-summary__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding-block: 0.45rem;
  font-size: 0.9rem;
}

.cart-summary__row dt {
  color: var(--color-text-muted);
}

.cart-summary__row dd {
  margin: 0;
  font-weight: 700;
}

.cart-summary__row--save dd {
  color: var(--color-success);
}

.cart-summary__muted {
  font-weight: 600 !important;
  color: var(--color-text-muted) !important;
}

.cart-summary__row--total {
  margin-top: 0.35rem;
  padding-top: 0.85rem;
  border-top: 2px solid var(--color-border);
}

.cart-summary__row--total dt {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-text);
}

.cart-summary__row--total dd {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-accent);
  letter-spacing: -0.02em;
}

.cart-summary__checkout {
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}

.cart-summary__continue {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.cart-summary__continue:hover {
  color: var(--color-primary);
}

.cart-summary__trust {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cart-summary__trust li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.cart-summary__trust .app-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.cart-summary__vin {
  display: flex;
  gap: 0.65rem;
  padding: 0.9rem 1rem;
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: #cbd5e1;
}

.cart-summary__vin .app-icon {
  flex-shrink: 0;
  color: var(--color-primary);
}

.cart-summary__vin p {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.45;
  font-weight: 500;
}
</style>
