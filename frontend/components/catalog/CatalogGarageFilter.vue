<script setup lang="ts">
import { demoGarageHint, seedFitmentProfiles } from '~/data/fitment-guide'

const fitEnabled = defineModel<boolean>('enabled', { required: true })
const vehicleId = defineModel<string>('vehicleId', { required: true })

const { isLoggedIn } = useUser()
const { vehicles, defaultVehicle, load, loaded } = useGarage()

const hintOpen = ref(false)

onMounted(async () => {
  if (isLoggedIn.value) await load()
  if (!vehicleId.value && defaultVehicle.value) {
    vehicleId.value = defaultVehicle.value.id
  }
})

watch(defaultVehicle, (v) => {
  if (v && !vehicleId.value) vehicleId.value = v.id
})

watch(fitEnabled, (on) => {
  if (on && !vehicleId.value && defaultVehicle.value) {
    vehicleId.value = defaultVehicle.value.id
  }
})

function selectVehicle(id: string) {
  vehicleId.value = id
}

function yearInRange(brand: string, model: string, year: number) {
  const p = seedFitmentProfiles.find(
    (x) => x.brand === brand && x.model === model && year >= x.yearFrom && year <= x.yearTo,
  )
  return Boolean(p)
}
</script>

<template>
  <section v-if="isLoggedIn" class="catalog-garage">
    <div class="catalog-garage__head">
      <h3 class="catalog-garage__title">
        <UiAppIcon name="lucide:car" :size="16" />
        Мой гараж
      </h3>
      <button type="button" class="catalog-garage__hint-btn" @click="hintOpen = !hintOpen">
        <UiAppIcon name="lucide:info" :size="14" />
        Какие авто в сиде?
      </button>
    </div>

    <div v-if="hintOpen" class="catalog-garage__hint">
      <p><strong>Демо:</strong> {{ demoGarageHint }}</p>
      <p>Товар подходит, если <strong>марка, модель и год</strong> совпадают с одной из пар в каталоге (у каждого товара — 2 авто):</p>
      <ul>
        <li v-for="p in seedFitmentProfiles" :key="`${p.brand}-${p.model}`">
          {{ p.brand }} {{ p.model }} — годы {{ p.yearFrom }}–{{ p.yearTo }}
        </li>
      </ul>
      <p class="catalog-garage__hint-warn">
        Например, BMW 3 Series <strong>2022</strong> не подойдёт (в сиде до 2020). Mercedes и др. марки вне списка — тоже пусто.
      </p>
    </div>

    <div v-if="!loaded" class="catalog-garage__muted">Загрузка…</div>

    <template v-else-if="vehicles.length">
      <label class="catalog-garage__toggle">
        <input v-model="fitEnabled" type="checkbox" class="catalog-garage__toggle-input" />
        <span class="catalog-garage__toggle-track" aria-hidden="true" />
        <span class="catalog-garage__toggle-label">
          <strong>Только подходящие</strong>
          <small>Фильтр по совместимости с выбранным авто</small>
        </span>
      </label>

      <div v-if="fitEnabled" class="catalog-garage__picker">
        <p class="catalog-garage__picker-label">Выберите автомобиль</p>
        <ul class="catalog-garage__vehicles">
          <li v-for="v in vehicles" :key="v.id">
            <button
              type="button"
              class="catalog-garage__vehicle"
              :class="{ 'catalog-garage__vehicle--active': vehicleId === v.id }"
              @click="selectVehicle(v.id)"
            >
              <span class="catalog-garage__vehicle-icon">
                <UiAppIcon name="lucide:car" :size="18" />
              </span>
              <span class="catalog-garage__vehicle-info">
                <strong>{{ v.brand }} {{ v.model }}</strong>
                <small>
                  {{ v.year }} г.
                  <span v-if="v.nickname"> · {{ v.nickname }}</span>
                  <span v-if="v.isDefault"> · основной</span>
                </small>
                <span
                  v-if="!yearInRange(v.brand, v.model, v.year)"
                  class="catalog-garage__vehicle-warn"
                >
                  Год вне диапазона сида — товаров может не быть
                </span>
              </span>
              <UiAppIcon
                v-if="vehicleId === v.id"
                name="lucide:check-circle"
                :size="20"
                class="catalog-garage__vehicle-check"
              />
            </button>
          </li>
        </ul>
        <NuxtLink to="/account/garage" class="catalog-garage__manage">
          <UiAppIcon name="lucide:settings-2" :size="14" />
          Управление гаражом
        </NuxtLink>
      </div>
    </template>

    <div v-else class="catalog-garage__empty">
      <p>Добавьте автомобиль в гараж для подбора запчастей</p>
      <NuxtLink to="/account/garage" class="btn btn--outline btn--sm">Открыть гараж</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.catalog-garage {
  padding-bottom: 1rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.catalog-garage__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}

.catalog-garage__title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.catalog-garage__hint-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.45rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
}

.catalog-garage__hint-btn:hover {
  background: var(--color-primary-soft);
}

.catalog-garage__hint {
  margin-bottom: 0.85rem;
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-sm);
  background: #f8fafc;
  border: 1px solid var(--color-border);
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.catalog-garage__hint p {
  margin: 0 0 0.5rem;
}

.catalog-garage__hint ul {
  margin: 0 0 0.5rem;
  padding-left: 1.1rem;
  columns: 1;
}

.catalog-garage__hint-warn {
  color: #b45309;
  font-weight: 600;
}

.catalog-garage__muted {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.catalog-garage__toggle {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  cursor: pointer;
  margin-bottom: 0.85rem;
}

.catalog-garage__toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.catalog-garage__toggle-track {
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 24px;
  margin-top: 0.1rem;
  border-radius: 999px;
  background: var(--color-border);
  transition: background 0.2s;
}

.catalog-garage__toggle-track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2);
  transition: transform 0.2s;
}

.catalog-garage__toggle-input:checked + .catalog-garage__toggle-track {
  background: var(--color-primary);
}

.catalog-garage__toggle-input:checked + .catalog-garage__toggle-track::after {
  transform: translateX(20px);
}

.catalog-garage__toggle-label {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.catalog-garage__toggle-label strong {
  font-size: 0.9rem;
  color: var(--color-text);
}

.catalog-garage__toggle-label small {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.catalog-garage__picker-label {
  margin: 0 0 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.catalog-garage__vehicles {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-height: 200px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 0.15rem;
}

.catalog-garage__vehicles::-webkit-scrollbar {
  width: 5px;
}

.catalog-garage__vehicles::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.catalog-garage__vehicle {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.catalog-garage__vehicle:hover {
  border-color: #cbd5e1;
  background: var(--color-surface);
}

.catalog-garage__vehicle--active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  box-shadow: 0 0 0 2px rgba(232, 93, 4, 0.1);
}

.catalog-garage__vehicle-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-primary);
}

.catalog-garage__vehicle--active .catalog-garage__vehicle-icon {
  background: #fff;
}

.catalog-garage__vehicle-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.catalog-garage__vehicle-info strong {
  font-size: 0.88rem;
  line-height: 1.25;
}

.catalog-garage__vehicle-info small {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.catalog-garage__vehicle-warn {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #b45309;
}

.catalog-garage__vehicle-check {
  flex-shrink: 0;
  color: var(--color-primary);
}

.catalog-garage__manage {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.65rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.catalog-garage__manage:hover {
  color: var(--color-primary);
}

.catalog-garage__empty {
  display: grid;
  gap: 0.65rem;
}

.catalog-garage__empty p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.45;
}
</style>
