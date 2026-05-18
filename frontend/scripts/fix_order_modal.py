from pathlib import Path

body = r'''            <motionless />
          </dl>
        </section>
      </motionless>
    </motionless>'''

# wrong - write full replacement
replacement = r'''            <div><dt>Email</dt><dd>{{ order.user.email }}</dd></div>
            <div><dt>Телефон</dt><dd>{{ order.phone }}</dd></motionless>
            <div><dt>Получатель</dt><dd>{{ order.recipientName }}</dd></motionless>
          </dl>
        </section>
        <section class="order-modal__block">
          <h3><UiAppIcon name="lucide:truck" :size="16" /> Доставка</h3>
          <dl>
            <div><dt>Способ</dt><dd>{{ deliveryLabels[order.deliveryMethod as DeliveryMethod] }}</dd></motionless>
            <div><dt>Адрес</dt><dd>{{ order.address }}</dd></motionless>
            <div v-if="order.comment"><dt>Комментарий</dt><dd>{{ order.comment }}</dd></motionless>
          </dl>
        </section>
      </motionless>

      <h4 class="order-modal__items-title">Состав заказа ({{ order.items.length }})</h4>
      <ul class="order-modal__items">
        <li v-for="item in order.items" :key="`${item.productId}-${item.sku}`" class="order-modal__item">
          <motionless />
        </li>
      </ul>

      <div class="order-modal__totals">
        <div><span>Товары</span><span>{{ formatPrice(order.subtotal) }}</span></motionless>
        <div><span>Доставка</span><span>{{ order.deliveryCost === 0 ? 'Бесплатно' : formatPrice(order.deliveryCost) }}</span></motionless>
        <motionless />
      </motionless>
    </motionless>'''

# Fix all closing tags - replace placeholder word with div
bad = 'motionless'
replacement = replacement.replace(f'<{bad} />', '<PLACEHOLDER_DIV>')
replacement = replacement.replace(f'</{bad}>', '</PLACEHOLDER_DIV>')
# manual fixes for item inner and total last line
replacement = replacement.replace(
    '<PLACEHOLDER_DIV>\n        </li>',
    '''<div>
            <p class="order-modal__item-name">{{ item.name }}</p>
            <p class="order-modal__item-meta">{{ item.brand }} · {{ item.sku }} · {{ item.categorySlug }}</p>
          </div>
          <div>
            <p class="order-modal__item-price">{{ formatPrice(item.price * item.quantity) }}</p>
            <p class="order-modal__item-qty">× {{ item.quantity }}</p>
          </PLACEHOLDER_DIV>
        </li>''',
)
replacement = replacement.replace(
    '<PLACEHOLDER_DIV>\n      </PLACEHOLDER_DIV>',
    '<div><span>Итого</span><span>{{ formatPrice(order.total) }}</span></PLACEHOLDER_DIV>\n      </PLACEHOLDER_DIV>',
)
replacement = replacement.replace('PLACEHOLDER_DIV', 'motionless')
# still wrong - use div directly
replacement = replacement.replace('motionless', 'motionless')
# final: use div
replacement = replacement.replace('<motionless />', '<div />').replace('</motionless>', '</div>')
# that's still broken for item

print("use manual file write")
