<script setup lang="ts">
import { formatPrice } from '~/data/catalog'

const FREE_DELIVERY_FROM = 10000

const { lines, count, subtotal, isEmpty, setQuantity, remove, clear } = useCart()

useHead({ title: 'Корзина — АвтоДеталь' })

const addedToast = ref(false)

const totalSavings = computed(() =>
  lines.value.reduce((sum, l) => {
    if (!l.product.oldPrice) return sum
    return sum + (l.product.oldPrice - l.product.price) * l.quantity
  }, 0),
)

const positionsCount = computed(() => lines.value.length)

const allInStock = computed(() => lines.value.every((l) => l.product.inStock))

function pluralItems(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return 'товаров'
  if (mod10 === 1) return 'товар'
  if (mod10 >= 2 && mod10 <= 4) return 'товара'
  return 'товаров'
}

function showAdded() {
  addedToast.value = true
  setTimeout(() => { addedToast.value = false }, 2800)
}

onMounted(() => {
  if (import.meta.client && sessionStorage.getItem('cart-just-added')) {
    sessionStorage.removeItem('cart-just-added')
    showAdded()
  }
})
</script>

<template>
  <div class="cart-page">
    <div class="cart-page__hero" aria-hidden="true" />

    <div class="container">
      <nav class="cart-page__breadcrumbs">
        <NuxtLink to="/">Главная</NuxtLink>
        <UiAppIcon name="lucide:chevron-right" :size="14" />
        <span>Корзина</span>
      </nav>

      <header class="cart-page__head">
        <div>
          <h1 class="cart-page__title">Корзина</h1>
          <p v-if="!isEmpty" class="cart-page__subtitle">
            {{ positionsCount }} {{ positionsCount === 1 ? 'позиция' : positionsCount < 5 ? 'позиции' : 'позиций' }}
            · {{ count }} {{ pluralItems(count) }}
          </p>
        </div>
        <div v-if="!isEmpty" class="cart-page__steps">
          <span class="cart-page__step cart-page__step--active">
            <span class="cart-page__step-num">1</span>
            Корзина
          </span>
          <span class="cart-page__step-line" />
          <span class="cart-page__step">
            <span class="cart-page__step-num">2</span>
            Оформление
          </span>
          <span class="cart-page__step-line" />
          <span class="cart-page__step">
            <span class="cart-page__step-num">3</span>
            Получение
          </span>
        </div>
      </header>

      <Transition name="toast">
        <div v-if="addedToast" class="cart-page__toast" role="status">
          <UiAppIcon name="lucide:check-circle" :size="20" />
          <div>
            <strong>Добавлено в корзину</strong>
            <span>Можете продолжить покупки или оформить заказ</span>
          </div>
        </div>
      </Transition>

      <!-- Пустая корзина -->
      <div v-if="isEmpty" class="cart-page__empty">
        <div class="cart-page__empty-visual">
          <div class="cart-page__empty-icon">
            <UiAppIcon name="lucide:shopping-cart" :size="48" />
          </div>
          <span class="cart-page__empty-ring" />
        </div>
        <h2>Корзина пока пуста</h2>
        <p>Найдите нужные запчасти в каталоге — подбор по VIN, OEM и категориям</p>
        <div class="cart-page__empty-actions">
          <NuxtLink to="/catalog" class="btn btn--primary btn--lg">
            <UiAppIcon name="lucide:layout-grid" :size="20" />
            Открыть каталог
          </NuxtLink>
          <NuxtLink to="/" class="btn btn--outline btn--lg">На главную</NuxtLink>
        </div>
      </div>

      <!-- Содержимое -->
      <div v-else class="cart-page__layout">
        <section class="cart-page__main">
          <div class="cart-page__toolbar">
            <div class="cart-page__chips">
              <span class="cart-page__chip">
                <UiAppIcon name="lucide:layers" :size="14" />
                {{ positionsCount }} поз.
              </span>
              <span class="cart-page__chip" :class="{ 'cart-page__chip--ok': allInStock }">
                <UiAppIcon :name="allInStock ? 'lucide:check-circle' : 'lucide:alert-circle'" :size="14" />
                {{ allInStock ? 'Всё в наличии' : 'Есть под заказ' }}
              </span>
              <span v-if="totalSavings > 0" class="cart-page__chip cart-page__chip--sale">
                <UiAppIcon name="lucide:percent" :size="14" />
                Экономия {{ formatPrice(totalSavings) }}
              </span>
            </div>
            <button type="button" class="cart-page__clear" @click="clear">
              <UiAppIcon name="lucide:trash-2" :size="16" />
              Очистить
            </button>
          </div>

          <div class="cart-list">
            <CartLineItem
              v-for="(line, idx) in lines"
              :key="line.product.id"
              :line="line"
              :index="idx + 1"
              @update-quantity="setQuantity(line.product.id, $event)"
              @remove="remove(line.product.id)"
            />
          </div>

          <div class="cart-page__checkout-row">
            <NuxtLink to="/catalog" class="btn btn--outline">
              <UiAppIcon name="lucide:arrow-left" :size="16" />
              В каталог
            </NuxtLink>
            <NuxtLink to="/checkout" class="btn btn--primary btn--lg cart-page__checkout-btn">
              Оформить заказ
              <UiAppIcon name="lucide:arrow-right" :size="20" />
            </NuxtLink>
          </div>
        </section>

        <CartSummary
          :subtotal="subtotal"
          :item-count="count"
          :savings="totalSavings"
          :free-delivery-from="FREE_DELIVERY_FROM"
        />
      </div>
    </div>

    <!-- Мобильная панель оформления -->
    <div v-if="!isEmpty" class="cart-page__mobile-bar">
      <div class="cart-page__mobile-bar-inner container">
        <div>
          <span class="cart-page__mobile-label">{{ count }} {{ pluralItems(count) }}</span>
          <strong class="cart-page__mobile-total">{{ formatPrice(subtotal) }}</strong>
        </div>
        <NuxtLink to="/checkout" class="btn btn--primary btn--lg">
          Оформить заказ
          <UiAppIcon name="lucide:arrow-right" :size="18" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  position: relative;
  padding-bottom: 5rem;
}

.cart-page__hero {
  position: absolute;
  inset: 0 0 auto;
  height: 200px;
  background: linear-gradient(180deg, #e8eef5 0%, var(--color-bg) 100%);
  pointer-events: none;
}

.cart-page__breadcrumbs {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding-top: 1.25rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.cart-page__breadcrumbs a:hover {
  color: var(--color-primary);
}

.cart-page__head {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.25rem;
  padding-block: 1.25rem 1.75rem;
}

.cart-page__title {
  margin: 0;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.cart-page__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.cart-page__steps {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.cart-page__step {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.cart-page__step--active {
  color: var(--color-accent);
}

.cart-page__step-num {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 800;
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
}

.cart-page__step--active .cart-page__step-num {
  background: var(--color-primary);
  color: #fff;
}

.cart-page__step-line {
  width: 24px;
  height: 2px;
  background: var(--color-border);
  flex-shrink: 0;
}

.cart-page__toast {
  position: fixed;
  bottom: 5.5rem;
  right: 1.5rem;
  z-index: 200;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  max-width: 360px;
  padding: 1rem 1.15rem;
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: #fff;
  box-shadow: var(--shadow-lg);
}

.cart-page__toast strong {
  display: block;
  font-size: 0.95rem;
}

.cart-page__toast span {
  font-size: 0.82rem;
  opacity: 0.9;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.cart-page__empty {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3.5rem 1.5rem;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.cart-page__empty-visual {
  position: relative;
  margin-bottom: 1.5rem;
}

.cart-page__empty-icon {
  display: grid;
  place-items: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary-soft), #fff);
  color: var(--color-primary);
}

.cart-page__empty-ring {
  position: absolute;
  inset: -12px;
  border: 2px dashed var(--color-border);
  border-radius: 50%;
  animation: spin-slow 24s linear infinite;
}

@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}

.cart-page__empty h2 {
  margin: 0 0 0.5rem;
  font-size: 1.35rem;
}

.cart-page__empty p {
  margin: 0 0 1.5rem;
  max-width: 360px;
  color: var(--color-text-muted);
}

.cart-page__empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.cart-page__layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 1.75rem;
  align-items: start;
}

.cart-page__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.cart-page__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.cart-page__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.cart-page__chip--ok {
  background: #ecfdf5;
  border-color: #86efac;
  color: var(--color-success);
}

.cart-page__chip--sale {
  background: var(--color-primary-soft);
  border-color: rgba(232, 93, 4, 0.3);
  color: var(--color-primary);
}

.cart-page__clear {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.cart-page__clear:hover {
  border-color: #fecaca;
  background: #fef2f2;
  color: #dc2626;
}

.cart-list {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.cart-page__checkout-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.25rem;
}

.cart-page__checkout-btn {
  margin-left: auto;
}

.cart-page__mobile-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 90;
  padding: 0.85rem 0;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.1);
}

.cart-page__mobile-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.cart-page__mobile-label {
  display: block;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.cart-page__mobile-total {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-accent);
}

@media (max-width: 900px) {
  .cart-page__layout {
    grid-template-columns: 1fr;
  }

  .cart-page__checkout-row {
    display: none;
  }

  .cart-page__steps {
    display: none;
  }

  .cart-page__mobile-bar {
    display: block;
  }

  .cart-page {
    padding-bottom: 6rem;
  }
}

@media (max-width: 520px) {
  .cart-page__toast {
    left: 1rem;
    right: 1rem;
    bottom: 5.5rem;
  }
}
</style>
