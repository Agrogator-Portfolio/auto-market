<script setup lang="ts">
import { carBrands, modelsForBrand, yearOptions } from '~/data/vehicles'

const { openLogin } = useAuthModal()
const { isLoggedIn } = useUser()
const router = useRouter()

const form = reactive({
  brand: carBrands[0] ?? '',
  model: '',
  year: new Date().getFullYear(),
  vin: '',
})

const brandOptions = computed(() => carBrands.map((b) => ({ value: b, label: b })))
const modelOptions = computed(() =>
  modelsForBrand(form.brand).map((m) => ({ value: m, label: m })),
)
const yearSelectOptions = computed(() =>
  yearOptions.map((y) => ({ value: y, label: String(y) })),
)

watch(
  () => form.brand,
  (brand) => {
    const models = modelsForBrand(brand)
    if (!models.includes(form.model)) form.model = models[0] ?? ''
  },
  { immediate: true },
)

function goGarage() {
  if (isLoggedIn.value) {
    router.push('/account/garage')
  } else {
    openLogin()
  }
}
</script>

<template>
  <section id="garage" class="section garage">
    <div class="container garage__inner">
      <div class="garage__content">
        <span class="garage__label">
          <UiAppIcon name="lucide:car" :size="16" />
          Мой гараж
        </span>
        <h2 class="garage__title">Запчасти под ваш автомобиль</h2>
        <p class="garage__text">
          Сохраните марку, модель и год — в каталоге появится фильтр «только подходящие для моей
          машины», а на карточках — плашка совместимости.
        </p>
        <ul class="garage__benefits">
          <li>
            <UiAppIcon name="lucide:circle-check" :size="18" />
            Подбор только совместимых деталей
          </li>
          <li>
            <UiAppIcon name="lucide:circle-check" :size="18" />
            Несколько автомобилей в одном аккаунте
          </li>
          <li>
            <UiAppIcon name="lucide:circle-check" :size="18" />
            Быстрый переход в каталог с фильтром
          </li>
        </ul>
        <div class="garage__logged-actions">
          <button type="button" class="btn btn--primary" @click="goGarage">
            {{ isLoggedIn ? 'Открыть гараж' : 'Войти и добавить авто' }}
          </button>
          <NuxtLink to="/catalog" class="btn btn--outline">В каталог</NuxtLink>
        </div>
      </div>

      <form class="garage__form" @submit.prevent="goGarage">
        <h3 class="garage__form-title">Данные автомобиля</h3>
        <UiAppSelect v-model="form.brand" label="Марка" :options="brandOptions" />
        <UiAppSelect v-model="form.model" label="Модель" :options="modelOptions" />
        <div class="garage__row">
          <UiAppSelect v-model="form.year" label="Год" :options="yearSelectOptions" />
          <label class="field">
            <span class="field__label">VIN</span>
            <input v-model="form.vin" type="text" maxlength="17" placeholder="17 символов" class="garage-field-input" />
          </label>
        </div>
        <button type="submit" class="btn btn--primary btn--block btn--lg">
          {{ isLoggedIn ? 'Перейти в гараж' : 'Войти и сохранить' }}
        </button>
        <p v-if="!isLoggedIn" class="garage__hint">После входа добавьте авто в разделе «Мой гараж»</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.garage {
  background: var(--color-surface);
}

.garage__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.garage__label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.garage__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
}

.garage__text {
  margin: 0 0 1.25rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.garage__benefits {
  margin: 0 0 1.25rem;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.garage__benefits li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.garage__benefits li :deep(.app-icon) {
  color: var(--color-success);
  flex-shrink: 0;
}

.garage__logged-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.garage__form {
  padding: 1.75rem;
  border-radius: var(--radius-lg);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.garage__form-title {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
  font-weight: 800;
}

.garage__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.garage__hint {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-align: center;
}

.garage-field-input {
  padding: 0.65rem 0.85rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  width: 100%;
}

.garage-field-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.12);
}

@media (max-width: 900px) {
  .garage__inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .garage__row {
    grid-template-columns: 1fr;
  }
}
</style>
