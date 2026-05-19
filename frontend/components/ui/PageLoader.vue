<script setup lang="ts">
withDefaults(
  defineProps<{
    pending?: boolean
    error?: string | null
    message?: string
    minHeight?: string
  }>(),
  {
    pending: false,
    error: null,
    message: 'Загрузка…',
    minHeight: '12rem',
  },
)
</script>

<template>
  <div class="page-loader" :style="{ '--page-loader-min': minHeight }">
    <div v-if="pending" class="page-loader__state" role="status" aria-live="polite">
      <UiAppIcon name="lucide:loader-circle" :size="44" class="page-loader__icon" />
      <p>{{ message }}</p>
    </div>
    <div v-else-if="error" class="page-loader__state page-loader__state--error" role="alert">
      <UiAppIcon name="lucide:alert-circle" :size="40" />
      <p>{{ error }}</p>
    </div>
    <slot v-else />
  </div>
</template>

<style scoped>
.page-loader {
  min-height: var(--page-loader-min);
}

.page-loader__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  min-height: var(--page-loader-min);
  padding: 2rem 1rem;
  text-align: center;
  color: var(--color-text-muted);
}

.page-loader__state p {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.page-loader__state--error {
  color: #b91c1c;
}

.page-loader__icon {
  color: var(--color-primary);
  animation: page-loader-spin 0.85s linear infinite;
}

@keyframes page-loader-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
