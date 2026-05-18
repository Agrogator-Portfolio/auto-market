<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    variant?: 'default' | 'admin'
    icon?: string
  }>(),
  {
    confirmLabel: 'Подтвердить',
    cancelLabel: 'Отмена',
    variant: 'default',
    icon: 'lucide:help-circle',
  },
)

const emit = defineEmits<{
  confirm: []
  close: []
}>()

function onOverlay(e: MouseEvent) {
  if (e.target === e.currentTarget && !props.loading) emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open && !props.loading) emit('close')
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
    <Transition name="confirm-modal">
      <div
        v-if="open"
        class="confirm-modal-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @click="onOverlay"
      >
        <div
          class="confirm-modal"
          :class="`confirm-modal--${variant}`"
          @click.stop
        >
          <div class="confirm-modal__icon" aria-hidden="true">
            <UiAppIcon :name="icon" :size="28" />
          </div>
          <h2 class="confirm-modal__title">{{ title }}</h2>
          <p v-if="message" class="confirm-modal__message">{{ message }}</p>
          <div class="confirm-modal__actions">
            <button
              type="button"
              class="btn"
              :class="variant === 'admin' ? 'btn--admin-ghost' : 'btn--outline'"
              :disabled="loading"
              @click="emit('close')"
            >
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              class="btn"
              :class="variant === 'admin' ? 'btn--admin-primary' : 'btn--primary'"
              :disabled="loading"
              @click="emit('confirm')"
            >
              {{ loading ? 'Подождите…' : confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(6px);
}

.confirm-modal {
  width: min(100%, 420px);
  padding: 1.75rem 1.5rem 1.5rem;
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 20px 40px rgba(15, 23, 42, 0.16),
    0 0 0 1px rgba(15, 23, 42, 0.05);
  text-align: center;
}

.confirm-modal__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 1rem;
  border-radius: 14px;
  background: #fff7ed;
  color: #e85d04;
}

.confirm-modal--admin .confirm-modal__icon {
  background: #eff6ff;
  color: #1d4ed8;
}

.confirm-modal__title {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
}

.confirm-modal__message {
  margin: 0 0 1.35rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: #64748b;
}

.confirm-modal__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
}

.confirm-modal-enter-active,
.confirm-modal-leave-active {
  transition: opacity 0.18s ease;
}

.confirm-modal-enter-active .confirm-modal,
.confirm-modal-leave-active .confirm-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.confirm-modal-enter-from,
.confirm-modal-leave-to {
  opacity: 0;
}

.confirm-modal-enter-from .confirm-modal,
.confirm-modal-leave-to .confirm-modal {
  transform: translateY(10px) scale(0.98);
  opacity: 0;
}
</style>
