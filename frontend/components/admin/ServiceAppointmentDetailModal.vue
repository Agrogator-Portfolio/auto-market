<script setup lang="ts">
import type { ServiceAppointment } from '~/data/service'
import { formatServiceDate, formatServiceDateShort } from '~/data/service'
import { formatPrice } from '~/data/catalog'

defineProps<{
  open: boolean
  appointment: ServiceAppointment | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  schedule: [appointment: ServiceAppointment]
  reject: [appointment: ServiceAppointment]
  recommend: [appointment: ServiceAppointment]
}>()
</script>

<template>
  <UiAdminModal
    :open="open && !!appointment"
    :title="appointment ? `Обращение ${appointment.number}` : 'Обращение'"
    :subtitle="appointment ? formatServiceDateShort(appointment.createdAt) : undefined"
    size="xl"
    @close="emit('close')"
  >
    <div v-if="appointment" class="svc-modal">
      <span v-if="appointment.status === 'rejected'" class="admin-badge admin-badge--danger">
        <UiAppIcon name="lucide:circle-x" :size="14" />
        Отклонена
      </span>

      <div v-if="appointment.status === 'scheduled' && appointment.scheduledAt" class="svc-modal__scheduled">
        <UiAppIcon name="lucide:calendar-check" :size="18" />
        Запись: {{ formatServiceDate(appointment.scheduledAt) }}
      </div>

      <div v-if="appointment.rejectReason && appointment.status === 'rejected'" class="svc-modal__reject">
        {{ appointment.rejectReason }}
      </div>

      <div class="svc-modal__top">
        <section class="svc-modal__block">
          <h3><UiAppIcon name="lucide:user" :size="16" /> Клиент</h3>
          <dl v-if="appointment.user">
            <div><dt>ФИО</dt><dd>{{ appointment.user.fullName }}</dd></div>
            <div><dt>Email</dt><dd>{{ appointment.user.email }}</dd></div>
            <div><dt>Телефон</dt><dd>{{ appointment.user.phone }}</dd></div>
          </dl>
        </section>
        <section class="svc-modal__block">
          <h3><UiAppIcon name="lucide:car" :size="16" /> Автомобиль</h3>
          <dl>
            <div><dt>Модель</dt><dd>{{ appointment.vehicle.label }}, {{ appointment.vehicle.year }}</dd></div>
            <div v-if="appointment.vehicle.nickname"><dt>Название</dt><dd>{{ appointment.vehicle.nickname }}</dd></div>
          </dl>
        </section>
      </div>

      <section class="svc-modal__block svc-modal__block--full">
        <h3><UiAppIcon name="lucide:building-2" :size="16" /> Автосервис</h3>
        <dl>
          <div><dt>Название</dt><dd>{{ appointment.autoService.name }}</dd></div>
          <div><dt>Город</dt><dd>{{ appointment.autoService.city }}</dd></div>
          <div><dt>Адрес</dt><dd>{{ appointment.autoService.address }}</dd></div>
          <div><dt>Режим работы</dt><dd>{{ appointment.autoService.workSchedule }}</dd></div>
        </dl>
        <div class="svc-modal__tags">
          <span v-for="cat in appointment.autoService.categories" :key="cat.id">{{ cat.name }}</span>
        </div>
      </section>

      <section class="svc-modal__block svc-modal__block--full">
        <h3><UiAppIcon name="lucide:list-checks" :size="16" /> Запрошенные работы</h3>
        <div class="svc-modal__tags">
          <span v-for="cat in appointment.requestedCategories" :key="cat.id">{{ cat.name }}</span>
        </div>
      </section>

      <section class="svc-modal__block svc-modal__block--full">
        <h3><UiAppIcon name="lucide:message-square" :size="16" /> Проблема</h3>
        <p class="svc-modal__problem">{{ appointment.problemDescription }}</p>
      </section>

      <section v-if="appointment.recommendedProducts?.length" class="svc-modal__block svc-modal__block--full">
        <h3><UiAppIcon name="lucide:package" :size="16" /> Рекомендованные товары</h3>
        <ul class="svc-modal__products">
          <li v-for="p in appointment.recommendedProducts" :key="p.id">
            <span>{{ p.name }}</span>
            <span>{{ formatPrice(p.price) }}</span>
          </li>
        </ul>
      </section>

      <footer v-if="appointment.status !== 'rejected'" class="svc-modal__actions">
        <button type="button" class="btn btn--outline btn--danger" :disabled="busy" @click="emit('reject', appointment)">
          Отклонить
        </button>
        <button type="button" class="btn btn--outline" :disabled="busy" @click="emit('recommend', appointment)">
          Рекомендовать товары
        </button>
        <button type="button" class="btn btn--primary" :disabled="busy" @click="emit('schedule', appointment)">
          {{ appointment.status === 'scheduled' ? 'Изменить время' : 'Записать' }}
        </button>
      </footer>
    </div>
  </UiAdminModal>
</template>

<style scoped>
.svc-modal__scheduled {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-sm);
  background: #ecfdf5;
  color: #047857;
  font-weight: 600;
  font-size: 0.9rem;
}

.svc-modal__reject {
  margin: 0.75rem 0;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-sm);
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.9rem;
}

.svc-modal__top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.svc-modal__block h3 {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.65rem;
  font-size: 0.9rem;
}

.svc-modal__block dl {
  margin: 0;
  display: grid;
  gap: 0.45rem;
}

.svc-modal__block dl > div {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 0.5rem;
  font-size: 0.88rem;
}

.svc-modal__block dt {
  color: #64748b;
  font-weight: 600;
}

.svc-modal__block dd {
  margin: 0;
}

.svc-modal__block--full {
  margin-top: 1rem;
}

.svc-modal__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.65rem;
}

.svc-modal__tags span {
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: #f1f5f9;
  font-size: 0.75rem;
  font-weight: 600;
}

.svc-modal__problem {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.5;
  font-size: 0.9rem;
}

.svc-modal__products {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.svc-modal__products li {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.88rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.svc-modal__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e2e8f0;
}

.btn--danger {
  color: #dc2626;
  border-color: #fecaca;
}

.btn--danger:hover {
  background: #fef2f2;
}

@media (max-width: 768px) {
  .svc-modal__top {
    grid-template-columns: 1fr;
  }
}
</style>
