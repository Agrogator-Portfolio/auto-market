<script setup lang="ts">
import type { ServiceAppointment, ServiceAppointmentStatus } from '~/data/service'
import { serviceStatusFilters } from '~/data/service'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { listAppointments } = useServiceBooking()

const appointments = ref<ServiceAppointment[]>([])
const loading = ref(true)

const statusFilter = computed<ServiceAppointmentStatus | 'all'>(() => {
  const q = String(route.query.status ?? 'all')
  return serviceStatusFilters.some((f) => f.value === q) ? (q as ServiceAppointmentStatus | 'all') : 'all'
})

async function load() {
  loading.value = true
  try {
    appointments.value = await listAppointments(
      statusFilter.value === 'all' ? undefined : statusFilter.value,
    )
  } finally {
    loading.value = false
  }
}

function setStatus(status: ServiceAppointmentStatus | 'all') {
  navigateTo({
    path: '/account/service',
    query: { status: status === 'all' ? undefined : status },
  })
}

watch(statusFilter, load, { immediate: true })
useHead({ title: 'Запись в автосервис — АвтоДеталь' })
</script>

<template>
  <div class="account-page">
    <div class="container account-page__layout">
      <AccountNav />

      <div class="account-page__content">
        <header class="account-page__header account-page__header--row">
          <div>
            <h1>Запись в автосервис</h1>
            <p>Ваши обращения и статусы записи</p>
          </div>
          <NuxtLink to="/account/service/book" class="btn btn--primary">
            <UiAppIcon name="lucide:calendar-plus" :size="18" />
            Записаться
          </NuxtLink>
        </header>

        <div class="account-filters">
          <div class="account-filters__status">
            <button
              v-for="f in serviceStatusFilters"
              :key="f.value"
              type="button"
              class="account-filters__pill"
              :class="{ 'account-filters__pill--active': statusFilter === f.value }"
              @click="setStatus(f.value)"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="account-empty">
          <p>Загрузка…</p>
        </div>

        <div v-else-if="appointments.length" class="account-orders">
          <ServiceAppointmentCard
            v-for="item in appointments"
            :key="item.id"
            :appointment="item"
          />
        </div>

        <div v-else class="account-empty">
          <UiAppIcon name="lucide:wrench" :size="48" />
          <h2>Обращений пока нет</h2>
          <p>Запишитесь в партнёрский автосервис — выберите авто из гаража и опишите проблему</p>
          <NuxtLink to="/account/service/book" class="btn btn--primary">Записаться в автосервис</NuxtLink>
        </div>
      </div>
    </div>
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

.account-page__header h1 {
  margin: 0 0 0.35rem;
  font-size: 1.75rem;
  font-weight: 800;
}

.account-page__header p {
  margin: 0;
  color: var(--color-text-muted);
}

.account-page__header--row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.account-filters {
  margin-bottom: 1.5rem;
}

.account-filters__status {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.account-filters__pill {
  padding: 0.45rem 0.85rem;
  border: 1.5px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
}

.account-filters__pill--active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.account-orders {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.account-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .account-page__layout {
    grid-template-columns: 1fr;
  }

  .account-page__header--row {
    flex-direction: column;
  }
}
</style>
