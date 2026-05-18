<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const { getProduct, updateProduct } = useAdmin()
const { show } = useToast()

const product = ref<CatalogProduct | null>(null)
const loading = ref(true)

const id = computed(() => Number(route.params.id))

onMounted(async () => {
  try {
    product.value = await getProduct(id.value)
  } catch {
    throw createError({ statusCode: 404 })
  } finally {
    loading.value = false
  }
})

async function onSubmit(payload: Record<string, unknown>) {
  try {
    product.value = await updateProduct(id.value, payload)
    show('Товар обновлён', 'success')
  } catch {
    show('Ошибка сохранения', 'error')
  }
}

useHead(() => ({
  title: product.value ? `${product.value.name} — Админка` : 'Товар — Админка',
}))
</script>

<template>
  <div class="admin-page">
    <header class="admin-page-header">
      <div>
        <h1>Редактирование товара</h1>
        <p v-if="product">{{ product.name }}</p>
      </div>
      <NuxtLink to="/admin/products" class="btn btn--admin-ghost btn--sm">
        <UiAppIcon name="lucide:arrow-left" :size="16" />
        К списку
      </NuxtLink>
    </header>
    <div v-if="loading" class="admin-page__muted">Загрузка…</div>
    <AdminProductForm v-else :initial="product" @submit="onSubmit" />
  </div>
</template>

<style scoped>
.admin-page__muted {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}
</style>
