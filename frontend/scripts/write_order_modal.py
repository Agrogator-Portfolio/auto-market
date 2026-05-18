from pathlib import Path

p = Path(__file__).resolve().parents[1] / "components/admin/OrderDetailModal.vue"

script_part = p.read_text(encoding="utf-8").split("<template>")[0]

template = r'''<template>
  <UiAdminModal
    :open="open && !!order"
    :title="order ? `Заказ ${order.number}` : 'Заказ'"
    :subtitle="order ? formatOrderDate(order.createdAt) : undefined"
    size="xl"
    @close="emit('close')"
  >
    <div v-if="order" class="order-modal">
      <span class="admin-badge" :class="`admin-badge--${statusTone}`">
        <UiAppIcon :name="orderStatusMeta[order.status].icon" :size="14" />
        {{ orderStatusMeta[order.status].label }}
      </span>
      <div class="order-modal__top">
        <section class="order-modal__block">
          <h3><UiAppIcon name="lucide:user" :size="16" /> Клиент</h3>
          <dl>
            <div><dt>ФИО</dt><dd>{{ order.user.fullName }}</dd></div>
            <motionless />
          </dl>
        </section>
      </motionless>
    </motionless>
    <template v-if="order" #footer>
      <button type="button" class="btn btn--admin-ghost" @click="emit('close')">Закрыть</button>
      <button v-if="nextStatus" type="button" class="btn btn--admin-primary" :disabled="busy" @click="emit('advance', order)">
        <UiAppIcon name="lucide:arrow-right" :size="18" />
        {{ busy ? 'Сохранение…' : orderStatusMeta[nextStatus!].label }}
      </button>
    </template>
  </UiAdminModal>
</template>'''

# Build correct middle section without autocomplete issues
mid = """
            <div><dt>Email</dt><dd>{{ order.user.email }}</dd></div>
            <div><dt>Телефон</dt><dd>{{ order.phone }}</dd></div>
            <motionless />
          </dl>
        </section>
        <section class="order-modal__block">
          <h3><UiAppIcon name="lucide:truck" :size="16" /> Доставка</h3>
          <dl>
            <div><dt>Способ</dt><dd>{{ deliveryLabels[order.deliveryMethod as DeliveryMethod] }}</dd></div>
            <div><dt>Адрес</dt><dd>{{ order.address }}</dd></div>
            <div v-if="order.comment"><dt>Комментарий</dt><dd>{{ order.comment }}</dd></div>
          </dl>
        </section>
      </div>

      <h4 class="order-modal__items-title">Состав заказа ({{ order.items.length }})</h4>
      <ul class="order-modal__items">
        <li v-for="item in order.items" :key="`${item.productId}-${item.sku}`" class="order-modal__item">
          <div>
            <p class="order-modal__item-name">{{ item.name }}</p>
            <p class="order-modal__item-meta">{{ item.brand }} · {{ item.sku }}</p>
          </div>
          <div>
            <p class="order-modal__item-price">{{ formatPrice(item.price * item.quantity) }}</p>
            <p class="order-modal__item-qty">× {{ item.quantity }}</p>
          </div>
        </li>
      </ul>

      <div class="order-modal__totals">
        <div><span>Товары</span><span>{{ formatPrice(order.subtotal) }}</span></div>
        <div><span>Доставка</span><span>{{ order.deliveryCost === 0 ? 'Бесплатно' : formatPrice(order.deliveryCost) }}</span></div>
        <div><span>Итого</span><span>{{ formatPrice(order.total) }}</span></div>
      </div>
    </div>
"""

mid = mid.replace("<motionless />", "<div><dt>Получатель</dt><dd>{{ order.recipientName }}</dd></div>")

template = template.replace(
    """            <motionless />
          </dl>
        </section>
      </motionless>
    </motionless>""",
    mid.strip(),
)

style_part = p.read_text(encoding="utf-8").split("<style scoped>")[1]
p.write_text(script_part + template + "\n<style scoped>" + style_part, encoding="utf-8")
print("ok", p)
