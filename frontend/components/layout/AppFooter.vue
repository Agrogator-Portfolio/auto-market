<script setup lang="ts">
const year = new Date().getFullYear()

const footerNav = [
  {
    title: 'Каталог',
    links: [
      { label: 'Двигатель', href: '#' },
      { label: 'Тормоза', href: '#' },
      { label: 'Подвеска', href: '#' },
      { label: 'Электрика', href: '#' },
    ],
  },
  {
    title: 'Покупателям',
    links: [
      { label: 'Доставка и оплата', href: '#' },
      { label: 'Возврат', href: '#' },
      { label: 'Подбор по VIN', href: '#' },
      { label: 'Личный кабинет', href: '#' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'О нас', href: '#' },
      { label: 'Новости', href: '#' },
      { label: 'СТО-партнёры', href: '#sto' },
      { label: 'Контакты', href: '#' },
    ],
  },
]
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <NuxtLink to="/" class="footer__logo">
          <span class="footer__logo-icon">AD</span>
          <strong>АвтоДеталь</strong>
        </NuxtLink>
        <p class="footer__desc">
          Онлайн-магазин автозапчастей с подбором по VIN и OEM. Качественные детали,
          быстрая доставка и прозрачные цены.
        </p>
        <a href="tel:+78001234567" class="footer__phone">8 800 123-45-67</a>
        <a href="mailto:info@avtodetal.ru" class="footer__email">info@avtodetal.ru</a>
      </div>

      <nav
        v-for="group in footerNav"
        :key="group.title"
        class="footer__col"
        :aria-label="group.title"
      >
        <h3 class="footer__col-title">{{ group.title }}</h3>
        <ul class="footer__links">
          <li v-for="link in group.links" :key="link.label">
            <NuxtLink :to="link.href">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="footer__bottom">
      <div class="container footer__bottom-inner">
        <p>© {{ year }} АвтоДеталь. Все права защищены.</p>
        <div class="footer__legal">
          <NuxtLink to="#">Политика конфиденциальности</NuxtLink>
          <NuxtLink to="#">Пользовательское соглашение</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  background: var(--color-accent);
  color: #cbd5e1;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: 2rem;
  padding-block: 3rem;
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-size: 1.15rem;
  margin-bottom: 0.75rem;
}

.footer__logo-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 800;
}

.footer__desc {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 280px;
}

.footer__phone,
.footer__email {
  display: block;
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.footer__col-title {
  margin: 0 0 1rem;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
}

.footer__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__links a {
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer__links a:hover {
  color: #fff;
}

.footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer__bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-block: 1.25rem;
  font-size: 0.85rem;
  flex-wrap: wrap;
}

.footer__legal {
  display: flex;
  gap: 1.25rem;
}

.footer__legal a:hover {
  color: #fff;
}

@media (max-width: 900px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 520px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
