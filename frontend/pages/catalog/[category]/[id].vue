<script setup lang="ts">
import type { CatalogProduct, CategorySlug } from '~/data/catalog'
import DetailEngine from '~/components/catalog/detail/DetailEngine.vue'
import DetailBrakes from '~/components/catalog/detail/DetailBrakes.vue'
import DetailSuspension from '~/components/catalog/detail/DetailSuspension.vue'
import DetailElectrics from '~/components/catalog/detail/DetailElectrics.vue'

const route = useRoute()
const { apiFetch } = useApi()

const categorySlug = computed(() => String(route.params.category) as CategorySlug)
const productId = computed(() => Number(route.params.id))

const { data: product, error } = await useAsyncData(
  () => `product-${productId.value}`,
  () => apiFetch<CatalogProduct>(`/catalog/products/${productId.value}`, { auth: false }),
)

const { data: related } = await useAsyncData(
  () => `related-${productId.value}`,
  () =>
    apiFetch<CatalogProduct[]>(`/catalog/products/${productId.value}/related`, {
      query: { category: categorySlug.value, limit: 4 },
      auth: false,
    }),
  { watch: [productId] },
)

if (error.value || !product.value || product.value.categorySlug !== categorySlug.value) {
  throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
}

const detailComponent = computed(() => {
  const map = {
    engine: DetailEngine,
    brakes: DetailBrakes,
    suspension: DetailSuspension,
    electrics: DetailElectrics,
  }
  return map[categorySlug.value]
})

useHead(() => ({
  title: product.value ? `${product.value.name} — АвтоДеталь` : 'Товар — АвтоДеталь',
}))
</script>

<template>
  <component
    :is="detailComponent"
    v-if="product"
    :product="product"
    :related="related ?? []"
  />
</template>
