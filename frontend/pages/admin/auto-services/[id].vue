<script setup lang="ts">
import type { AutoServiceCenter, ServiceCategory } from '~/data/service'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const router = useRouter()
const { show } = useToast()
const { listCategories, getAutoService, updateAutoService } = useAdminService()

const id = computed(() => String(route.params.id))
const service = ref<AutoServiceCenter | null>(null)
const categories = ref<ServiceCategory[]>([])
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  try {
    const [cats, svc] = await Promise.all([listCategories(), getAutoService(id.value)])
    categories.value = cats
    service.value = svc
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Автосервис не найден' })
  } finally {
    loading.value = false
  }
})

async function onSubmit(body: Parameters<typeof updateAutoService>[1]) {
  saving.value = true
  try {
    service.value = await updateAutoService(id.value, body)
    show('Сохранено', 'success')
  } catch {
    show('Не удалось сохранить', 'error')
  } finally {
    saving.value = false
  }
}

useHead(() => ({
  title: service.value ? `${service.value.name} — Админка` : 'Автосервис — Админка',
}))
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__head">
      <div>
        <NuxtLink to="/admin/auto-services" class="admin-back">← К списку</NuxtLink>
        <h1>{{ service?.name ?? 'Автосервис' }}</h1>
      </div>
    </header>

    <div v-if="loading" class="admin-page__muted">Загрузка…</div>
    <div v-else-if="service" class="admin-card admin-card--padded">
      <AdminAutoServiceForm
        :categories="categories"
        :initial="service"
        :saving="saving"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<style scoped>
.admin-page__head h1 {
  margin: 0.5rem 0 0;
}

.admin-back {
  font-size: 0.88rem;
  font-weight: 600;
  color: #64748b;
}

.admin-page__muted {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

.admin-card--padded {
  padding: 1.5rem;
}
</style>
