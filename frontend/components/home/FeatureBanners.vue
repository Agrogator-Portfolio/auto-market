<script setup lang="ts">
import { featureBanners } from '~/data/mock'
</script>

<template>
  <section id="catalog" class="section feature-banners">
    <div class="container">
      <div class="section__header">
        <div>
          <h2 class="section__title">Возможности магазина</h2>
          <p class="section__subtitle">Всё необходимое для подбора и заказа запчастей</p>
        </div>
      </div>

      <div class="feature-banners__grid">
        <article
          v-for="banner in featureBanners"
          :key="banner.id"
          class="feature-banner"
          :style="{ '--accent': banner.accent }"
        >
          <span class="feature-banner__icon" aria-hidden="true">
            <UiAppIcon :name="banner.icon" :size="28" />
          </span>
          <h3 class="feature-banner__title">{{ banner.title }}</h3>
          <p class="feature-banner__text">{{ banner.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-banners__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.feature-banner {
  padding: 1.5rem;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 4px solid var(--accent);
  transition: box-shadow 0.2s;
}

.feature-banner:hover {
  box-shadow: var(--shadow-md);
}

.feature-banner__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 0.75rem;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--accent) 12%, white);
  color: var(--accent);
}

.feature-banner__title {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 800;
}

.feature-banner__text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

@media (max-width: 1024px) {
  .feature-banners__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .feature-banners__grid {
    grid-template-columns: 1fr;
  }
}
</style>
