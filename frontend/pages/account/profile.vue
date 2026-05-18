<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { ApiError } from '~/composables/useApi'

const { user, updateProfile } = useUser()
const { show } = useToast()
const fieldErrors = reactive<Record<string, string>>({})

const editing = ref(false)
const saving = ref(false)
const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  birthDate: '',
})

function syncForm() {
  if (!user.value) return
  form.fullName = user.value.fullName
  form.email = user.value.email
  form.phone = user.value.phone
  form.birthDate = user.value.birthDate ?? ''
}

function openEdit() {
  syncForm()
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

async function save() {
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
  saving.value = true
  try {
    await updateProfile({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      birthDate: form.birthDate || undefined,
    })
    editing.value = false
    show('Данные профиля сохранены', 'success')
  } catch (e: unknown) {
    if (!applyApiErrorToFields(e, fieldErrors)) {
      show(e instanceof ApiError ? e.message : 'Не удалось сохранить данные', 'error')
    }
  } finally {
    saving.value = false
  }
}

watch(user, syncForm, { immediate: true })

useHead({ title: 'Профиль — АвтоДеталь' })
</script>

<template>
  <div class="account-page">
    <div class="container account-page__layout">
      <AccountNav />

      <div class="account-page__content">
        <header class="account-page__header account-page__header--row">
          <div>
            <h1>Профиль</h1>
            <p>Контактные данные для заказов</p>
          </div>
          <button
            v-if="!editing"
            type="button"
            class="btn btn--outline"
            @click="openEdit"
          >
            <UiAppIcon name="lucide:refresh-cw" :size="18" />
            Обновить данные
          </button>
        </header>

        <div class="profile-card">
          <form v-if="editing" class="profile-form" @submit.prevent="save">
            <label class="profile-form__field" :class="{ 'field--invalid': fieldErrors.fullName }">
              <span>ФИО</span>
              <input
                v-model="form.fullName"
                type="text"
                required
                minlength="2"
                @input="delete fieldErrors.fullName"
              />
              <UiFieldError :error="fieldErrors.fullName" />
            </label>
            <label class="profile-form__field" :class="{ 'field--invalid': fieldErrors.email }">
              <span>Email</span>
              <input v-model="form.email" type="email" required @input="delete fieldErrors.email" />
              <UiFieldError :error="fieldErrors.email" />
            </label>
            <label class="profile-form__field" :class="{ 'field--invalid': fieldErrors.phone }">
              <span>Телефон</span>
              <input
                v-model="form.phone"
                type="tel"
                required
                minlength="10"
                @input="delete fieldErrors.phone"
              />
              <UiFieldError :error="fieldErrors.phone" />
            </label>
            <label class="profile-form__field">
              <span>Дата рождения</span>
              <input v-model="form.birthDate" type="date" />
            </label>
            <div class="profile-form__actions">
              <button type="submit" class="btn btn--primary" :disabled="saving">
                Сохранить
              </button>
              <button type="button" class="btn btn--outline" :disabled="saving" @click="cancelEdit">
                Отмена
              </button>
            </div>
          </form>

          <dl v-else class="profile-card__grid">
            <dt>ФИО</dt>
            <dd>{{ user?.fullName }}</dd>
            <dt>Email</dt>
            <dd>{{ user?.email }}</dd>
            <dt>Телефон</dt>
            <dd>{{ user?.phone }}</dd>
            <dt v-if="user?.birthDate">Дата рождения</dt>
            <dd v-if="user?.birthDate">{{ user.birthDate }}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-page {
  padding-block: 2rem 3rem;
}

.account-page__layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.75rem;
  align-items: start;
}

.account-page__header h1 {
  margin: 0 0 0.35rem;
  font-size: 1.75rem;
  font-weight: 800;
}

.account-page__header p {
  margin: 0;
  color: var(--color-text-muted);
}

.account-page__header--row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.profile-card {
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.profile-card__grid {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 0.75rem 1.5rem;
  margin: 0;
}

.profile-card__grid dt {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.profile-card__grid dd {
  margin: 0;
  font-weight: 700;
}

.profile-form {
  display: grid;
  gap: 1rem;
  max-width: 420px;
}

.profile-form__field {
  display: grid;
  gap: 0.35rem;
}

.profile-form__field span {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.profile-form__field input {
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font: inherit;
}

.profile-form__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

@media (max-width: 900px) {
  .account-page__layout {
    grid-template-columns: 1fr;
  }

  .profile-card__grid {
    grid-template-columns: 1fr;
  }
}
</style>
