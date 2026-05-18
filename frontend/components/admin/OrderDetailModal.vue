<script setup lang="ts">
import type { AdminOrder } from '~/composables/useAdmin'
import { deliveryLabels, formatOrderDate, formatPrice, orderStatusMeta } from '~/data/orders'
import type { DeliveryMethod, OrderStatus } from '~/data/orders'

const props = defineProps<{
  open: boolean
  order: AdminOrder | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  'request-advance': [order: AdminOrder]
}>()

const adminNextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  pending_confirmation: 'in_progress',
  in_progress: 'awaiting_pickup',
}

const nextStatus = computed(() =>
  props.order ? adminNextStatus[props.order.status] : undefined,
)

const statusTone = computed(() => {
  if (!props.order) return 'neutral'
  return orderStatusMeta[props.order.status].tone
})
</script>

<template>
  <UiAdminModal
    :open="open && !!order"
    :title="order ? `Заказ ${order.number}` : 'Заказ'"
    :subtitle="order ? formatOrderDate(order.createdAt) : undefined"
    size="xl"
    @close="emit('close')"
  >
    <div v-if="order" class="order-modal">
      <span class="admin-badge" :class="`admin-badge--${statusTone}`">
        <UiAppIcon :name="orderStatusMeta[order.status].icon" :size="14" />
        {{ orderStatusMeta[order.status].label }}
      </span>
      <div class="order-modal__top">
        <section class="order-modal__block">
          <h3><UiAppIcon name="lucide:user" :size="16" /> Клиент</h3>
          <dl>
            <div><dt>ФИО</dt><dd>{{ order.user.fullName }}</dd></div>
<div><dt>Email</dt><dd>{{ order.user.email }}</dd></div>
            <div><dt>Телефон</dt><dd>{{ order.phone }}</dd></div>
            <div><dt>Получатель</dt><dd>{{ order.recipientName }}</dd></div>
          </dl>
        </section>
        <section class="order-modal__block">
          <h3><UiAppIcon name="lucide:truck" :size="16" /> Доставка</h3>
          <dl>
            <div><dt>Способ</dt><dd>{{ deliveryLabels[order.deliveryMethod as DeliveryMethod] }}</dd></div>
            <div><dt>Адрес</dt><dd>{{ order.address }}</dd></div>
            <div v-if="order.comment"><dt>Комментарий</dt><dd>{{ order.comment }}</dd></div>
          </dl>
        </section>
      </div>

      <h4 class="order-modal__items-title">Состав заказа ({{ order.items.length }})</h4>
      <ul class="order-modal__items">
        <li v-for="item in order.items" :key="`${item.productId}-${item.sku}`" class="order-modal__item">
          <div>
            <p class="order-modal__item-name">{{ item.name }}</p>
            <p class="order-modal__item-meta">{{ item.brand }} · {{ item.sku }}</p>
          </div>
          <div>
            <p class="order-modal__item-price">{{ formatPrice(item.price * item.quantity) }}</p>
            <p class="order-modal__item-qty">× {{ item.quantity }}</p>
          </div>
        </li>
      </ul>

      <div class="order-modal__totals">
        <div><span>Товары</span><span>{{ formatPrice(order.subtotal) }}</span></div>
        <div><span>Доставка</span><span>{{ order.deliveryCost === 0 ? 'Бесплатно' : formatPrice(order.deliveryCost) }}</span></div>
        <div><span>Итого</span><span>{{ formatPrice(order.total) }}</span></div>
      </div>
    </div>
    <template v-if="order" #footer>
      <button type="button" class="btn btn--admin-ghost" @click="emit('close')">Закрыть</button>
      <button v-if="nextStatus" type="button" class="btn btn--admin-primary" :disabled="busy" @click="emit('request-advance', order)">
        <UiAppIcon name="lucide:arrow-right" :size="18" />
        {{ busy ? 'Сохранение…' : orderStatusMeta[nextStatus!].label }}
      </button>
    </template>
  </UiAdminModal>
</template>
<style scoped>
.order-modal { display: flex; flex-direction: column; gap: 1rem; }
.order-modal__top { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.order-modal__block { padding: 1rem; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; }
.order-modal__block h3 { display: flex; align-items: center; gap: 0.4rem; margin: 0 0 0.75rem; font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; }
.order-modal__block dl { display: grid; gap: 0.5rem; margin: 0; }
.order-modal__block dt { font-size: 0.72rem; font-weight: 600; color: #94a3b8; }
.order-modal__block dd { margin: 0; font-size: 0.9rem; font-weight: 600; color: #0f172a; }
.order-modal__items-title { margin: 0 0 0.75rem; font-size: 0.95rem; font-weight: 800; }
.order-modal__items { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
.order-modal__item { display: grid; grid-template-columns: 1fr auto; gap: 0.25rem 1rem; padding: 0.85rem 1rem; border-radius: 10px; border: 1px solid #e2e8f0; background: #fff; }
.order-modal__item-name { margin: 0; font-weight: 700; font-size: 0.9rem; }
.order-modal__item-meta { margin: 0.2rem 0 0; font-size: 0.78rem; color: #64748b; }
.order-modal__item-price { text-align: right; font-weight: 800; color: #e85d04; }
.order-modal__item-qty { font-size: 0.78rem; color: #64748b; }
.order-modal__totals { display: grid; gap: 0.4rem; padding: 1rem; border-radius: 12px; background: #0f172a; color: #fff; }
.order-modal__totals div { display: flex; justify-content: space-between; font-size: 0.88rem; }
.order-modal__totals div:last-child { margin-top: 0.35rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.15); font-size: 1.05rem; font-weight: 800; }
@media (max-width: 700px) { .order-modal__top { grid-template-columns: 1fr; } }
</style>
