<script setup lang="ts">
import { deliveryLabels, formatOrderDate, formatPrice, orderStatusMeta } from '~/data/orders'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { getById, confirmReceived } = useOrders()
const { show } = useToast()
const completing = ref(false)
const confirmOpen = ref(false)

const orderId = computed(() => String(route.params.id))
const order = ref<Awaited<ReturnType<typeof getById>>>(null)
const pending = ref(true)
const justCreated = computed(() => route.query.created === '1')

onMounted(async () => {
  order.value = await getById(orderId.value)
  pending.value = false
  if (!order.value) {
    throw createError({ statusCode: 404, statusMessage: 'Заказ не найден' })
  }
})

useHead(() => ({
  title: order.value ? `Заказ ${order.value.number} — АвтоДеталь` : 'Заказ — АвтоДеталь',
}))

const statusSteps = [
  'pending_confirmation',
  'in_progress',
  'awaiting_pickup',
  'completed',
] as const

const currentStepIndex = computed(() =>
  statusSteps.indexOf(order.value!.status),
)

const canConfirmPickup = computed(
  () => order.value?.status === 'awaiting_pickup',
)

function openConfirm() {
  confirmOpen.value = true
}

function closeConfirm() {
  if (completing.value) return
  confirmOpen.value = false
}

async function onConfirmReceived() {
  if (!order.value || completing.value) return
  completing.value = true
  try {
    order.value = await confirmReceived(order.value.id)
    show('Заказ отмечен как полученный', 'success')
    confirmOpen.value = false
  } catch {
    show('Не удалось подтвердить получение', 'error')
  } finally {
    completing.value = false
  }
}
</script>

<template>
  <div v-if="order" class="account-page">
    <div class="container account-page__layout">
      <AccountNav />

      <div class="account-page__content">
        <nav class="order-detail__back">
          <NuxtLink to="/account">
            <UiAppIcon name="lucide:arrow-left" :size="18" />
            К списку заказов
          </NuxtLink>
        </nav>

        <div v-if="justCreated" class="order-detail__success">
          <UiAppIcon name="lucide:check-circle" :size="22" />
          Заказ оформлен! Статус: «{{ orderStatusMeta[order.status].label }}»
        </div>

        <header class="order-detail__head">
          <div>
            <h1>Заказ {{ order.number }}</h1>
            <time :datetime="order.createdAt">{{ formatOrderDate(order.createdAt) }}</time>
          </div>
          <AccountOrderStatusBadge :status="order.status" />
        </header>

        <div class="order-detail__timeline">
          <div
            v-for="(step, index) in statusSteps"
            :key="step"
            class="order-detail__step"
            :class="{
              'order-detail__step--done': index <= currentStepIndex,
              'order-detail__step--current': index === currentStepIndex,
            }"
          >
            <span class="order-detail__step-dot">
              <UiAppIcon
                v-if="index < currentStepIndex"
                name="lucide:check"
                :size="14"
              />
            </span>
            <span class="order-detail__step-label">{{ orderStatusMeta[step].label }}</span>
          </div>
        </div>

        <div class="order-detail__grid">
          <div class="order-detail__main">
            <AccountOrderDetailComposition
              :items="order.items"
              :subtotal="order.subtotal"
            />
            <AccountOrderDetailHints
              :status="order.status"
              :delivery-method="order.deliveryMethod"
              :order-number="order.number"
            />
            <button
              v-if="canConfirmPickup"
              type="button"
              class="btn btn--primary order-detail__confirm"
              :disabled="completing"
              @click="openConfirm"
            >
              <UiAppIcon name="lucide:package-check" :size="18" />
              Подтвердить получение
            </button>
          </div>

          <section class="order-detail__section order-detail__section--aside">
            <h2>Доставка и оплата</h2>
            <dl class="order-detail__meta">
              <dt>Способ</dt>
              <dd>{{ deliveryLabels[order.deliveryMethod] }}</dd>
              <dt>Адрес</dt>
              <dd>{{ order.address }}</dd>
              <dt>Получатель</dt>
              <dd>{{ order.recipientName }}</dd>
              <dt>Телефон</dt>
              <dd>{{ order.phone }}</dd>
              <template v-if="order.comment">
                <dt>Комментарий</dt>
                <dd>{{ order.comment }}</dd>
              </template>
            </dl>
            <dl class="order-detail__totals">
              <div>
                <dt>Товары</dt>
                <dd>{{ formatPrice(order.subtotal) }}</dd>
              </div>
              <div>
                <dt>Доставка</dt>
                <dd>{{ order.deliveryCost === 0 ? 'Бесплатно' : formatPrice(order.deliveryCost) }}</dd>
              </div>
              <div class="order-detail__total">
                <dt>Итого</dt>
                <dd>{{ formatPrice(order.total) }}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>

    <UiConfirmModal
      :open="confirmOpen"
      title="Подтвердить получение заказа?"
      :message="order ? `Заказ ${order.number} будет отмечен как полученный. После этого статус изменится на «Завершён».` : undefined"
      confirm-label="Да, получил заказ"
      icon="lucide:package-check"
      :loading="completing"
      @close="closeConfirm"
      @confirm="onConfirmReceived"
    />
  </div>
</template>

<style scoped>
.account-page {
  padding-block: 2rem 3rem;
}

.account-page__layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.75rem;
  align-items: start;
}

.order-detail__back a {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.order-detail__back a:hover {
  color: var(--color-primary);
}

.order-detail__success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  background: #ecfdf5;
  color: var(--color-success);
  font-weight: 700;
  font-size: 0.9rem;
}

.order-detail__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.order-detail__head h1 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  font-weight: 800;
}

.order-detail__head time {
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.order-detail__timeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.order-detail__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.order-detail__step-dot {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-bg);
  color: #fff;
}

.order-detail__step--done .order-detail__step-dot {
  border-color: var(--color-success);
  background: var(--color-success);
}

.order-detail__step--current .order-detail__step-dot {
  border-color: var(--color-primary);
  background: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-soft);
}

.order-detail__step-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-muted);
  line-height: 1.3;
}

.order-detail__step--done .order-detail__step-label,
.order-detail__step--current .order-detail__step-label {
  color: var(--color-text);
}

.order-detail__grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1.25rem;
  align-items: start;
}

.order-detail__main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-detail__confirm {
  gap: 0.4rem;
}

.order-detail__section {
  padding: 1.35rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.order-detail__section h2 {
  margin: 0 0 1rem;
  font-size: 1.05rem;
  font-weight: 800;
}

.order-detail__meta {
  display: grid;
  gap: 0.65rem;
  margin: 0 0 1.25rem;
}

.order-detail__meta dt {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.order-detail__meta dd {
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
}

.order-detail__totals > div {
  display: flex;
  justify-content: space-between;
  padding-block: 0.35rem;
  font-size: 0.9rem;
}

.order-detail__totals dt {
  color: var(--color-text-muted);
}

.order-detail__totals dd {
  margin: 0;
  font-weight: 700;
}

.order-detail__total {
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.order-detail__total dd {
  font-size: 1.2rem;
  color: var(--color-accent);
}

@media (max-width: 900px) {
  .account-page__layout,
  .order-detail__grid {
    grid-template-columns: 1fr;
  }

  .order-detail__timeline {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
