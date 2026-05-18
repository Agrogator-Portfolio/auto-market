<script setup lang="ts">
import type { CatalogFilterDef, FilterValues } from '~/data/catalog'
import { formatPrice } from '~/data/catalog'

const props = defineProps<{
  filters: CatalogFilterDef[]
}>()

const model = defineModel<FilterValues>({ required: true })

function toggleMulti(key: string, value: string) {
  const current = model.value[key]
  const arr = Array.isArray(current) ? [...current] : []
  const idx = arr.indexOf(value)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(value)
  model.value = { ...model.value, [key]: arr }
}

function isMultiChecked(key: string, value: string) {
  const current = model.value[key]
  return Array.isArray(current) && current.includes(value)
}

function rangeValue(key: string): [number, number] {
  const v = model.value[key]
  if (Array.isArray(v) && v.length === 2) return v as [number, number]
  const def = props.filters.find((f) => f.key === key)
  return [def?.min ?? 0, def?.max ?? 100000]
}

function setRange(key: string, index: 0 | 1, value: number) {
  const def = props.filters.find((f) => f.key === key)
  const minBound = def?.min ?? 0
  const maxBound = def?.max ?? 100000
  const [min, max] = rangeValue(key)
  let next: [number, number] = index === 0 ? [value, max] : [min, value]
  if (next[0] > next[1]) next = index === 0 ? [value, value] : [next[1], next[1]]
  next[0] = Math.max(minBound, Math.min(next[0], maxBound))
  next[1] = Math.max(minBound, Math.min(next[1], maxBound))
  model.value = { ...model.value, [key]: next }
}

function rangePercent(key: string, index: 0 | 1): number {
  const def = props.filters.find((f) => f.key === key)
  const min = def?.min ?? 0
  const max = def?.max ?? 100000
  const val = rangeValue(key)[index]
  if (max <= min) return 0
  return ((val - min) / (max - min)) * 100
}

function setSelect(key: string, value: string) {
  model.value = { ...model.value, [key]: value }
}

</script>

<template>
  <div class="catalog-filters">
    <div class="catalog-filters__head">
      <UiAppIcon name="lucide:sliders-horizontal" :size="18" />
      <h2 class="catalog-filters__title">Фильтры</h2>
    </div>

    <div v-for="filter in filters" :key="filter.key" class="catalog-filters__group">
      <h3 v-if="filter.type !== 'checkbox'" class="catalog-filters__label">
        {{ filter.label }}
      </h3>

      <!-- Select: кастомный список-кнопки -->
      <template v-if="filter.type === 'select'">
        <div class="catalog-filters__pills" role="listbox">
          <button
            v-for="opt in filter.options"
            :key="opt.value"
            type="button"
            role="option"
            class="catalog-filters__pill"
            :class="{ 'catalog-filters__pill--active': String(model[filter.key] ?? '') === opt.value }"
            :aria-selected="String(model[filter.key] ?? '') === opt.value"
            @click="setSelect(filter.key, opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
      </template>

      <!-- Multiselect: чипы -->
      <template v-else-if="filter.type === 'multiselect'">
        <div class="catalog-filters__chips">
          <button
            v-for="opt in filter.options"
            :key="opt.value"
            type="button"
            class="catalog-filters__chip"
            :class="{ 'catalog-filters__chip--active': isMultiChecked(filter.key, opt.value) }"
            @click="toggleMulti(filter.key, opt.value)"
          >
            <span class="catalog-filters__chip-check" aria-hidden="true">
              <UiAppIcon v-if="isMultiChecked(filter.key, opt.value)" name="lucide:check" :size="12" />
            </span>
            {{ opt.label }}
          </button>
        </div>
      </template>

      <!-- Checkbox: переключатель -->
      <template v-else-if="filter.type === 'checkbox'">
        <label class="catalog-filters__toggle">
          <input
            type="checkbox"
            class="catalog-filters__toggle-input"
            :checked="Boolean(model[filter.key])"
            @change="model = { ...model, [filter.key]: ($event.target as HTMLInputElement).checked }"
          />
          <span class="catalog-filters__toggle-track" aria-hidden="true" />
          <span class="catalog-filters__toggle-text">{{ filter.label }}</span>
        </label>
      </template>

      <!-- Range: два ползунка + подписи -->
      <template v-else-if="filter.type === 'range'">
        <div class="catalog-filters__range">
          <div class="catalog-filters__range-values">
            <span>{{ formatPrice(rangeValue(filter.key)[0]) }}</span>
            <span class="catalog-filters__range-dash">—</span>
            <span>{{ formatPrice(rangeValue(filter.key)[1]) }}</span>
          </div>
          <div class="catalog-filters__range-track-wrap">
            <div
              class="catalog-filters__range-fill"
              :style="{
                left: `${rangePercent(filter.key, 0)}%`,
                right: `${100 - rangePercent(filter.key, 1)}%`,
              }"
            />
            <input
              type="range"
              class="catalog-filters__range-input catalog-filters__range-input--min"
              :min="filter.min"
              :max="filter.max"
              :step="filter.step ?? 100"
              :value="rangeValue(filter.key)[0]"
              @input="setRange(filter.key, 0, Number(($event.target as HTMLInputElement).value))"
            />
            <input
              type="range"
              class="catalog-filters__range-input catalog-filters__range-input--max"
              :min="filter.min"
              :max="filter.max"
              :step="filter.step ?? 100"
              :value="rangeValue(filter.key)[1]"
              @input="setRange(filter.key, 1, Number(($event.target as HTMLInputElement).value))"
            />
          </div>
          <div class="catalog-filters__range-inputs">
            <label class="catalog-filters__range-field">
              <span>От</span>
              <input
                type="number"
                :min="filter.min"
                :max="filter.max"
                :step="filter.step ?? 100"
                :value="rangeValue(filter.key)[0]"
                @change="setRange(filter.key, 0, Number(($event.target as HTMLInputElement).value))"
              />
            </label>
            <label class="catalog-filters__range-field">
              <span>До</span>
              <input
                type="number"
                :min="filter.min"
                :max="filter.max"
                :step="filter.step ?? 100"
                :value="rangeValue(filter.key)[1]"
                @change="setRange(filter.key, 1, Number(($event.target as HTMLInputElement).value))"
              />
            </label>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.catalog-filters__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.1rem;
  color: var(--color-accent);
}

.catalog-filters__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
}

.catalog-filters__group {
  padding-block: 1rem;
  border-top: 1px solid var(--color-border);
}

.catalog-filters__group:first-of-type {
  border-top: none;
  padding-top: 0;
}

.catalog-filters__label {
  margin: 0 0 0.75rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.catalog-filters__pills,
.catalog-filters__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.catalog-filters__pill {
  padding: 0.45rem 0.75rem;
  border: 1.5px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-bg);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s, box-shadow 0.15s;
}

.catalog-filters__pill:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.catalog-filters__pill--active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(232, 93, 4, 0.35);
}

.catalog-filters__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem 0.4rem 0.45rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.1s;
}

.catalog-filters__chip:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.catalog-filters__chip--active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.catalog-filters__chip-check {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  transition: background 0.15s, border-color 0.15s;
}

.catalog-filters__chip--active .catalog-filters__chip-check {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #fff;
}

.catalog-filters__toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.catalog-filters__toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.catalog-filters__toggle-track {
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: var(--color-border);
  transition: background 0.2s;
}

.catalog-filters__toggle-track::after {
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

.catalog-filters__toggle-input:checked + .catalog-filters__toggle-track {
  background: var(--color-primary);
}

.catalog-filters__toggle-input:checked + .catalog-filters__toggle-track::after {
  transform: translateX(20px);
}

.catalog-filters__toggle-input:focus-visible + .catalog-filters__toggle-track {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.catalog-filters__toggle-text {
  font-size: 0.9rem;
  font-weight: 600;
}

.catalog-filters__range-values {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-accent);
}

.catalog-filters__range-dash {
  color: var(--color-text-muted);
  font-weight: 500;
}

.catalog-filters__range-track-wrap {
  position: relative;
  height: 6px;
  margin-bottom: 1rem;
  border-radius: 999px;
  background: var(--color-surface-muted);
}

.catalog-filters__range-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--color-primary), #f97316);
  pointer-events: none;
}

.catalog-filters__range-input {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 0;
  margin: 0;
  padding: 0;
  transform: translateY(-50%);
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
}

.catalog-filters__range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--color-primary);
  box-shadow: 0 2px 6px rgba(232, 93, 4, 0.4);
  cursor: pointer;
  pointer-events: auto;
}

.catalog-filters__range-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--color-primary);
  box-shadow: 0 2px 6px rgba(232, 93, 4, 0.4);
  cursor: pointer;
  pointer-events: auto;
}

.catalog-filters__range-input--max {
  z-index: 2;
}

.catalog-filters__range-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.catalog-filters__range-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.catalog-filters__range-field span {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.catalog-filters__range-field input {
  padding: 0.5rem 0.65rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  font-size: 0.85rem;
  font-weight: 600;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.catalog-filters__range-field input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.15);
}
</style>
