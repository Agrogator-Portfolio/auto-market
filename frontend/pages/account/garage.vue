<script setup lang="ts">
import type { GarageVehicle, GarageVehicleInput } from '~/composables/useGarage'

definePageMeta({ middleware: 'auth' })

const { show } = useToast()
const {
  vehicles,
  loading,
  load,
  create,
  update,
  remove,
  setDefault,
  vehicleTitle,
} = useGarage()

const formOpen = ref(false)
const editing = ref<GarageVehicle | null>(null)
const saving = ref(false)

onMounted(() => load(true))
useHead({ title: 'Мой гараж — АвтоДеталь' })

function openCreate() {
  editing.value = null
  formOpen.value = true
}

function openEdit(v: GarageVehicle) {
  editing.value = v
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editing.value = null
}

async function onFormSave(payload: GarageVehicleInput) {
  saving.value = true
  try {
    if (editing.value) {
      await update(editing.value.id, payload)
      show('Автомобиль обновлён', 'success')
    } else {
      await create(payload)
      show('Автомобиль добавлен в гараж', 'success')
    }
    closeForm()
  } catch {
    show('Не удалось сохранить', 'error')
  } finally {
    saving.value = false
  }
}

async function onRemove(v: GarageVehicle) {
  if (!confirm(`Удалить ${vehicleTitle(v)} из гаража?`)) return
  try {
    await remove(v.id)
    show('Автомобиль удалён', 'success')
  } catch {
    show('Не удалось удалить', 'error')
  }
}

async function onSetDefault(v: GarageVehicle) {
  try {
    await setDefault(v.id)
    show('Основной автомобиль изменён', 'success')
  } catch {
    show('Ошибка', 'error')
  }
}
</script>

<template>
  <div class="account-page">
    <div class="container account-page__layout">
      <AccountNav />

      <div class="account-page__content">
        <header class="garage-page__head">
          <div>
            <h1>Мой гараж</h1>
            <p>Добавьте автомобили — в каталоге появится подбор совместимых запчастей</p>
          </div>
          <button type="button" class="btn btn--primary" @click="openCreate">
            <UiAppIcon name="lucide:plus" :size="18" />
            Добавить авто
          </button>
        </header>

        <div v-if="loading" class="garage-page__muted">Загрузка…</div>

        <div v-else-if="!vehicles.length" class="garage-page__empty">
          <UiAppIcon name="lucide:car" :size="48" />
          <h2>Гараж пуст</h2>
          <p>Добавьте первый автомобиль, чтобы видеть подходящие запчасти в каталоге</p>
          <button type="button" class="btn btn--primary" @click="openCreate">Добавить автомобиль</button>
        </div>

        <ul v-else class="garage-page__list">
          <li v-for="v in vehicles" :key="v.id" class="garage-card">
            <span class="garage-card__icon">
              <UiAppIcon name="lucide:car" :size="28" />
            </span>
            <div class="garage-card__body">
              <div class="garage-card__title-row">
                <h2>{{ v.nickname || v.label }}</h2>
                <span v-if="v.isDefault" class="garage-card__badge">Основной</span>
              </div>
              <p class="garage-card__meta">
                {{ v.brand }} {{ v.model }} · {{ v.year }}
                <span v-if="v.vin"> · VIN {{ v.vin }}</span>
              </p>
            </div>
            <div class="garage-card__actions">
              <NuxtLink
                :to="{ path: '/catalog', query: { category: 'engine', garageVehicleId: v.id } }"
                class="btn btn--outline btn--sm"
              >
                Запчасти
              </NuxtLink>
              <button
                v-if="!v.isDefault"
                type="button"
                class="btn btn--ghost btn--sm"
                @click="onSetDefault(v)"
              >
                Сделать основным
              </button>
              <button type="button" class="btn btn--ghost btn--sm" @click="openEdit(v)">
                Изменить
              </button>
              <button type="button" class="btn btn--ghost btn--sm" @click="onRemove(v)">
                Удалить
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <GarageVehicleFormModal
      :open="formOpen"
      :editing="editing"
      :saving="saving"
      @close="closeForm"
      @save="onFormSave"
    />
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

.garage-page__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.garage-page__head h1 {
  margin: 0 0 0.35rem;
  font-size: 1.5rem;
  font-weight: 800;
}

.garage-page__head p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.garage-page__muted {
  color: var(--color-text-muted);
  padding: 2rem;
  text-align: center;
}

.garage-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  text-align: center;
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-muted);
}

.garage-page__empty h2 {
  margin: 0;
  color: var(--color-text);
}

.garage-page__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.garage-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1.15rem 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.garage-card__icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.garage-card__title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.garage-card__title-row h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
}

.garage-card__badge {
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  background: #ecfdf5;
  color: #047857;
}

.garage-card__meta {
  margin: 0.25rem 0 0;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.garage-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: flex-end;
}

@media (max-width: 900px) {
  .account-page__layout {
    grid-template-columns: 1fr;
  }

  .garage-card {
    grid-template-columns: auto 1fr;
  }

  .garage-card__actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
}
</style>
