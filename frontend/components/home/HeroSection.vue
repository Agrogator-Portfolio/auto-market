<script setup lang="ts">
const { openRegister } = useAuthModal()
const { isLoggedIn } = useUser()
</script>

<template>
  <section class="hero">
    <div class="container hero__inner">
      <div class="hero__content">
        <span class="hero__tag">Онлайн-магазин автозапчастей</span>
        <h1 class="hero__title">
          Найдите нужную деталь<br />
          <span>по VIN, OEM или марке авто</span>
        </h1>
        <p class="hero__text">
          <template v-if="isLoggedIn">
            Добро пожаловать! Перейдите к заказам или продолжите покупки в каталоге.
          </template>
          <template v-else>
            Каталог с проверкой совместимости, доставка по России и личный кабинет
            с историей заказов.
          </template>
        </p>
        <div class="hero__actions">
          <NuxtLink to="/catalog" class="btn btn--primary btn--lg">Перейти в каталог</NuxtLink>
          <template v-if="isLoggedIn">
            <NuxtLink to="/account" class="btn btn--outline btn--lg">Мои заказы</NuxtLink>
            <NuxtLink to="/cart" class="btn btn--outline btn--lg">Корзина</NuxtLink>
            <NuxtLink to="/account/garage" class="btn btn--outline btn--lg">Мой гараж</NuxtLink>
          </template>
          <template v-else>
            <button type="button" class="btn btn--outline btn--lg" @click="openRegister">
              Создать аккаунт
            </button>
          </template>
        </div>
      </div>

      <div class="hero__visual">
        <UiImagePlaceholder fill text="Здесь должно быть фото автомобиля" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-block: 2.5rem 1rem;
  background: linear-gradient(180deg, #fff 0%, var(--color-bg) 100%);
}

.hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.hero__tag {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  margin-bottom: 1rem;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 700;
}

.hero__title {
  margin: 0 0 1rem;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.hero__title span {
  color: var(--color-primary);
}

.hero__text {
  margin: 0 0 1.5rem;
  color: var(--color-text-muted);
  font-size: 1.05rem;
  max-width: 480px;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero__visual {
  position: relative;
  min-height: 320px;
  height: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

@media (max-width: 900px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }

  .hero__visual {
    order: -1;
    max-height: 220px;
  }
}
</style>
