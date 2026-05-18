<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'
import type { ServiceAppointment } from '~/data/service'
import { formatPrice, getCategoryBySlug } from '~/data/catalog'

const props = defineProps<{
  open: boolean
  appointment: ServiceAppointment | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { getRecommendableProducts, setRecommendedProducts } = useAdminService()
const { show } = useToast()

const search = ref('')
const products = ref<CatalogProduct[]>([])
const selected = ref<number[]>([])
const loading = ref(false)
const saving = ref(false)

watch(
  () => [props.open, props.appointment?.id] as const,
  async ([open, id]) => {
    if (!open || !id || !props.appointment) return
    selected.value = props.appointment.recommendedProducts.map((p) => p.id)
    loading.value = true
    try {
      products.value = await getRecommendableProducts(id, search.value || undefined)
    } catch {
      show('Не удалось загрузить товары', 'error')
    } finally {
      loading.value = false
    }
  },
)

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (!props.open || !props.appointment) return
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    loading.value = true
    try {
      products.value = await getRecommendableProducts(
        props.appointment!.id,
        search.value.trim() || undefined,
      )
    } finally {
      loading.value = false
    }
  }, 300)
})

function toggle(id: number) {
  const idx = selected.value.indexOf(id)
  if (idx >= 0) selected.value = selected.value.filter((x) => x !== id)
  else selected.value = [...selected.value, id]
}

async function save() {
  if (!props.appointment) return
  saving.value = true
  try {
    await setRecommendedProducts(props.appointment.id, selected.value)
    show('Рекомендации сохранены', 'success')
    emit('saved')
    emit('close')
  } catch {
    show('Не удалось сохранить', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <UiAdminModal
    :open="open && !!appointment"
    title="Рекомендовать товары"
    :subtitle="appointment ? `${appointment.vehicle.label}, ${appointment.vehicle.year}` : undefined"
    size="xl"
    @close="emit('close')"
  >
    <p class="rec-hint">
      Показаны запчасти, подходящие для автомобиля клиента. Выберите любые позиции — список можно
      менять в любой момент.
    </p>

    <label class="rec-search">
      <UiAppIcon name="lucide:search" :size="18" />
      <input v-model="search" type="search" placeholder="Поиск по названию, OEM, бренду…" />
    </label>

    <div v-if="loading" class="rec-muted">Загрузка…</div>
    <div v-else-if="!products.length" class="rec-muted">Подходящих товаров не найдено</div>
    <ul v-else class="rec-list">
      <li v-for="p in products" :key="p.id">
        <label class="rec-item" :class="{ 'rec-item--on': selected.includes(p.id) }">
          <input type="checkbox" :checked="selected.includes(p.id)" @change="toggle(p.id)" />
          <div class="rec-item__body">
            <strong>{{ p.name }}</strong>
            <span>{{ p.brand }} · {{ getCategoryBySlug(p.categorySlug)?.name }} · OEM {{ p.oem }}</span>
            <span v-if="p.garageMatchLabel" class="rec-item__fit">Подходит для {{ p.garageMatchLabel }}</span>
          </div>
          <span class="rec-item__price">{{ formatPrice(p.price) }}</span>
        </label>
      </li>
    </ul>

    <template #footer>
      <button type="button" class="btn btn--outline" :disabled="saving" @click="emit('close')">
        Отмена
      </button>
      <button type="button" class="btn btn--admin-primary" :disabled="saving || busy" @click="save">
        {{ saving ? 'Сохранение…' : `Сохранить (${selected.length})` }}
      </button>
    </template>
  </UiAdminModal>
</template>

<style scoped>
.rec-hint {
  margin: 0 0 1rem;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.45;
}

.rec-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
}

.rec-search input {
  flex: 1;
  border: none;
  outline: none;
  font: inherit;
}

.rec-muted {
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
}

.rec-list {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 420px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rec-item {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.75rem 0.85rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.rec-item--on {
  border-color: #3b82f6;
  background: #eff6ff;
}

.rec-item__body {
  flex: 1;
  min-width: 0;
}

.rec-item__body strong {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}

.rec-item__body span {
  display: block;
  font-size: 0.78rem;
  color: #64748b;
}

.rec-item__fit {
  color: #047857 !important;
  font-weight: 600;
  margin-top: 0.2rem;
}

.rec-item__price {
  font-weight: 800;
  white-space: nowrap;
  color: #0f172a;
}
</style>
