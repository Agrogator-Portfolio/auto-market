<script setup lang="ts">
import type { ServiceAppointment } from '~/data/service'
import { formatServiceDateShort, serviceStatusMeta } from '~/data/service'

defineProps<{
  appointment: ServiceAppointment
}>()
</script>

<template>
  <NuxtLink :to="`/account/service/${appointment.id}`" class="service-card">
    <div class="service-card__head">
      <div>
        <span class="service-card__number">{{ appointment.number }}</span>
        <p class="service-card__service">{{ appointment.autoService.name }}</p>
      </div>
      <span class="service-card__badge" :class="`service-card__badge--${serviceStatusMeta[appointment.status].tone}`">
        <UiAppIcon :name="serviceStatusMeta[appointment.status].icon" :size="14" />
        {{ serviceStatusMeta[appointment.status].label }}
      </span>
    </div>
    <p class="service-card__vehicle">
      <UiAppIcon name="lucide:car" :size="16" />
      {{ appointment.vehicle.label }}, {{ appointment.vehicle.year }}
    </p>
    <p class="service-card__problem">{{ appointment.problemDescription }}</p>
    <p class="service-card__meta">
      <span>{{ formatServiceDateShort(appointment.createdAt) }}</span>
      <span v-if="appointment.scheduledAt">
        · Запись: {{ formatServiceDateShort(appointment.scheduledAt) }}
      </span>
    </p>
  </NuxtLink>
</template>

<style scoped>
.service-card {
  display: block;
  padding: 1.25rem 1.35rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.service-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.service-card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.65rem;
}

.service-card__number {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.service-card__service {
  margin: 0.2rem 0 0;
  font-size: 1.05rem;
  font-weight: 800;
}

.service-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.service-card__badge--warning {
  background: #fef3c7;
  color: #b45309;
}

.service-card__badge--success {
  background: #d1fae5;
  color: #047857;
}

.service-card__badge--danger {
  background: #fee2e2;
  color: #b91c1c;
}

.service-card__vehicle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.5rem;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.service-card__problem {
  margin: 0 0 0.65rem;
  font-size: 0.9rem;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-card__meta {
  margin: 0;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}
</style>
