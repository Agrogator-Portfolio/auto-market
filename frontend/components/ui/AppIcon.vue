<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    size?: number | string
  }>(),
  { size: 20 },
)
</script>

<template>
  <Icon :name="name" :size="size" class="app-icon" />
</template>

<style scoped>
.app-icon {
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
