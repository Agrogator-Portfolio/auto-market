<script setup lang="ts">
import type { AdminUser } from '~/composables/useAdmin'
import { formatPrice } from '~/data/orders'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { listUsers, createUser, updateUser, deleteUser } = useAdmin()
const { show } = useToast()

const users = ref<AdminUser[]>([])
const loading = ref(true)

const editOpen = ref(false)
const creating = ref(false)
const editingUser = ref<AdminUser | null>(null)

const historyOpen = ref(false)
const historyUser = ref<AdminUser | null>(null)

const form = reactive({
  email: '',
  password: '',
  fullName: '',
  phone: '',
})

async function load() {
  loading.value = true
  try {
    users.value = await listUsers()
  } finally {
    loading.value = false
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatRegDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function startCreate() {
  creating.value = true
  editingUser.value = null
  form.email = ''
  form.password = ''
  form.fullName = ''
  form.phone = ''
  editOpen.value = true
}

function startEdit(u: AdminUser) {
  if (u.role === 'admin') return
  creating.value = false
  editingUser.value = u
  form.email = u.email
  form.password = ''
  form.fullName = u.fullName
  form.phone = u.phone
  editOpen.value = true
}

function closeEdit() {
  editOpen.value = false
  editingUser.value = null
}

function openHistory(u: AdminUser) {
  historyUser.value = u
  historyOpen.value = true
}

function closeHistory() {
  historyOpen.value = false
  historyUser.value = null
}

async function save() {
  try {
    if (creating.value) {
      await createUser({ ...form })
      show('Пользователь создан', 'success')
    } else if (editingUser.value) {
      await updateUser(editingUser.value.id, {
        email: form.email,
        fullName: form.fullName,
        phone: form.phone,
        ...(form.password ? { password: form.password } : {}),
      })
      show('Пользователь обновлён', 'success')
    }
    closeEdit()
    await load()
  } catch {
    show('Ошибка сохранения', 'error')
  }
}

async function remove(u: AdminUser) {
  if (!confirm(`Удалить пользователя ${u.fullName}?`)) return
  try {
    await deleteUser(u.id)
    show('Пользователь удалён', 'success')
    await load()
  } catch {
    show('Не удалось удалить', 'error')
  }
}

onMounted(load)
useHead({ title: 'Пользователи — Админка' })
</script>

<template>
  <div class="admin-page">
    <header class="admin-page-header">
      <div>
        <h1>Пользователи</h1>
        <p>Профили клиентов, статистика покупок и история заказов</p>
      </div>
      <button type="button" class="btn btn--admin-primary" @click="startCreate">
        <UiAppIcon name="lucide:user-plus" :size="18" />
        Добавить
      </button>
    </header>

    <div v-if="loading" class="admin-page__muted">Загрузка…</div>

    <div v-else class="admin-user-grid">
      <article
        v-for="u in users"
        :key="u.id"
        class="admin-card admin-user-card"
      >
        <div class="admin-user-card__head">
          <div style="display: flex; gap: 0.75rem; align-items: flex-start">
            <span class="admin-user-card__avatar">{{ initials(u.fullName) }}</span>
            <div>
              <h2 class="admin-user-card__name">{{ u.fullName }}</h2>
              <p class="admin-user-card__email">{{ u.email }}</p>
            </div>
          </div>
          <span
            v-if="u.role === 'admin'"
            class="admin-badge admin-badge--info"
          >Админ</span>
        </div>

        <div class="admin-user-card__meta">
          <p><strong>Телефон:</strong> {{ u.phone }}</p>
          <p v-if="u.birthDate"><strong>Дата рождения:</strong> {{ u.birthDate }}</p>
          <p><strong>Регистрация:</strong> {{ formatRegDate(u.createdAt) }}</p>
        </div>

        <div v-if="u.role !== 'admin' && u.stats" class="admin-stats-row">
          <div class="admin-stat">
            <strong>{{ u.stats.completedOrders }}</strong>
            <span>Заказов</span>
          </div>
          <div class="admin-stat">
            <strong>{{ u.stats.itemsPurchased }}</strong>
            <span>Товаров</span>
          </div>
          <div class="admin-stat">
            <strong>{{ formatPrice(u.stats.totalSpent) }}</strong>
            <span>Потрачено</span>
          </div>
        </div>

        <div class="admin-user-card__actions">
          <button type="button" class="btn btn--admin-primary btn--sm" @click="openHistory(u)">
            История
          </button>
          <button
            v-if="u.role !== 'admin'"
            type="button"
            class="btn btn--admin-ghost btn--sm"
            @click="startEdit(u)"
          >
            Изменить
          </button>
          <button
            v-if="u.role !== 'admin'"
            type="button"
            class="btn btn--admin-ghost btn--sm"
            @click="remove(u)"
          >
            Удалить
          </button>
        </div>
      </article>
    </div>

    <UiAdminModal
      :open="editOpen"
      :title="creating ? 'Новый пользователь' : 'Редактирование'"
      size="md"
      @close="closeEdit"
    >
      <form class="user-edit-form" @submit.prevent="save">
        <label>
          <span>ФИО</span>
          <input v-model="form.fullName" required />
        </label>
        <label>
          <span>Email</span>
          <input v-model="form.email" type="email" required />
        </label>
        <label>
          <span>Телефон</span>
          <input v-model="form.phone" required />
        </label>
        <label>
          <span>{{ creating ? 'Пароль' : 'Новый пароль (необяз.)' }}</span>
          <input
            v-model="form.password"
            type="password"
            :required="creating"
            :minlength="6"
          />
        </label>
      </form>
      <template #footer>
        <button type="button" class="btn btn--admin-ghost" @click="closeEdit">Отмена</button>
        <button type="button" class="btn btn--admin-primary" @click="save">Сохранить</button>
      </template>
    </UiAdminModal>

    <AdminUserHistoryModal
      :open="historyOpen"
      :user="historyUser"
      @close="closeHistory"
    />
  </div>
</template>

<style scoped>
.admin-page__muted {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

.user-edit-form {
  display: grid;
  gap: 1rem;
}

.user-edit-form label {
  display: grid;
  gap: 0.35rem;
}

.user-edit-form span {
  font-size: 0.78rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.user-edit-form input {
  padding: 0.65rem 0.85rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font: inherit;
}

.user-edit-form input:focus {
  outline: none;
  border-color: #e85d04;
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.12);
}
</style>
