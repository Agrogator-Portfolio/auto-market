<script setup lang="ts">
export interface SelectOption {
  value: string | number
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    options: SelectOption[]
    label?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
  }>(),
  { placeholder: 'Выберите…' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  const opt = props.options.find((o) => String(o.value) === String(props.modelValue))
  return opt?.label ?? props.placeholder
})

const hasValue = computed(() =>
  props.options.some((o) => String(o.value) === String(props.modelValue)),
)

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function pick(value: string | number) {
  emit('update:modelValue', value)
  open.value = false
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="root" class="app-select" :class="{ 'app-select--open': open, 'app-select--disabled': disabled }">
    <span v-if="label" class="app-select__label">{{ label }}</span>
    <button
      type="button"
      class="app-select__trigger"
      :aria-expanded="open"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="app-select__value" :class="{ 'app-select__value--placeholder': !hasValue }">
        {{ selectedLabel }}
      </span>
      <UiAppIcon name="lucide:chevron-down" :size="18" class="app-select__chevron" />
    </button>
    <Transition name="app-select-drop">
      <ul v-if="open" class="app-select__list" role="listbox">
        <li
          v-for="opt in options"
          :key="String(opt.value)"
          role="option"
          class="app-select__option"
          :class="{ 'app-select__option--active': String(opt.value) === String(modelValue) }"
          :aria-selected="String(opt.value) === String(modelValue)"
          @click="pick(opt.value)"
        >
          {{ opt.label }}
          <UiAppIcon
            v-if="String(opt.value) === String(modelValue)"
            name="lucide:check"
            :size="16"
            class="app-select__check"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.app-select {
  position: relative;
  display: grid;
  gap: 0.35rem;
}

.app-select__label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.app-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.app-select__trigger:hover:not(:disabled) {
  border-color: #cbd5e1;
}

.app-select--open .app-select__trigger {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.12);
}

.app-select--disabled .app-select__trigger {
  opacity: 0.6;
  cursor: not-allowed;
}

.app-select__value--placeholder {
  color: var(--color-text-muted);
  font-weight: 500;
}

.app-select__chevron {
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: transform 0.2s;
}

.app-select--open .app-select__chevron {
  transform: rotate(180deg);
  color: var(--color-primary);
}

.app-select__list {
  position: absolute;
  z-index: 50;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0.35rem;
  list-style: none;
  max-height: 220px;
  overflow-y: auto;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
}

.app-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.65rem;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}

.app-select__option:hover {
  background: var(--color-bg);
}

.app-select__option--active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.app-select__check {
  flex-shrink: 0;
}

.app-select-drop-enter-active,
.app-select-drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.app-select-drop-enter-from,
.app-select-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
