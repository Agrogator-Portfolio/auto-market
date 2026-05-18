<script setup lang="ts">
const route = useRoute()

const isProductPage = computed(() => Boolean(route.params.id))

if (!isProductPage.value) {
  await navigateTo(
    { path: '/catalog', query: { category: String(route.params.category) } },
    { replace: true },
  )
}
</script>

<template>
  <NuxtPage />
</template>
