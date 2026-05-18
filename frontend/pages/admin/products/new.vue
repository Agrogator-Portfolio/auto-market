<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { createProduct } = useAdmin()
const { show } = useToast()
const router = useRouter()

async function onSubmit(payload: Record<string, unknown>) {
  try {
    const product = await createProduct(payload)
    show('Товар создан', 'success')
    router.push(`/admin/products/${product.id}`)
  } catch {
    show('Не удалось создать товар', 'error')
  }
}

useHead({ title: 'Новый товар — Админка' })
</script>

<template>
  <div class="admin-page">
    <header class="admin-page-header">
      <div>
        <h1>Новый товар</h1>
        <p>Выберите категорию — появятся поля для фильтров каталога</p>
      </div>
      <NuxtLink to="/admin/products" class="btn btn--admin-ghost btn--sm">
        <UiAppIcon name="lucide:arrow-left" :size="16" />
        К списку
      </NuxtLink>
    </header>
    <AdminProductForm @submit="onSubmit">
      <template #submit-label>Создать</template>
    </AdminProductForm>
  </div>
</template>
