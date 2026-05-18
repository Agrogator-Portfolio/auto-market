<script setup lang="ts">
defineProps<{
  error?: string
}>()
</script>

<template>
  <p v-if="error" class="field-error" role="alert">{{ error }}</p>
</template>
