<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
    compact?: boolean
    fill?: boolean
  }>(),
  {
    text: 'Здесь должно быть фото',
    compact: false,
    fill: false,
  },
)
</script>

<template>
  <div
    class="image-placeholder"
    :class="{
      'image-placeholder--compact': compact && !fill,
      'image-placeholder--fill': fill,
    }"
  >
    <div class="image-placeholder__icon-wrap" aria-hidden="true">
      <UiAppIcon name="lucide:image" :size="compact ? 28 : 40" />
    </div>
    <p class="image-placeholder__text">{{ text }}</p>
  </div>
</template>

<style scoped>
.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 160px;
  padding: 1.25rem;
  background: linear-gradient(145deg, #eef1f6 0%, #e2e8f0 100%);
  border: 1.5px dashed var(--color-border);
  color: var(--color-text-muted);
  text-align: center;
}

.image-placeholder--fill {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: 1rem;
  border: none;
  border-radius: inherit;
}

.image-placeholder--compact:not(.image-placeholder--fill) {
  min-height: 120px;
  gap: 0.5rem;
  padding: 0.75rem;
}

.image-placeholder__icon-wrap {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-accent);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.image-placeholder--compact .image-placeholder__icon-wrap {
  width: 48px;
  height: 48px;
}

.image-placeholder__text {
  margin: 0;
  max-width: 16rem;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.4;
}

.image-placeholder--compact .image-placeholder__text {
  font-size: 0.75rem;
}
</style>
