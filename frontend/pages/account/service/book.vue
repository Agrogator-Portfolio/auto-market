<script setup lang="ts">
import type { AutoServiceCenter, ServiceCategory } from '~/data/service'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const { show } = useToast()
const { vehicles, load: loadGarage } = useGarage()
const { listCategories, listCenters, createAppointment } = useServiceBooking()

const step = ref(1)
const selectedVehicleId = ref('')
const problem = ref('')
const selectedCategoryIds = ref<string[]>([])
const selectedCenterId = ref('')
const categories = ref<ServiceCategory[]>([])
const centers = ref<AutoServiceCenter[]>([])
const loadingCenters = ref(false)
const submitting = ref(false)

const steps = [
  { n: 1, label: 'Автомобиль' },
  { n: 2, label: 'Работы и проблема' },
  { n: 3, label: 'Автосервис' },
]

onMounted(async () => {
  await Promise.all([loadGarage(true), listCategories().then((c) => { categories.value = c })])
  if (vehicles.value.length === 1) {
    selectedVehicleId.value = vehicles.value[0]!.id
  } else {
    const def = vehicles.value.find((v) => v.isDefault)
    if (def) selectedVehicleId.value = def.id
  }
})

function toggleCategory(id: string) {
  const idx = selectedCategoryIds.value.indexOf(id)
  if (idx >= 0) {
    selectedCategoryIds.value = selectedCategoryIds.value.filter((x) => x !== id)
    return
  }
  if (selectedCategoryIds.value.length >= 2) {
    show('Можно выбрать не более 2 видов работ', 'error')
    return
  }
  selectedCategoryIds.value = [...selectedCategoryIds.value, id]
}

async function loadCenters() {
  if (!selectedCategoryIds.value.length) return
  loadingCenters.value = true
  selectedCenterId.value = ''
  try {
    centers.value = await listCenters({ categoryIds: selectedCategoryIds.value })
  } catch {
    show('Не удалось загрузить автосервисы', 'error')
    centers.value = []
  } finally {
    loadingCenters.value = false
  }
}

watch(step, async (s) => {
  if (s === 3) await loadCenters()
})

const canNext = computed(() => {
  if (step.value === 1) return !!selectedVehicleId.value
  if (step.value === 2) {
    return selectedCategoryIds.value.length >= 1 && problem.value.trim().length >= 10
  }
  return !!selectedCenterId.value
})

function next() {
  if (!canNext.value) return
  if (step.value < 3) step.value++
}

function back() {
  if (step.value > 1) step.value--
}

async function submit() {
  if (!canNext.value || submitting.value) return
  submitting.value = true
  try {
    const created = await createAppointment({
      garageVehicleId: selectedVehicleId.value,
      autoServiceId: selectedCenterId.value,
      categoryIds: selectedCategoryIds.value,
      problemDescription: problem.value.trim(),
    })
    show('Заявка отправлена', 'success')
    await router.push(`/account/service/${created.id}?created=1`)
  } catch {
    show('Не удалось отправить заявку', 'error')
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Запись в автосервис — АвтоДеталь' })
</script>

<template>
  <div class="account-page">
    <div class="container account-page__layout">
      <AccountNav />

      <div class="account-page__content">
        <header class="account-page__header">
          <NuxtLink to="/account/service" class="book-back">
            <UiAppIcon name="lucide:arrow-left" :size="18" />
            К обращениям
          </NuxtLink>
          <h1>Запись в автосервис</h1>
          <p>Шаг {{ step }} из 3 — {{ steps[step - 1]?.label }}</p>
        </header>

        <ol class="book-steps">
          <li
            v-for="s in steps"
            :key="s.n"
            class="book-steps__item"
            :class="{
              'book-steps__item--active': step === s.n,
              'book-steps__item--done': step > s.n,
            }"
          >
            <span>{{ s.n }}</span>
            {{ s.label }}
          </li>
        </ol>

        <section v-if="step === 1" class="book-panel">
          <h2>Выберите автомобиль из гаража</h2>
          <p v-if="!vehicles.length" class="book-hint">
            Сначала добавьте автомобиль в
            <NuxtLink to="/account/garage">гараж</NuxtLink>.
          </p>
          <div v-else class="book-vehicles">
            <label
              v-for="v in vehicles"
              :key="v.id"
              class="book-vehicle"
              :class="{ 'book-vehicle--active': selectedVehicleId === v.id }"
            >
              <input v-model="selectedVehicleId" type="radio" name="vehicle" :value="v.id" />
              <div>
                <strong>{{ v.label }}</strong>
                <span>{{ v.year }} г.</span>
                <span v-if="v.nickname" class="book-vehicle__nick">{{ v.nickname }}</span>
              </div>
            </label>
          </div>
        </section>

        <section v-else-if="step === 2" class="book-panel">
          <h2>Виды работ и описание проблемы</h2>
          <p class="book-hint">Выберите 1–2 вида работ — на следующем шаге покажем подходящие автосервисы.</p>
          <div class="book-categories">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              class="book-cat"
              :class="{ 'book-cat--active': selectedCategoryIds.includes(cat.id) }"
              @click="toggleCategory(cat.id)"
            >
              <strong>{{ cat.name }}</strong>
              <span>{{ cat.description }}</span>
            </button>
          </div>
          <p class="book-hint book-hint--small">Выбрано: {{ selectedCategoryIds.length }} / 2</p>
          <h3 class="book-subtitle">Опишите проблему</h3>
          <p class="book-hint">Симптомы, когда проявляется неисправность, что уже проверяли.</p>
          <textarea
            v-model="problem"
            class="book-textarea"
            rows="6"
            placeholder="Например: скрип при торможении, вибрация на скорости от 60 км/ч…"
            maxlength="2000"
          />
          <p class="book-counter">{{ problem.trim().length }} / 2000 (минимум 10 символов)</p>
        </section>

        <section v-else class="book-panel">
          <h2>Выберите автосервис</h2>
          <p class="book-hint">
            Подобрано по видам работ:
            <template v-for="(id, i) in selectedCategoryIds" :key="id">
              {{ categories.find((c) => c.id === id)?.name }}<span v-if="i < selectedCategoryIds.length - 1">, </span>
            </template>
          </p>
          <div v-if="loadingCenters" class="book-hint">Загрузка списка…</div>
          <div v-else-if="!centers.length" class="book-empty">
            <p>По выбранным работам автосервисы не найдены. Вернитесь и измените виды работ.</p>
          </div>
          <div v-else class="book-centers">
            <label
              v-for="c in centers"
              :key="c.id"
              class="book-center"
              :class="{ 'book-center--active': selectedCenterId === c.id }"
            >
              <input v-model="selectedCenterId" type="radio" name="center" :value="c.id" />
              <div class="book-center__main">
                <div class="book-center__head">
                  <strong>{{ c.name }}</strong>
                  <span class="book-center__rating">
                    <UiAppIcon name="lucide:star" :size="14" />
                    {{ c.rating }}
                  </span>
                </div>
                <p class="book-center__city">{{ c.city }} · {{ c.address }}</p>
                <p class="book-center__desc">{{ c.description }}</p>
                <div class="book-center__tags">
                  <span v-for="cat in c.categories" :key="cat.id">{{ cat.name }}</span>
                </div>
                <p class="book-center__schedule">
                  <UiAppIcon name="lucide:clock" :size="14" />
                  {{ c.workSchedule }}
                </p>
              </div>
            </label>
          </div>
        </section>

        <footer class="book-actions">
          <button v-if="step > 1" type="button" class="btn btn--outline" @click="back">Назад</button>
          <button
            v-if="step < 3"
            type="button"
            class="btn btn--primary"
            :disabled="!canNext"
            @click="next"
          >
            Далее
          </button>
          <button
            v-else
            type="button"
            class="btn btn--primary"
            :disabled="!canNext || submitting"
            @click="submit"
          >
            {{ submitting ? 'Отправка…' : 'Отправить заявку' }}
          </button>
        </footer>
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

.book-back {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.account-page__header h1 {
  margin: 0 0 0.35rem;
  font-size: 1.75rem;
  font-weight: 800;
}

.account-page__header p {
  margin: 0 0 1.25rem;
  color: var(--color-text-muted);
}

.book-steps {
  display: flex;
  gap: 0.5rem;
  margin: 0 0 1.5rem;
  padding: 0;
  list-style: none;
}

.book-steps__item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.book-steps__item span {
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--color-border);
  font-size: 0.75rem;
}

.book-steps__item--active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.book-steps__item--active span {
  background: var(--color-primary);
  color: #fff;
}

.book-steps__item--done span {
  background: #059669;
  color: #fff;
}

.book-panel h2 {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
}

.book-hint {
  margin: 0 0 1rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.book-hint--small {
  margin-top: -0.5rem;
  font-size: 0.82rem;
}

.book-subtitle {
  margin: 1.25rem 0 0.35rem;
  font-size: 1rem;
  font-weight: 700;
}

.book-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.book-cat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 0.85rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.book-cat strong {
  font-size: 0.92rem;
}

.book-cat span {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  line-height: 1.35;
}

.book-cat--active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.book-empty {
  padding: 1.5rem;
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-bg);
  border-radius: var(--radius-md);
}

.book-vehicles,
.book-centers {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.book-vehicle,
.book-center {
  display: block;
  cursor: pointer;
}

.book-vehicle input,
.book-center input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.book-vehicle > div,
.book-center__main {
  padding: 1rem 1.1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition: border-color 0.15s;
}

.book-vehicle--active > div,
.book-center--active .book-center__main {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.book-vehicle strong {
  display: block;
  font-size: 1rem;
}

.book-vehicle span {
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.book-vehicle__nick {
  display: block;
  margin-top: 0.25rem;
  font-style: italic;
}

.book-textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font: inherit;
  resize: vertical;
}

.book-counter {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.book-center__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.book-center__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  color: #f59e0b;
  font-weight: 700;
  white-space: nowrap;
}

.book-center__city {
  margin: 0 0 0.5rem;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.book-center__desc {
  margin: 0 0 0.65rem;
  font-size: 0.9rem;
  line-height: 1.45;
}

.book-center__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.65rem;
}

.book-center__tags span {
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: var(--color-bg);
  font-size: 0.75rem;
  font-weight: 600;
}

.book-center__schedule {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.book-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 900px) {
  .account-page__layout {
    grid-template-columns: 1fr;
  }

  .book-steps {
    flex-direction: column;
  }
}
</style>
