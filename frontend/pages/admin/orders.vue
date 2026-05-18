<script setup lang="ts">
import type { AdminOrder } from '~/composables/useAdmin'
import { formatOrderDate, formatPrice, orderStatusMeta } from '~/data/orders'
import type { OrderStatus } from '~/data/orders'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { listOrders, updateOrderStatus, getOrder } = useAdmin()
const { show } = useToast()

const orders = ref<AdminOrder[]>([])
const loading = ref(true)
const statusFilter = ref<OrderStatus | 'all'>('all')
const busyId = ref<string | null>(null)

const detailOpen = ref(false)
const detailOrder = ref<AdminOrder | null>(null)
const detailLoading = ref(false)

const confirmOpen = ref(false)
const orderToAdvance = ref<AdminOrder | null>(null)

const confirmTitle = computed(() => {
  if (!orderToAdvance.value) return 'Сменить статус?'
  const next = adminNextStatus[orderToAdvance.value.status]
  if (!next) return 'Сменить статус?'
  return `Перевести в «${orderStatusMeta[next].label}»?`
})

const confirmMessage = computed(() => {
  if (!orderToAdvance.value) return ''
  const next = adminNextStatus[orderToAdvance.value.status]
  if (!next) return ''
  return `Заказ ${orderToAdvance.value.number} будет переведён из «${orderStatusMeta[orderToAdvance.value.status].label}» в «${orderStatusMeta[next].label}».`
})

const filterOptions: Array<{ value: OrderStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'pending_confirmation', label: orderStatusMeta.pending_confirmation.label },
  { value: 'in_progress', label: orderStatusMeta.in_progress.label },
  { value: 'awaiting_pickup', label: orderStatusMeta.awaiting_pickup.label },
  { value: 'completed', label: orderStatusMeta.completed.label },
]

const adminNextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  pending_confirmation: 'in_progress',
  in_progress: 'awaiting_pickup',
}

async function load() {
  loading.value = true
  try {
    orders.value = await listOrders(statusFilter.value)
  } finally {
    loading.value = false
  }
}

async function openDetail(order: AdminOrder) {
  detailOpen.value = true
  detailLoading.value = true
  detailOrder.value = order
  try {
    detailOrder.value = await getOrder(order.id)
  } catch {
    show('Не удалось загрузить заказ', 'error')
    detailOpen.value = false
  } finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  detailOpen.value = false
  detailOrder.value = null
}

function requestAdvance(order: AdminOrder) {
  orderToAdvance.value = order
  confirmOpen.value = true
}

function closeConfirm() {
  if (busyId.value) return
  confirmOpen.value = false
  orderToAdvance.value = null
}

async function confirmAdvance() {
  if (!orderToAdvance.value) return
  await advance(orderToAdvance.value, detailOpen.value)
  confirmOpen.value = false
  orderToAdvance.value = null
}

async function advance(order: AdminOrder, fromModal = false) {
  const next = adminNextStatus[order.status]
  if (!next) return
  busyId.value = order.id
  try {
    await updateOrderStatus(order.id, next)
    show(`Статус: ${orderStatusMeta[next].label}`, 'success')
    await load()
    if (fromModal && detailOpen.value) {
      detailOrder.value = await getOrder(order.id)
    }
  } catch {
    show('Не удалось сменить статус', 'error')
  } finally {
    busyId.value = null
  }
}

watch(statusFilter, load)
onMounted(load)
useHead({ title: 'Заказы — Админка' })
</script>

<template>
  <div class="admin-page">
    <header class="admin-page-header">
      <div>
        <h1>Заказы</h1>
        <p>Обработка заявок, доставка и смена статусов</p>
      </div>
      <div class="admin-filter-pills">
        <button
          v-for="opt in filterOptions"
          :key="opt.value"
          type="button"
          class="admin-filter-pill"
          :class="{ 'admin-filter-pill--active': statusFilter === opt.value }"
          @click="statusFilter = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </header>

    <div v-if="loading" class="admin-page__muted">Загрузка…</div>

    <div v-else class="admin-card admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Заказ</th>
            <th>Клиент</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-if="!orders.length">
            <td colspan="5" class="admin-table__empty">Заказов нет</td>
          </tr>
          <tr v-for="o in orders" :key="o.id">
            <td>
              <strong>{{ o.number }}</strong>
              <span class="admin-table__sub">{{ formatOrderDate(o.createdAt) }}</span>
            </td>
            <td>
              {{ o.user.fullName }}
              <span class="admin-table__sub">{{ o.user.email }}</span>
            </td>
            <td><strong>{{ formatPrice(o.total) }}</strong></td>
            <td>
              <span class="admin-badge" :class="`admin-badge--${orderStatusMeta[o.status].tone}`">
                {{ orderStatusMeta[o.status].label }}
              </span>
            </td>
            <td class="admin-table__actions">
              <button type="button" class="btn btn--admin-primary btn--sm" @click="openDetail(o)">
                Подробнее
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminOrderDetailModal
      :open="detailOpen"
      :order="detailLoading ? null : detailOrder"
      :busy="busyId === detailOrder?.id"
      @close="closeDetail"
      @request-advance="requestAdvance"
    />

    <UiConfirmModal
      :open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      confirm-label="Да, сменить статус"
      variant="admin"
      icon="lucide:arrow-right-circle"
      :loading="!!busyId"
      @close="closeConfirm"
      @confirm="confirmAdvance"
    />
  </div>
</template>

<style scoped>
.admin-page__muted {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

.admin-table__empty {
  text-align: center;
  color: #94a3b8;
  padding: 2rem !important;
}

.admin-table__actions {
  text-align: right;
  white-space: nowrap;
}
</style>
