<script setup lang="ts">
import type { DeliveryMethod } from '~/data/orders'
import { calcDeliveryCost, deliveryLabels, formatPrice } from '~/data/orders'

const router = useRouter()
const { lines, subtotal, isEmpty, clear } = useCart()
const { openLogin } = useAuthModal()
const { isLoggedIn, user } = useUser()
const { createOrder } = useOrders()

useHead({ title: 'Оформление заказа — АвтоДеталь' })

onMounted(() => {
  if (isEmpty.value) navigateTo('/cart', { replace: true })
})

const form = reactive({
  recipientName: user.value?.fullName ?? '',
  phone: user.value?.phone ?? '',
  deliveryMethod: 'courier' as DeliveryMethod,
  address: '',
  comment: '',
})

watch(user, (u) => {
  if (u && !form.recipientName) form.recipientName = u.fullName
  if (u && !form.phone) form.phone = u.phone
})

const deliveryCost = computed(() => calcDeliveryCost(form.deliveryMethod, subtotal.value))
const total = computed(() => subtotal.value + deliveryCost.value)

const deliveryOptions: { value: DeliveryMethod; icon: string; desc: string }[] = [
  { value: 'courier', icon: 'lucide:truck', desc: '1–3 дня по Москве и МО' },
  { value: 'pickup', icon: 'lucide:map-pin', desc: 'Бесплатно, ул. Ленина, 12' },
  { value: 'post', icon: 'lucide:mail', desc: '5–14 дней по России' },
]

const submitting = ref(false)
const fieldErrors = reactive<Record<string, string>>({})

function clearErrors() {
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
}

async function submitOrder() {
  if (!isLoggedIn.value) {
    openLogin()
    return
  }

  clearErrors()
  let hasClientError = false
  if (!form.recipientName.trim()) {
    fieldErrors.recipientName = 'Укажите ФИО получателя'
    hasClientError = true
  }
  if (!form.phone.trim()) {
    fieldErrors.phone = 'Укажите телефон'
    hasClientError = true
  }
  if (!form.address.trim()) {
    fieldErrors.address = 'Укажите адрес доставки'
    hasClientError = true
  } else if (form.address.trim().length < 5) {
    fieldErrors.address = 'Адрес должен быть не короче 5 символов'
    hasClientError = true
  }
  if (hasClientError) return

  submitting.value = true
  try {
    const order = await createOrder({
      deliveryMethod: form.deliveryMethod,
      address: form.address.trim(),
      recipientName: form.recipientName.trim(),
      phone: form.phone.trim(),
      comment: form.comment.trim() || undefined,
    })
    await clear()
    router.push(`/account/orders/${order.id}?created=1`)
  } catch (e: unknown) {
    if (!applyApiErrorToFields(e, fieldErrors)) {
      fieldErrors._form = e instanceof Error ? e.message : 'Не удалось оформить заказ'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div v-if="!isEmpty" class="checkout-page">
    <div class="container checkout-page__head">
      <nav class="checkout-page__steps">
        <NuxtLink to="/cart" class="checkout-page__step">Корзина</NuxtLink>
        <UiAppIcon name="lucide:chevron-right" :size="14" />
        <span class="checkout-page__step checkout-page__step--active">Оформление</span>
      </nav>
      <h1 class="checkout-page__title">Оформление заказа</h1>
    </div>

    <div class="container checkout-page__layout">
      <form class="checkout-form" @submit.prevent="submitOrder">
        <p v-if="fieldErrors._form" class="form-error-banner" role="alert">{{ fieldErrors._form }}</p>

        <section v-if="!isLoggedIn" class="checkout-form__banner">
          <UiAppIcon name="lucide:user" :size="22" />
          <div>
            <strong>Войдите в аккаунт</strong>
            <p>Чтобы оформить заказ и отслеживать статус в личном кабинете</p>
          </div>
          <button type="button" class="btn btn--primary" @click="openLogin">
            Войти
          </button>
        </section>

        <section class="checkout-form__section">
          <h2>
            <UiAppIcon name="lucide:user" :size="20" />
            Получатель
          </h2>
          <div class="checkout-form__grid">
            <label class="checkout-field" :class="{ 'checkout-field--invalid': fieldErrors.recipientName }">
              <span>ФИО</span>
              <input
                v-model="form.recipientName"
                type="text"
                required
                placeholder="Иванов Иван Иванович"
                @input="delete fieldErrors.recipientName"
              />
              <UiFieldError :error="fieldErrors.recipientName" />
            </label>
            <label class="checkout-field" :class="{ 'checkout-field--invalid': fieldErrors.phone }">
              <span>Телефон</span>
              <input
                v-model="form.phone"
                type="tel"
                required
                placeholder="+7 (999) 000-00-00"
                @input="delete fieldErrors.phone"
              />
              <UiFieldError :error="fieldErrors.phone" />
            </label>
          </div>
        </section>

        <section class="checkout-form__section">
          <h2>
            <UiAppIcon name="lucide:truck" :size="20" />
            Доставка
          </h2>
          <div class="checkout-delivery">
            <label
              v-for="opt in deliveryOptions"
              :key="opt.value"
              class="checkout-delivery__option"
              :class="{ 'checkout-delivery__option--active': form.deliveryMethod === opt.value }"
            >
              <input v-model="form.deliveryMethod" type="radio" :value="opt.value" />
              <UiAppIcon :name="opt.icon" :size="22" />
              <div>
                <strong>{{ deliveryLabels[opt.value] }}</strong>
                <span>{{ opt.desc }}</span>
              </div>
            </label>
          </div>
          <label
            class="checkout-field checkout-field--full"
            :class="{ 'checkout-field--invalid': fieldErrors.address }"
          >
            <span>Адрес / пункт выдачи</span>
            <textarea
              v-model="form.address"
              rows="2"
              required
              placeholder="Город, улица, дом, квартира или адрес ПВЗ"
              @input="delete fieldErrors.address"
            />
            <UiFieldError :error="fieldErrors.address" />
          </label>
        </section>

        <section class="checkout-form__section">
          <h2>
            <UiAppIcon name="lucide:message-square" :size="20" />
            Комментарий
          </h2>
          <label class="checkout-field checkout-field--full">
            <span>Пожелания к заказу (необязательно)</span>
            <textarea v-model="form.comment" rows="2" placeholder="Удобное время звонка, домофон..." />
          </label>
        </section>

        <button type="submit" class="btn btn--primary btn--lg checkout-form__submit">
          <UiAppIcon name="lucide:check" :size="20" />
          Подтвердить заказ
        </button>
      </form>

      <aside class="checkout-aside">
        <h2 class="checkout-aside__title">Ваш заказ</h2>
        <ul class="checkout-aside__list">
          <li v-for="line in lines" :key="line.product.id">
            <span class="checkout-aside__name">{{ line.product.name }}</span>
            <span>× {{ line.quantity }}</span>
            <span class="checkout-aside__price">{{ formatPrice(line.lineTotal) }}</span>
          </li>
        </ul>
        <dl class="checkout-aside__totals">
          <div>
            <dt>Товары</dt>
            <dd>{{ formatPrice(subtotal) }}</dd>
          </div>
          <div>
            <dt>Доставка</dt>
            <dd>{{ deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost) }}</dd>
          </div>
          <div class="checkout-aside__total">
            <dt>К оплате</dt>
            <dd>{{ formatPrice(total) }}</dd>
          </div>
        </dl>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  padding-bottom: 3rem;
}

.checkout-page__head {
  padding-block: 1.5rem 1.25rem;
}

.checkout-page__steps {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.checkout-page__step--active {
  color: var(--color-text);
  font-weight: 700;
}

.checkout-page__title {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
}

.checkout-page__layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.75rem;
  align-items: start;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.checkout-form__banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-md);
  color: #1e40af;
}

.checkout-form__banner p {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

.checkout-form__banner .btn {
  margin-left: auto;
  flex-shrink: 0;
}

.checkout-form__section {
  padding: 1.35rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.checkout-form__section h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  font-size: 1.05rem;
  font-weight: 800;
}

.checkout-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.checkout-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.checkout-field--full {
  margin-top: 0.85rem;
}

.checkout-field span {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.checkout-field input,
.checkout-field textarea {
  padding: 0.65rem 0.85rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  resize: vertical;
}

.checkout-field input:focus,
.checkout-field textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.12);
}

.checkout-delivery {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.checkout-delivery__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.checkout-delivery__option input {
  accent-color: var(--color-primary);
}

.checkout-delivery__option strong {
  display: block;
  font-size: 0.9rem;
}

.checkout-delivery__option span {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.checkout-delivery__option--active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.checkout-form__submit {
  gap: 0.5rem;
}

.checkout-aside {
  padding: 1.35rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: calc(var(--header-h) + 1rem);
}

.checkout-aside__title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 800;
}

.checkout-aside__list {
  margin: 0 0 1rem;
  padding: 0 0 1rem;
  list-style: none;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.checkout-aside__list li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.15rem 0.5rem;
  font-size: 0.85rem;
}

.checkout-aside__name {
  grid-column: 1 / -1;
  font-weight: 600;
}

.checkout-aside__price {
  font-weight: 700;
  color: var(--color-accent);
}

.checkout-aside__totals {
  margin: 0;
}

.checkout-aside__totals > div {
  display: flex;
  justify-content: space-between;
  padding-block: 0.4rem;
  font-size: 0.9rem;
}

.checkout-aside__totals dt {
  color: var(--color-text-muted);
}

.checkout-aside__totals dd {
  margin: 0;
  font-weight: 700;
}

.checkout-aside__total {
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.checkout-aside__total dd {
  font-size: 1.25rem;
  color: var(--color-accent);
}

@media (max-width: 900px) {
  .checkout-page__layout {
    grid-template-columns: 1fr;
  }

  .checkout-form__grid {
    grid-template-columns: 1fr;
  }

  .checkout-form__banner {
    flex-wrap: wrap;
  }
}
</style>
