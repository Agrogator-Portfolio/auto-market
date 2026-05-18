<script setup lang="ts">
import type { DeliveryMethod, OrderStatus } from '~/data/orders'
import { deliveryLabels, orderStatusMeta } from '~/data/orders'

const props = defineProps<{
  status: OrderStatus
  deliveryMethod: DeliveryMethod
  orderNumber: string
}>()

const statusHint = computed(() => {
  const map: Record<OrderStatus, { title: string; text: string; icon: string }> = {
    pending_confirmation: {
      title: 'Ожидаем подтверждения',
      text: 'Менеджер проверит наличие и свяжется с вами в течение 2 часов в рабочее время.',
      icon: 'lucide:clock',
    },
    in_progress: {
      title: 'Заказ в работе',
      text: 'Запчасти комплектуются на складе. Мы отправим SMS, когда заказ будет готов к выдаче или передаче курьеру.',
      icon: 'lucide:package',
    },
    awaiting_pickup: {
      title: 'Можно забирать',
      text: 'Заказ готов. При получении назовите номер заказа и возьмите документ, удостоверяющий личность.',
      icon: 'lucide:map-pin',
    },
    completed: {
      title: 'Заказ выполнен',
      text: 'Спасибо, что выбрали АвтоДеталь! Сохраните чек — он понадобится при гарантийном обращении.',
      icon: 'lucide:check-circle',
    },
  }
  return map[props.status]
})

const hints = [
  {
    icon: 'lucide:headphones',
    title: 'Поддержка',
    text: '8 (800) 555-12-34 · ежедневно 9:00–21:00',
    link: 'tel:+78005551234',
    linkLabel: 'Позвонить',
  },
  {
    icon: 'lucide:shield-check',
    title: 'Гарантия',
    text: 'Официальная гарантия производителя на все позиции заказа.',
    link: '/catalog',
    linkLabel: 'В каталог',
  },
  {
    icon: 'lucide:rotate-ccw',
    title: 'Возврат',
    text: 'Неиспользованный товар можно вернуть в течение 14 дней по закону.',
    link: null,
    linkLabel: null,
  },
] as const
</script>

<template>
  <aside class="order-hints">
    <div class="order-hints__status" :class="`order-hints__status--${status}`">
      <span class="order-hints__status-icon" aria-hidden="true">
        <UiAppIcon :name="statusHint.icon" :size="22" />
      </span>
      <div class="order-hints__status-body">
        <p class="order-hints__status-label">{{ orderStatusMeta[status].label }}</p>
        <h3 class="order-hints__status-title">{{ statusHint.title }}</h3>
        <p class="order-hints__status-text">{{ statusHint.text }}</p>
        <p class="order-hints__order-num">
          <UiAppIcon name="lucide:hash" :size="14" />
          Номер для обращения: <strong>{{ orderNumber }}</strong>
        </p>
      </div>
    </div>

    <p class="order-hints__delivery">
      <UiAppIcon name="lucide:truck" :size="16" />
      {{ deliveryLabels[deliveryMethod] }}
    </p>

    <ul class="order-hints__cards">
      <li v-for="card in hints" :key="card.title" class="order-hints__card">
        <span class="order-hints__card-icon" aria-hidden="true">
          <UiAppIcon :name="card.icon" :size="20" />
        </span>
        <div>
          <h4>{{ card.title }}</h4>
          <p>{{ card.text }}</p>
          <NuxtLink v-if="card.link" :to="card.link" class="order-hints__card-link">
            {{ card.linkLabel }}
            <UiAppIcon name="lucide:arrow-right" :size="14" />
          </NuxtLink>
        </div>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.order-hints {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-hints__status {
  display: flex;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.order-hints__status--pending_confirmation {
  border-color: #fcd34d;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.order-hints__status--in_progress {
  border-color: #93c5fd;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.order-hints__status--awaiting_pickup {
  border-color: #86efac;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.order-hints__status--completed {
  border-color: #86efac;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.order-hints__status-icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--color-surface);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.order-hints__status-label {
  margin: 0 0 0.2rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.order-hints__status-title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 800;
}

.order-hints__status-text {
  margin: 0 0 0.65rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.order-hints__order-num {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.7);
}

.order-hints__order-num strong {
  color: var(--color-accent);
}

.order-hints__delivery {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.65rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--color-bg);
  border: 1px dashed var(--color-border);
  color: var(--color-text-muted);
}

.order-hints__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.order-hints__card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.order-hints__card:hover {
  border-color: rgba(232, 93, 4, 0.35);
  box-shadow: var(--shadow-sm);
}

.order-hints__card-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.order-hints__card h4 {
  margin: 0 0 0.25rem;
  font-size: 0.88rem;
  font-weight: 800;
}

.order-hints__card p {
  margin: 0 0 0.5rem;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.order-hints__card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-primary);
}

.order-hints__card-link:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .order-hints__cards {
    grid-template-columns: 1fr;
  }
}
</style>
