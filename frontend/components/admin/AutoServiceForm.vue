<script setup lang="ts">
import type { AutoServiceCenter, ServiceCategory } from '~/data/service'

const props = defineProps<{
  categories: ServiceCategory[]
  initial?: AutoServiceCenter | null
  saving?: boolean
}>()

const emit = defineEmits<{
  submit: [body: {
    name: string
    city: string
    address: string
    description: string
    rating: number
    workSchedule: string
    phone?: string
    categoryIds: string[]
  }]
}>()

const name = ref(props.initial?.name ?? '')
const city = ref(props.initial?.city ?? '')
const address = ref(props.initial?.address ?? '')
const description = ref(props.initial?.description ?? '')
const rating = ref(props.initial?.rating ?? 4.5)
const workSchedule = ref(props.initial?.workSchedule ?? 'Пн–Пт 9:00–18:00')
const phone = ref(props.initial?.phone ?? '')
const categoryIds = ref<string[]>(props.initial?.categories.map((c) => c.id) ?? [])

function toggleCat(id: string) {
  const idx = categoryIds.value.indexOf(id)
  if (idx >= 0) categoryIds.value = categoryIds.value.filter((x) => x !== id)
  else categoryIds.value = [...categoryIds.value, id]
}

function onSubmit() {
  emit('submit', {
    name: name.value.trim(),
    city: city.value.trim(),
    address: address.value.trim(),
    description: description.value.trim(),
    rating: Number(rating.value),
    workSchedule: workSchedule.value.trim(),
    phone: phone.value.trim() || undefined,
    categoryIds: categoryIds.value,
  })
}
</script>

<template>
  <form class="svc-form" @submit.prevent="onSubmit">
    <div class="svc-form__grid">
      <label>
        <span>Название</span>
        <input v-model="name" type="text" required />
      </label>
      <label>
        <span>Город</span>
        <input v-model="city" type="text" required />
      </label>
      <label class="svc-form__full">
        <span>Адрес</span>
        <input v-model="address" type="text" required />
      </label>
      <label>
        <span>Рейтинг</span>
        <input v-model.number="rating" type="number" min="1" max="5" step="0.1" required />
      </label>
      <label>
        <span>Телефон</span>
        <input v-model="phone" type="text" placeholder="+7 …" />
      </label>
      <label class="svc-form__full">
        <span>Режим работы</span>
        <input v-model="workSchedule" type="text" required />
      </label>
      <label class="svc-form__full">
        <span>Описание</span>
        <textarea v-model="description" rows="4" required />
      </label>
    </div>

    <fieldset class="svc-form__cats">
      <legend>Виды выполняемых работ</legend>
      <label v-for="cat in categories" :key="cat.id" class="svc-form__cat">
        <input
          type="checkbox"
          :checked="categoryIds.includes(cat.id)"
          @change="toggleCat(cat.id)"
        />
        <span>
          <strong>{{ cat.name }}</strong>
          <small>{{ cat.description }}</small>
        </span>
      </label>
    </fieldset>

    <div class="svc-form__actions">
      <slot name="actions">
        <button type="submit" class="btn btn--primary" :disabled="saving || !categoryIds.length">
          {{ saving ? 'Сохранение…' : 'Сохранить' }}
        </button>
      </slot>
    </div>
  </form>
</template>

<style scoped>
.svc-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.svc-form__full {
  grid-column: 1 / -1;
}

.svc-form label span {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
}

.svc-form input,
.svc-form textarea {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font: inherit;
}

.svc-form__cats {
  margin: 0 0 1.25rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.svc-form__cats legend {
  padding: 0 0.35rem;
  font-weight: 700;
}

.svc-form__cat {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
}

.svc-form__cat strong {
  display: block;
  font-size: 0.9rem;
}

.svc-form__cat small {
  color: #64748b;
  font-size: 0.78rem;
}

.svc-form__actions {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .svc-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
