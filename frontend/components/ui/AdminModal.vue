<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    subtitle?: string
    size?: 'md' | 'lg' | 'xl'
  }>(),
  { size: 'lg' },
)

const emit = defineEmits<{
  close: []
}>()

function onOverlay(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

watch(
  () => props.open,
  (open) => {
    if (import.meta.client) {
      document.body.style.overflow = open ? 'hidden' : ''
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="admin-modal">
      <div
        v-if="open"
        class="admin-modal-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @click="onOverlay"
      >
        <div class="admin-modal" :class="`admin-modal--${size}`" @click.stop>
          <header class="admin-modal__header">
            <div>
              <h2>{{ title }}</h2>
              <p v-if="subtitle">{{ subtitle }}</p>
            </div>
            <button type="button" class="admin-modal__close" aria-label="Закрыть" @click="emit('close')">
              <UiAppIcon name="lucide:x" :size="20" />
            </button>
          </header>
          <div class="admin-modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="admin-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.admin-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(8px);
}

.admin-modal {
  display: flex;
  flex-direction: column;
  width: min(100%, 520px);
  max-height: min(92vh, 880px);
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 24px 48px rgba(15, 23, 42, 0.18),
    0 0 0 1px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}

.admin-modal--lg {
  width: min(100%, 680px);
}

.admin-modal--xl {
  width: min(100%, 860px);
}

.admin-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.35rem 1.5rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
  color: #fff;
}

.admin-modal__header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.admin-modal__header p {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.admin-modal__close {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}

.admin-modal__close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.admin-modal__body {
  padding: 1.35rem 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.admin-modal__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem 1.35rem;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
}

.admin-modal-enter-active,
.admin-modal-leave-active {
  transition: opacity 0.2s ease;
}

.admin-modal-enter-active .admin-modal,
.admin-modal-leave-active .admin-modal {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.admin-modal-enter-from,
.admin-modal-leave-to {
  opacity: 0;
}

.admin-modal-enter-from .admin-modal,
.admin-modal-leave-to .admin-modal {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>
