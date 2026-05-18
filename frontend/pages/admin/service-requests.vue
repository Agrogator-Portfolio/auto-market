<script setup lang="ts">
import type { ServiceAppointment, ServiceAppointmentStatus } from '~/data/service'
import { formatServiceDateShort, serviceStatusFilters, serviceStatusMeta } from '~/data/service'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { listAppointments, getAppointment, scheduleAppointment, rejectAppointment } = useAdminService()
const { show } = useToast()

const appointments = ref<ServiceAppointment[]>([])
const loading = ref(true)
const statusFilter = ref<ServiceAppointmentStatus | 'all'>('all')
const busyId = ref<string | null>(null)

const detailOpen = ref(false)
const detailItem = ref<ServiceAppointment | null>(null)
const detailLoading = ref(false)

const scheduleOpen = ref(false)
const scheduleTarget = ref<ServiceAppointment | null>(null)
const scheduleAt = ref('')

const rejectOpen = ref(false)
const rejectTarget = ref<ServiceAppointment | null>(null)

const recommendOpen = ref(false)
const recommendTarget = ref<ServiceAppointment | null>(null)

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

async function openDetail(item: ServiceAppointment) {
  detailOpen.value = true
  detailLoading.value = true
  detailItem.value = item
  try {
    detailItem.value = await getAppointment(item.id)
  } catch {
    show('Не удалось загрузить обращение', 'error')
    detailOpen.value = false
  } finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  detailOpen.value = false
  detailItem.value = null
}

function openSchedule(item: ServiceAppointment) {
  scheduleTarget.value = item
  const d = item.scheduledAt ? new Date(item.scheduledAt) : new Date()
  if (!item.scheduledAt) {
    d.setDate(d.getDate() + 1)
    d.setHours(10, 0, 0, 0)
  }
  scheduleAt.value = toLocalInput(d)
  scheduleOpen.value = true
}

function openRecommend(item: ServiceAppointment) {
  recommendTarget.value = item
  recommendOpen.value = true
}

function closeRecommend() {
  recommendOpen.value = false
  recommendTarget.value = null
}

async function onRecommendSaved() {
  await load()
  if (detailOpen.value && detailItem.value && recommendTarget.value) {
    detailItem.value = await getAppointment(detailItem.value.id)
  }
}

function closeSchedule() {
  if (busyId.value) return
  scheduleOpen.value = false
  scheduleTarget.value = null
}

function openReject(item: ServiceAppointment) {
  rejectTarget.value = item
  rejectOpen.value = true
}

function closeReject() {
  if (busyId.value) return
  rejectOpen.value = false
  rejectTarget.value = null
}

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function confirmSchedule() {
  if (!scheduleTarget.value || !scheduleAt.value) return
  busyId.value = scheduleTarget.value.id
  try {
    const iso = new Date(scheduleAt.value).toISOString()
    await scheduleAppointment(scheduleTarget.value.id, iso)
    show(scheduleTarget.value?.status === 'scheduled' ? 'Время обновлено' : 'Запись осуществлена', 'success')
    scheduleOpen.value = false
    await load()
    if (detailOpen.value && detailItem.value?.id === scheduleTarget.value.id) {
      detailItem.value = await getAppointment(scheduleTarget.value.id)
    }
  } catch {
    show('Не удалось сохранить запись', 'error')
  } finally {
    busyId.value = null
    scheduleTarget.value = null
  }
}

async function confirmReject() {
  if (!rejectTarget.value) return
  busyId.value = rejectTarget.value.id
  try {
    await rejectAppointment(rejectTarget.value.id)
    show('Заявка отклонена', 'success')
    rejectOpen.value = false
    await load()
    if (detailOpen.value && detailItem.value?.id === rejectTarget.value.id) {
      detailItem.value = await getAppointment(rejectTarget.value.id)
    }
  } catch {
    show('Не удалось отклонить заявку', 'error')
  } finally {
    busyId.value = null
    rejectTarget.value = null
  }
}

watch(statusFilter, load)
onMounted(load)
useHead({ title: 'Запись в СТО — Админка' })
</script>

<template>
  <div class="admin-page">
    <header class="admin-page-header">
      <div>
        <h1>Запись в автосервис</h1>
        <p>Обращения клиентов: подтверждение даты или отклонение</p>
      </div>
      <div class="admin-filter-pills">
        <button
          v-for="opt in serviceStatusFilters"
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
            <th>Обращение</th>
            <th>Клиент</th>
            <th>Автосервис</th>
            <th>Статус</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-if="!appointments.length">
            <td colspan="5" class="admin-table__empty">Обращений нет</td>
          </tr>
          <tr v-for="a in appointments" :key="a.id">
            <td>
              <strong>{{ a.number }}</strong>
              <span class="admin-table__sub">{{ formatServiceDateShort(a.createdAt) }}</span>
            </td>
            <td>
              {{ a.user?.fullName ?? '—' }}
              <span class="admin-table__sub">{{ a.vehicle.label }}</span>
            </td>
            <td>
              {{ a.autoService.name }}
              <span class="admin-table__sub">{{ a.autoService.city }}</span>
            </td>
            <td>
              <span class="admin-badge" :class="`admin-badge--${serviceStatusMeta[a.status].tone}`">
                {{ serviceStatusMeta[a.status].label }}
              </span>
            </td>
            <td class="admin-table__actions">
              <button type="button" class="btn btn--admin-primary btn--sm" @click="openDetail(a)">
                Подробнее
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminServiceAppointmentDetailModal
      :open="detailOpen"
      :appointment="detailLoading ? null : detailItem"
      :busy="!!busyId"
      @close="closeDetail"
      @schedule="openSchedule"
      @reject="openReject"
      @recommend="openRecommend"
    />

    <AdminServiceRecommendProductsModal
      :open="recommendOpen"
      :appointment="recommendTarget"
      :busy="!!busyId"
      @close="closeRecommend"
      @saved="onRecommendSaved"
    />

    <UiAdminModal
      :open="scheduleOpen"
      :title="scheduleTarget?.status === 'scheduled' ? 'Изменить дату и время' : 'Назначить дату и время'"
      subtitle="Клиент увидит подтверждённую запись в личном кабинете"
      size="sm"
      @close="closeSchedule"
    >
      <label class="schedule-field">
        <span>Дата и время</span>
        <input v-model="scheduleAt" type="datetime-local" class="schedule-input" />
      </label>
      <template #footer>
        <button type="button" class="btn btn--outline" :disabled="!!busyId" @click="closeSchedule">
          Отмена
        </button>
        <button
          type="button"
          class="btn btn--admin-primary"
          :disabled="!scheduleAt || !!busyId"
          @click="confirmSchedule"
        >
          {{ busyId ? 'Сохранение…' : 'Сохранить' }}
        </button>
      </template>
    </UiAdminModal>

    <UiConfirmModal
      :open="rejectOpen"
      title="Отклонить заявку?"
      :message="rejectTarget ? `Обращение ${rejectTarget.number} будет отклонено. Клиент увидит статус «Отклонена».` : ''"
      confirm-label="Отклонить"
      variant="admin"
      icon="lucide:circle-x"
      :loading="!!busyId"
      @close="closeReject"
      @confirm="confirmReject"
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

.schedule-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.88rem;
  font-weight: 600;
}

.schedule-input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font: inherit;
}
</style>
