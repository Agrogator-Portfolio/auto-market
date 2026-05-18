<script setup lang="ts">
import type { ServiceAppointment } from '~/data/service'
import { formatServiceDate, formatServiceDateShort } from '~/data/service'
import { formatPrice, getCategoryBySlug } from '~/data/catalog'

definePageMeta({ middleware: 'auth' })

const BUILT_ORDERS_STORAGE = 'autodetail-service-built-orders'

function getBuiltOrderIds(): string[] {
  if (!import.meta.client) return []
  try {
    const raw = localStorage.getItem(BUILT_ORDERS_STORAGE)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function markOrderBuilt(appointmentId: string) {
  if (!import.meta.client) return
  const ids = new Set(getBuiltOrderIds())
  ids.add(appointmentId)
  localStorage.setItem(BUILT_ORDERS_STORAGE, JSON.stringify([...ids]))
}

const route = useRoute()
const router = useRouter()
const appointmentId = computed(() => String(route.params.id))
const { getAppointment } = useServiceBooking()
const { addMany } = useCart()
const { show: showToast } = useToast()

const appointment = ref<ServiceAppointment | null>(null)
const pending = ref(true)
const buildingOrder = ref(false)
const orderAlreadyBuilt = ref(false)
const justCreated = computed(() => route.query.created === '1')

async function onBuildOrder() {
  const products = appointment.value?.recommendedProducts ?? []
  if (!products.length || buildingOrder.value || orderAlreadyBuilt.value) return

  buildingOrder.value = true
  try {
    const added = await addMany(products.map((p) => p.id))
    if (!added) return
    markOrderBuilt(appointmentId.value)
    orderAlreadyBuilt.value = true
    showToast(`В корзину добавлено: ${products.length}`, 'success')
    await router.push('/cart')
  } catch {
    showToast('Не удалось собрать заказ', 'error')
  } finally {
    buildingOrder.value = false
  }
}

onMounted(async () => {
  orderAlreadyBuilt.value = getBuiltOrderIds().includes(appointmentId.value)
  try {
    appointment.value = await getAppointment(appointmentId.value)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Обращение не найдено' })
  } finally {
    pending.value = false
  }
})

useHead(() => ({
  title: appointment.value
    ? `${appointment.value.number} — АвтоДеталь`
    : 'Обращение — АвтоДеталь',
}))
</script>

<template>
  <div class="account-page">
    <div class="container account-page__layout">
      <AccountNav />

      <div v-if="pending" class="account-page__content">
        <p>Загрузка…</p>
      </div>

      <div v-else-if="appointment" class="account-page__content service-detail">
        <NuxtLink to="/account/service" class="detail-back">
          <UiAppIcon name="lucide:arrow-left" :size="18" />
          К списку обращений
        </NuxtLink>

        <div v-if="justCreated" class="detail-banner">
          <UiAppIcon name="lucide:check-circle" :size="20" />
          Заявка отправлена. Администратор подтвердит дату и время записи.
        </div>

        <header class="detail-header">
          <div>
            <span class="detail-number">{{ appointment.number }}</span>
            <h1>{{ appointment.autoService.name }}</h1>
            <p>{{ appointment.autoService.city }} · {{ appointment.autoService.address }}</p>
          </div>
          <span
            v-if="appointment.status === 'rejected'"
            class="detail-status detail-status--danger"
          >
            <UiAppIcon name="lucide:circle-x" :size="16" />
            Отклонена
          </span>
        </header>

        <section v-if="appointment.status === 'pending'" class="detail-waiting">
          <UiAppIcon name="lucide:clock" :size="22" />
          <div>
            <strong>Ожидайте подтверждения</strong>
            <p>
              Менеджер проверит заявку и назначит точную дату и время записи. Статус обновится здесь.
            </p>
          </div>
        </section>

        <section
          v-else-if="appointment.status === 'scheduled' && appointment.scheduledAt"
          class="detail-scheduled"
        >
          <UiAppIcon name="lucide:calendar-clock" :size="22" />
          <div>
            <strong>Вы записаны</strong>
            <p>{{ formatServiceDate(appointment.scheduledAt) }}</p>
          </div>
        </section>

        <section v-if="appointment.status === 'rejected'" class="detail-rejected">
          <UiAppIcon name="lucide:info" :size="20" />
          <p>{{ appointment.rejectReason ?? 'Заявка отклонена' }}</p>
        </section>

        <div class="detail-grid">
          <section class="detail-block">
            <h2>Автомобиль</h2>
            <p>
              <strong>{{ appointment.vehicle.label }}</strong>, {{ appointment.vehicle.year }} г.
              <span v-if="appointment.vehicle.nickname"> · {{ appointment.vehicle.nickname }}</span>
            </p>
          </section>
          <section class="detail-block">
            <h2>Режим работы СТО</h2>
            <p>{{ appointment.autoService.workSchedule }}</p>
          </section>
          <section class="detail-block detail-block--full">
            <h2>Запрошенные работы</h2>
            <div class="detail-tags">
              <span v-for="cat in appointment.requestedCategories" :key="cat.id">
                {{ cat.name }}
              </span>
            </div>
          </section>
          <section class="detail-block detail-block--full">
            <h2>Описание проблемы</h2>
            <p class="detail-problem">{{ appointment.problemDescription }}</p>
          </section>
          <section class="detail-block detail-block--full">
            <h2>Виды работ в СТО</h2>
            <div class="detail-tags">
              <span v-for="cat in appointment.autoService.categories" :key="cat.id">
                {{ cat.name }}
              </span>
            </div>
          </section>
        </div>

        <section v-if="appointment.recommendedProducts?.length" class="detail-recommend">
          <div class="detail-recommend__head">
            <UiAppIcon name="lucide:package-check" :size="24" />
            <div class="detail-recommend__intro">
              <h2>Рекомендованные запчасти</h2>
              <p>Менеджер подобрал детали под ваш автомобиль</p>
            </div>
            <button
              v-if="!orderAlreadyBuilt"
              type="button"
              class="btn btn--primary detail-recommend__order-btn"
              :disabled="buildingOrder"
              @click="onBuildOrder"
            >
              <UiAppIcon name="lucide:shopping-cart" :size="18" />
              {{ buildingOrder ? 'Добавляем…' : 'Собрать заказ' }}
            </button>
            <p v-else class="detail-recommend__built">
              <UiAppIcon name="lucide:check" :size="16" />
              Заказ уже собран
              <NuxtLink to="/cart">Перейти в корзину</NuxtLink>
            </p>
          </div>
          <ul class="detail-recommend__list">
            <li v-for="p in appointment.recommendedProducts" :key="p.id">
              <NuxtLink :to="`/catalog/${p.categorySlug}/${p.id}`" class="detail-recommend__item">
                <div>
                  <span class="detail-recommend__cat">{{ getCategoryBySlug(p.categorySlug)?.name }}</span>
                  <strong>{{ p.name }}</strong>
                  <span class="detail-recommend__meta">{{ p.brand }} · OEM {{ p.oem }}</span>
                </div>
                <div class="detail-recommend__price">
                  <span>{{ formatPrice(p.price) }}</span>
                  <span class="detail-recommend__link">В каталог</span>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </section>

        <p class="detail-meta">
          Заявка создана {{ formatServiceDateShort(appointment.createdAt) }}
        </p>
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

.detail-back {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 1rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.detail-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-md);
  background: #d1fae5;
  color: #047857;
  font-weight: 600;
  font-size: 0.9rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-number {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.detail-header h1 {
  margin: 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 800;
}

.detail-header p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.detail-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}

.detail-status--warning {
  background: #fef3c7;
  color: #b45309;
}

.detail-status--success {
  background: #d1fae5;
  color: #047857;
}

.detail-status--danger {
  background: #fee2e2;
  color: #b91c1c;
}

.detail-waiting {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.1rem 1.25rem;
  margin-bottom: 1.5rem;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  color: #9a3412;
  border: 1px solid #fed7aa;
}

.detail-waiting strong {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 1.05rem;
}

.detail-waiting p {
  margin: 0;
  line-height: 1.45;
  font-size: 0.92rem;
}

.detail-scheduled {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.1rem 1.25rem;
  margin-bottom: 1.5rem;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.detail-scheduled strong {
  display: block;
  margin-bottom: 0.2rem;
}

.detail-scheduled p {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.detail-rejected {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--radius-md);
  background: #fef2f2;
  color: #b91c1c;
}

.detail-rejected p {
  margin: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-block {
  padding: 1rem 1.15rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.detail-block--full {
  grid-column: 1 / -1;
}

.detail-block h2 {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.detail-block p {
  margin: 0;
  line-height: 1.5;
}

.detail-problem {
  white-space: pre-wrap;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.detail-tags span {
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: var(--color-bg);
  font-size: 0.82rem;
  font-weight: 600;
}

.detail-recommend {
  margin-top: 1.75rem;
  padding: 1.35rem 1.5rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
}

.detail-recommend__head {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 1.15rem;
  color: #0c4a6e;
}

.detail-recommend__intro {
  flex: 1;
  min-width: 12rem;
}

.detail-recommend__order-btn {
  margin-left: auto;
  flex-shrink: 0;
}

.detail-recommend__built {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0 auto;
  padding: 0.55rem 0.85rem;
  border-radius: var(--radius-sm);
  background: #fff;
  border: 1px solid #a7f3d0;
  font-size: 0.88rem;
  font-weight: 600;
  color: #047857;
}

.detail-recommend__built a {
  margin-left: 0.35rem;
  color: var(--color-primary);
  font-weight: 700;
}

.detail-recommend__built a:hover {
  text-decoration: underline;
}

.detail-recommend__head h2 {
  margin: 0 0 0.25rem;
  font-size: 1.15rem;
  font-weight: 800;
}

.detail-recommend__head p {
  margin: 0;
  font-size: 0.88rem;
  opacity: 0.9;
}

.detail-recommend__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.detail-recommend__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-md);
  background: #fff;
  border: 1px solid #e0f2fe;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.detail-recommend__item:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.detail-recommend__cat {
  display: inline-block;
  margin-bottom: 0.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-primary);
}

.detail-recommend__item strong {
  display: block;
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
}

.detail-recommend__meta {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.detail-recommend__price {
  text-align: right;
  flex-shrink: 0;
}

.detail-recommend__price > span:first-child {
  display: block;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--color-accent);
}

.detail-recommend__link {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-primary);
}

.detail-meta {
  margin: 1.25rem 0 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .account-page__layout {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-header {
    flex-direction: column;
  }
}
</style>
