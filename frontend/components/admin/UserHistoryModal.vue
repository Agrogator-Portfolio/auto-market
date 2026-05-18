<script setup lang="ts">
import type { AdminOrder, AdminUser } from '~/composables/useAdmin'
import { formatOrderDate, formatPrice } from '~/data/orders'

const props = defineProps<{
  open: boolean
  user: AdminUser | null
}>()

const emit = defineEmits<{ close: [] }>()

const { getUserOrders } = useAdmin()
const orders = ref<AdminOrder[]>([])
const loading = ref(false)
const expandedId = ref<string | null>(null)

watch(
  () => [props.open, props.user?.id] as const,
  async ([open, id]) => {
    if (!open || !id) {
      orders.value = []
      expandedId.value = null
      return
    }
    loading.value = true
    try {
      orders.value = await getUserOrders(id)
    } catch {
      orders.value = []
    } finally {
      loading.value = false
    }
  },
)

function formatRegDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function toggle(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <UiAdminModal
    :open="open && !!user"
    title="История покупок"
    :subtitle="user ? user.fullName : undefined"
    size="xl"
    @close="emit('close')"
  >
    <div v-if="user" class="history-modal">
      <div class="history-modal__profile">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Телефон:</strong> {{ user.phone }}</p>
        <p v-if="user.birthDate"><strong>Дата рождения:</strong> {{ user.birthDate }}</p>
        <p><strong>Регистрация:</strong> {{ formatRegDate(user.createdAt) }}</p>
      </div>

      <p v-if="loading" class="history-modal__muted">Загрузка заказов…</p>
      <p v-else-if="!orders.length" class="history-modal__muted">
        Завершённых заказов пока нет
      </p>

      <ul v-else class="history-modal__list">
        <li v-for="order in orders" :key="order.id" class="history-modal__order">
          <button type="button" class="history-modal__order-head" @click="toggle(order.id)">
            <span>
              <strong>{{ order.number }}</strong>
              <small>{{ formatOrderDate(order.createdAt) }}</small>
            </span>
            <span class="history-modal__order-total">{{ formatPrice(order.total) }}</span>
            <UiAppIcon
              :name="expandedId === order.id ? 'lucide:chevron-up' : 'lucide:chevron-down'"
              :size="18"
            />
          </button>
          <ul v-if="expandedId === order.id" class="history-modal__items">
            <li v-for="item in order.items" :key="item.sku + item.productId">
              <span>{{ item.name }} × {{ item.quantity }}</span>
              <span>{{ formatPrice(item.price * item.quantity) }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <template #footer>
      <button type="button" class="btn btn--admin-ghost" @click="emit('close')">Закрыть</button>
    </template>
  </UiAdminModal>
</template>

<style scoped>
.history-modal__profile {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 1.25rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f8fafc;
  font-size: 0.88rem;
  color: #475569;
}

.history-modal__profile p {
  margin: 0;
}

.history-modal__muted {
  margin: 0;
  color: #64748b;
  text-align: center;
  padding: 2rem;
}

.history-modal__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-modal__order {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.history-modal__order-head {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border: none;
  background: #fff;
  cursor: pointer;
  text-align: left;
}

.history-modal__order-head strong {
  display: block;
  font-size: 0.9rem;
}

.history-modal__order-head small {
  color: #64748b;
  font-size: 0.78rem;
}

.history-modal__order-total {
  font-weight: 800;
  color: #e85d04;
}

.history-modal__items {
  margin: 0;
  padding: 0.5rem 1rem 0.85rem;
  list-style: none;
  background: #fafbfc;
  border-top: 1px solid #f1f5f9;
}

.history-modal__items li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.35rem 0;
  font-size: 0.85rem;
}
</style>
