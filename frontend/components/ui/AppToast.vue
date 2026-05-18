<script setup lang="ts">
const { message, type } = useToast()
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="message"
        class="app-toast"
        :class="type === 'error' ? 'app-toast--error' : 'app-toast--success'"
        role="status"
      >
        <UiAppIcon
          :name="type === 'error' ? 'lucide:alert-circle' : 'lucide:check-circle'"
          :size="20"
        />
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.app-toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: min(420px, calc(100vw - 2rem));
  padding: 0.85rem 1.15rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  transform: translateX(-50%);
}

.app-toast--success {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.app-toast--error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>
