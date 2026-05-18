<script setup lang="ts">
import { ApiError } from '~/composables/useApi'

const { mode, isOpen, close, switchToLogin, switchToRegister } = useAuthModal()
const { login, register } = useUser()
const router = useRouter()

const formError = ref('')
const fieldErrors = reactive<Record<string, string>>({})
const submitting = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
})

const registerForm = reactive({
  fullName: '',
  birthDate: '',
  phone: '',
  email: '',
  password: '',
})

function clearErrors() {
  formError.value = ''
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
}

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) close()
}

async function onLoginSubmit() {
  clearErrors()
  submitting.value = true
  try {
    const loggedIn = await login({ email: loginForm.email.trim(), password: loginForm.password })
    close()
    router.push(loggedIn.role === 'admin' ? '/admin/orders' : '/account')
  } catch (e: unknown) {
    if (!applyLoginError(e, fieldErrors)) {
      formError.value = e instanceof ApiError ? e.message : 'Ошибка входа'
    }
  } finally {
    submitting.value = false
  }
}

async function onRegisterSubmit() {
  clearErrors()
  submitting.value = true
  try {
    await register({
      fullName: registerForm.fullName,
      email: registerForm.email.trim(),
      phone: registerForm.phone,
      password: registerForm.password,
      birthDate: registerForm.birthDate || undefined,
    })
    close()
    router.push('/account')
  } catch (e: unknown) {
    if (!applyApiErrorToFields(e, fieldErrors)) {
      formError.value = e instanceof ApiError ? e.message : 'Ошибка регистрации'
    }
  } finally {
    submitting.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) close()
}

watch(isOpen, (open) => {
  if (!open) clearErrors()
})

watch(mode, () => clearErrors())

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="mode === 'login' ? 'Вход' : 'Регистрация'"
      @click="onOverlayClick"
    >
      <div class="auth-modal" @click.stop>
        <button type="button" class="auth-modal__close" aria-label="Закрыть" @click="close">
          <UiAppIcon name="lucide:x" :size="22" />
        </button>

        <div class="auth-modal__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            class="auth-modal__tab"
            :class="{ 'auth-modal__tab--active': mode === 'login' }"
            :aria-selected="mode === 'login'"
            @click="switchToLogin"
          >
            <UiAppIcon name="lucide:log-in" :size="18" />
            Вход
          </button>
          <button
            type="button"
            role="tab"
            class="auth-modal__tab"
            :class="{ 'auth-modal__tab--active': mode === 'register' }"
            :aria-selected="mode === 'register'"
            @click="switchToRegister"
          >
            <UiAppIcon name="lucide:user-plus" :size="18" />
            Регистрация
          </button>
        </div>

        <p v-if="formError" class="form-error-banner" role="alert">{{ formError }}</p>

        <div v-if="mode === 'login'" class="auth-modal__content" role="tabpanel">
          <h2 class="auth-modal__title">Вход в аккаунт</h2>
          <p class="auth-modal__subtitle">Email и пароль от аккаунта АвтоДеталь</p>

          <form class="auth-modal__form" @submit.prevent="onLoginSubmit">
            <label class="auth-field" :class="{ 'auth-field--invalid': fieldErrors.email }">
              <span class="auth-field__label">Email</span>
              <input
                v-model="loginForm.email"
                type="email"
                placeholder="admin@admin.ru"
                required
                @input="delete fieldErrors.email"
              />
              <UiFieldError :error="fieldErrors.email" />
            </label>
            <label class="auth-field" :class="{ 'auth-field--invalid': fieldErrors.password }">
              <span class="auth-field__label">Пароль</span>
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="••••••••"
                required
                @input="delete fieldErrors.password"
              />
              <UiFieldError :error="fieldErrors.password" />
            </label>
            <button type="submit" class="btn btn--primary btn--block btn--lg" :disabled="submitting">
              {{ submitting ? 'Вход…' : 'Войти' }}
            </button>
          </form>
        </div>

        <div v-else-if="mode === 'register'" class="auth-modal__content" role="tabpanel">
          <h2 class="auth-modal__title">Регистрация</h2>
          <p class="auth-modal__subtitle">Создайте аккаунт для заказов и корзины.</p>

          <form class="auth-modal__form" @submit.prevent="onRegisterSubmit">
            <label class="auth-field" :class="{ 'auth-field--invalid': fieldErrors.fullName }">
              <span class="auth-field__label">ФИО</span>
              <input v-model="registerForm.fullName" type="text" required @input="delete fieldErrors.fullName" />
              <UiFieldError :error="fieldErrors.fullName" />
            </label>
            <div class="auth-modal__row">
              <label class="auth-field">
                <span class="auth-field__label">Дата рождения</span>
                <input v-model="registerForm.birthDate" type="date" />
              </label>
              <label class="auth-field" :class="{ 'auth-field--invalid': fieldErrors.phone }">
                <span class="auth-field__label">Телефон</span>
                <input v-model="registerForm.phone" type="tel" required @input="delete fieldErrors.phone" />
                <UiFieldError :error="fieldErrors.phone" />
              </label>
            </div>
            <label class="auth-field" :class="{ 'auth-field--invalid': fieldErrors.email }">
              <span class="auth-field__label">Email</span>
              <input v-model="registerForm.email" type="email" required @input="delete fieldErrors.email" />
              <UiFieldError :error="fieldErrors.email" />
            </label>
            <label class="auth-field" :class="{ 'auth-field--invalid': fieldErrors.password }">
              <span class="auth-field__label">Пароль</span>
              <input
                v-model="registerForm.password"
                type="password"
                minlength="6"
                required
                @input="delete fieldErrors.password"
              />
              <UiFieldError :error="fieldErrors.password" />
            </label>
            <button type="submit" class="btn btn--primary btn--block btn--lg" :disabled="submitting">
              {{ submitting ? 'Создание…' : 'Создать аккаунт' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>
