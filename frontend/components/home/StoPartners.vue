<script setup lang="ts">
import type { AutoServiceCenter } from '~/data/service'

const { apiFetch } = useApi()

const { data: partners } = await useAsyncData(
  'sto-featured',
  () => apiFetch<AutoServiceCenter[]>('/service-centers/featured', { query: { limit: 3 }, auth: false }),
  { getCachedData: () => undefined },
)

function servicesLabel(center: AutoServiceCenter) {
  return center.categories.map((c) => c.name).join(', ')
}
</script>

<template>
  <section id="sto" class="section sto">
    <div class="container">
      <div class="section__header">
        <div>
          <h2 class="section__title">Запишись на СТО через наших партнёров</h2>
          <p class="section__subtitle">
            Проверенные автосервисы в вашем городе — установка купленных запчастей
          </p>
        </div>
      </div>

      <div class="sto__banner">
        <div class="sto__banner-text">
          <p>
            Купили запчасти у нас — установите у проверенного партнёра. Выберите сервис
            в вашем городе и оставьте заявку на ТО или ремонт.
          </p>
          <NuxtLink to="/account/service/book" class="btn btn--primary btn--lg">Записаться в автосервис</NuxtLink>
        </div>
        <div class="sto__banner-img">
          <UiImagePlaceholder fill text="Здесь должно быть фото СТО" />
        </div>
      </div>

      <div v-if="partners?.length" class="sto__grid">
        <article v-for="partner in partners" :key="partner.id" class="sto-card">
          <div class="sto-card__head">
            <h3 class="sto-card__name">{{ partner.name }}</h3>
            <span class="sto-card__rating">
              <UiAppIcon name="lucide:star" :size="16" />
              {{ partner.rating }}
            </span>
          </div>
          <p class="sto-card__city">{{ partner.city }} · {{ partner.address }}</p>
          <p class="sto-card__services">{{ servicesLabel(partner) }}</p>
          <NuxtLink to="/account/service/book" class="btn btn--outline btn--block">Записаться</NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sto {
  background: linear-gradient(180deg, var(--color-bg) 0%, #e8eef5 100%);
}

.sto__banner {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
  align-items: stretch;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: var(--radius-lg);
  background: var(--color-accent);
  color: #fff;
}

.sto__banner-text p {
  margin: 0 0 1.25rem;
  font-size: 1.05rem;
  line-height: 1.6;
  opacity: 0.95;
}

.sto__banner-img {
  position: relative;
  min-height: 220px;
  width: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.sto__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.sto-card {
  padding: 1.5rem;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.sto-card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.sto-card__name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
}

.sto-card__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #f59e0b;
  white-space: nowrap;
}

.sto-card__city {
  margin: 0 0 0.35rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.sto-card__services {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  line-height: 1.4;
}

@media (max-width: 900px) {
  .sto__banner {
    grid-template-columns: 1fr;
  }

  .sto__grid {
    grid-template-columns: 1fr;
  }
}
</style>
