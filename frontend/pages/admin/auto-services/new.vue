<script setup lang="ts">
import type { ServiceCategory } from '~/data/service'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const router = useRouter()
const { show } = useToast()
const { listCategories, createAutoService } = useAdminService()

const categories = ref<ServiceCategory[]>([])
const saving = ref(false)

onMounted(async () => {
  categories.value = await listCategories()
})

async function onSubmit(body: Parameters<typeof createAutoService>[0]) {
  saving.value = true
  try {
    const created = await createAutoService(body)
    show('Автосервис добавлен', 'success')
    await router.push(`/admin/auto-services/${created.id}`)
  } catch {
    show('Не удалось сохранить', 'error')
  } finally {
    saving.value = false
  }
}

useHead({ title: 'Новый автосервис — Админка' })
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__head">
      <div>
        <NuxtLink to="/admin/auto-services" class="admin-back">← К списку</NuxtLink>
        <h1>Новый автосервис</h1>
      </div>
    </header>
    <div class="admin-card admin-card--padded">
      <AdminAutoServiceForm
        :categories="categories"
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

.admin-card--padded {
  padding: 1.5rem;
}
</style>
