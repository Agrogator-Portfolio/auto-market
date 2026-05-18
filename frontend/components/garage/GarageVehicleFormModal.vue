<script setup lang="ts">
import type { GarageVehicle, GarageVehicleInput } from '~/composables/useGarage'
import { carBrands, modelsForBrand, yearOptions } from '~/data/vehicles'

const props = defineProps<{
  open: boolean
  editing: GarageVehicle | null
  saving: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [payload: GarageVehicleInput]
}>()

const { vehicles } = useGarage()

const form = reactive<GarageVehicleInput>({
  brand: carBrands[0] ?? '',
  model: '',
  year: 2020,
  vin: '',
  nickname: '',
  isDefault: false,
})

const modelOptions = computed(() =>
  modelsForBrand(form.brand).map((m) => ({ value: m, label: m })),
)

const brandOptions = computed(() => carBrands.map((b) => ({ value: b, label: b })))

const yearSelectOptions = computed(() =>
  yearOptions.map((y) => ({ value: y, label: String(y) })),
)

watch(
  () => [props.open, props.editing] as const,
  ([open, editing]) => {
    if (!open) return
    if (editing) {
      form.brand = editing.brand
      form.model = editing.model
      form.year = editing.year
      form.vin = editing.vin ?? ''
      form.nickname = editing.nickname ?? ''
      form.isDefault = editing.isDefault
    } else {
      form.brand = carBrands[0] ?? ''
      form.model = modelsForBrand(form.brand)[0] ?? ''
      form.year = 2020
      form.vin = ''
      form.nickname = ''
      form.isDefault = vehicles.value.length === 0
    }
  },
)

watch(
  () => form.brand,
  (brand) => {
    const models = modelsForBrand(brand)
    if (!models.includes(form.model)) form.model = models[0] ?? ''
  },
)

function submit() {
  emit('save', {
    brand: form.brand,
    model: form.model,
    year: Number(form.year),
    vin: form.vin?.trim() || undefined,
    nickname: form.nickname?.trim() || undefined,
    isDefault: form.isDefault,
  })
}

function onOverlay(e: MouseEvent) {
  if (e.target === e.currentTarget && !props.saving) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="garage-modal">
      <div
        v-if="open"
        class="garage-modal-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="editing ? 'Редактирование авто' : 'Новый автомобиль'"
        @click="onOverlay"
      >
        <div class="garage-modal" @click.stop>
          <header class="garage-modal__header">
            <div>
              <h2>{{ editing ? 'Редактирование' : 'Новый автомобиль' }}</h2>
              <p>Данные для подбора совместимых запчастей в каталоге</p>
            </div>
            <button type="button" class="garage-modal__close" aria-label="Закрыть" @click="emit('close')">
              <UiAppIcon name="lucide:x" :size="20" />
            </button>
          </header>

          <form class="garage-modal__body" @submit.prevent="submit">
            <label class="garage-modal__default-card">
              <input v-model="form.isDefault" type="checkbox" class="garage-modal__default-input" />
              <span class="garage-modal__default-box" aria-hidden="true">
                <UiAppIcon name="lucide:star" :size="18" />
              </span>
              <span class="garage-modal__default-text">
                <strong>Основной автомобиль</strong>
                <small>Используется по умолчанию в фильтре каталога «под мою машину»</small>
              </span>
            </label>

            <div class="garage-modal__grid">
              <UiAppSelect v-model="form.brand" label="Марка" :options="brandOptions" />
              <UiAppSelect v-model="form.model" label="Модель" :options="modelOptions" />
              <UiAppSelect v-model="form.year" label="Год выпуска" :options="yearSelectOptions" />
            </div>

            <label class="garage-field">
              <span class="garage-field__label">Название (необязательно)</span>
              <input v-model="form.nickname" type="text" class="garage-field__input" placeholder="Семейная, Рабочая…" />
            </label>

            <label class="garage-field">
              <span class="garage-field__label">VIN (необязательно)</span>
              <input
                v-model="form.vin"
                type="text"
                class="garage-field__input"
                maxlength="17"
                placeholder="17 символов"
              />
            </label>
          </form>

          <footer class="garage-modal__footer">
            <button type="button" class="btn btn--outline" :disabled="saving" @click="emit('close')">
              Отмена
            </button>
            <button type="button" class="btn btn--primary" :disabled="saving" @click="submit">
              {{ saving ? 'Сохранение…' : 'Сохранить' }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.garage-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
}

.garage-modal {
  display: flex;
  flex-direction: column;
  width: min(100%, 480px);
  max-height: min(92vh, 720px);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.garage-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.35rem 1.5rem;
  background: linear-gradient(135deg, var(--color-accent) 0%, #2d4a6f 100%);
  color: #fff;
}

.garage-modal__header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
}

.garage-modal__header p {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
}

.garage-modal__close {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
}

.garage-modal__close:hover {
  background: rgba(255, 255, 255, 0.22);
}

.garage-modal__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.35rem 1.5rem;
  overflow-y: auto;
}

.garage-modal__default-card {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 0 0.85rem;
  padding: 1rem 1.1rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.garage-modal__default-card:has(.garage-modal__default-input:checked) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.12);
}

.garage-modal__default-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.garage-modal__default-box {
  grid-row: 1 / 3;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #fff;
  color: #cbd5e1;
  box-shadow: var(--shadow-sm);
  transition: color 0.15s, background 0.15s;
}

.garage-modal__default-card:has(.garage-modal__default-input:checked) .garage-modal__default-box {
  background: var(--color-primary);
  color: #fff;
}

.garage-modal__default-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.garage-modal__default-text strong {
  font-size: 0.95rem;
  color: var(--color-text);
}

.garage-modal__default-text small {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.garage-modal__grid {
  display: grid;
  gap: 0.85rem;
}

.garage-field {
  display: grid;
  gap: 0.35rem;
}

.garage-field__label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.garage-field__input {
  padding: 0.65rem 0.85rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.garage-field__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.12);
}

.garage-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding: 1rem 1.5rem 1.35rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
}

.garage-modal-enter-active,
.garage-modal-leave-active {
  transition: opacity 0.2s ease;
}

.garage-modal-enter-from,
.garage-modal-leave-to {
  opacity: 0;
}
</style>
