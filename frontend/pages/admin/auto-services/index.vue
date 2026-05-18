<script setup lang="ts">
import type { AutoServiceCenter } from '~/data/service'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { listAutoServices, deleteAutoService } = useAdminService()
const { show } = useToast()
const services = ref<AutoServiceCenter[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    services.value = await listAutoServices()
  } finally {
    loading.value = false
  }
}

async function remove(id: string) {
  if (!confirm('Удалить автосервис?')) return
  try {
    await deleteAutoService(id)
    show('Автосервис удалён', 'success')
    await load()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Ошибка удаления'
    show(msg, 'error')
  }
}

onMounted(load)
useHead({ title: 'Автосервисы — Админка' })
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__head">
      <div>
        <h1>Автосервисы</h1>
        <p>Партнёрские СТО: виды работ, адреса, режим работы</p>
      </div>
      <NuxtLink to="/admin/auto-services/new" class="btn btn--primary">Добавить</NuxtLink>
    </header>

    <div v-if="loading" class="admin-page__muted">Загрузка…</div>

    <div v-else class="admin-card admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Город</th>
            <th>Работы</th>
            <th>Рейтинг</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-if="!services.length">
            <td colspan="5" class="admin-table__empty">Нет автосервисов</td>
          </tr>
          <tr v-for="s in services" :key="s.id">
            <td>
              <strong>{{ s.name }}</strong>
              <span class="admin-table__sub">{{ s.address }}</span>
            </td>
            <td>{{ s.city }}</td>
            <td>
              <span v-for="cat in s.categories" :key="cat.id" class="admin-tag">{{ cat.name }}</span>
            </td>
            <td>{{ s.rating }}</td>
            <td class="admin-table__actions">
              <NuxtLink :to="`/admin/auto-services/${s.id}`" class="btn btn--outline btn--sm">
                Изменить
              </NuxtLink>
              <button type="button" class="btn btn--outline btn--sm" @click="remove(s.id)">
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.admin-page__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.admin-page__head h1 {
  margin: 0 0 0.25rem;
}

.admin-page__head p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.admin-page__muted {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

.admin-table__empty {
  text-align: center;
  color: #94a3b8;
  padding: 2rem !important;
}

.admin-table__actions {
  text-align: right;
  white-space: nowrap;
}

.admin-tag {
  display: inline-block;
  margin: 0.15rem 0.25rem 0.15rem 0;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  background: #f1f5f9;
  font-size: 0.72rem;
  font-weight: 600;
}
</style>
