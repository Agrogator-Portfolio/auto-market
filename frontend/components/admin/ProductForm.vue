<script setup lang="ts">
import type { CatalogProduct, CategorySlug } from '~/data/catalog'
import { catalogCategories, formatPrice, getCategoryBySlug } from '~/data/catalog'

const props = defineProps<{
  initial?: CatalogProduct | null
}>()

const emit = defineEmits<{
  submit: [payload: Record<string, unknown>]
}>()

const { getCategoryFields } = useAdmin()

const categoryFields = ref<Record<string, Array<{ key: string; label: string; type: string; options?: { label: string; value: string }[] }>>>({})
const attributeValues = reactive<Record<string, string>>({})

const form = reactive({
  categoryId: 'engine' as CategorySlug,
  name: '',
  brand: '',
  price: 0,
  oldPrice: '' as string | number,
  inStock: true,
  oem: '',
  sku: '',
  description: '',
  highlightsText: '',
})

onMounted(async () => {
  categoryFields.value = await getCategoryFields()
  if (props.initial) {
    const p = props.initial
    form.categoryId = p.categorySlug
    form.name = p.name
    form.brand = p.brand
    form.price = p.price
    form.oldPrice = p.oldPrice ?? ''
    form.inStock = p.inStock
    form.oem = p.oem
    form.sku = p.sku
    form.description = p.description
    form.highlightsText = p.highlights.join('\n')
    const attrs = p.attributes as Record<string, string>
    for (const field of categoryFields.value[p.categorySlug] ?? []) {
      attributeValues[field.key] = String(attrs[field.key] ?? '')
    }
  } else {
    resetAttributes()
  }
})

function resetAttributes() {
  Object.keys(attributeValues).forEach((k) => delete attributeValues[k])
  for (const field of dynamicFields.value) {
    attributeValues[field.key] = field.options?.[0]?.value ?? ''
  }
}

const dynamicFields = computed(() => categoryFields.value[form.categoryId] ?? [])

const previewCategory = computed(() => getCategoryBySlug(form.categoryId))

watch(
  () => form.categoryId,
  () => {
    if (!props.initial) resetAttributes()
  },
)

function onSubmit() {
  const highlights = form.highlightsText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  emit('submit', {
    categoryId: form.categoryId,
    name: form.name,
    brand: form.brand,
    price: Number(form.price),
    oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
    inStock: form.inStock,
    oem: form.oem,
    sku: form.sku,
    description: form.description,
    highlights,
    attributeValues: { ...attributeValues },
  })
}
</script>

<template>
  <div class="admin-product-layout">
    <form class="admin-form admin-product-layout__form" @submit.prevent="onSubmit">
    <label class="admin-form__field">
      <span>Категория (тип товара)</span>
      <select v-model="form.categoryId" required>
        <option v-for="cat in catalogCategories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </label>

    <label class="admin-form__field">
      <span>Название</span>
      <input v-model="form.name" type="text" required />
    </label>

    <label class="admin-form__field">
      <span>Бренд</span>
      <input v-model="form.brand" type="text" required />
    </label>

    <div class="admin-form__row">
      <label class="admin-form__field">
        <span>Цена, ₽</span>
        <input v-model.number="form.price" type="number" min="0" required />
      </label>
      <label class="admin-form__field">
        <span>Старая цена</span>
        <input v-model="form.oldPrice" type="number" min="0" />
      </label>
    </div>

    <label class="admin-form__check">
      <input v-model="form.inStock" type="checkbox" />
      В наличии
    </label>

    <div class="admin-form__row">
      <label class="admin-form__field">
        <span>OEM</span>
        <input v-model="form.oem" type="text" required />
      </label>
      <label class="admin-form__field">
        <span>Артикул (SKU)</span>
        <input v-model="form.sku" type="text" required />
      </label>
    </div>

    <fieldset v-if="dynamicFields.length" class="admin-form__fieldset">
      <legend>Характеристики для фильтров</legend>
      <label
        v-for="field in dynamicFields"
        :key="field.key"
        class="admin-form__field"
      >
        <span>{{ field.label }}</span>
        <select v-if="field.options" v-model="attributeValues[field.key]" required>
          <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <input v-else v-model="attributeValues[field.key]" type="text" required />
      </label>
    </fieldset>

    <label class="admin-form__field">
      <span>Описание</span>
      <textarea v-model="form.description" rows="4" required />
    </label>

    <label class="admin-form__field">
      <span>Ключевые пункты (по одному на строку)</span>
      <textarea v-model="form.highlightsText" rows="3" />
    </label>

    <button type="submit" class="btn btn--admin-primary">
      <slot name="submit-label">Сохранить</slot>
    </button>
  </form>

    <aside class="admin-product-layout__preview admin-card">
      <p class="admin-product-layout__preview-label">Предпросмотр карточки</p>
      <div class="admin-product-preview">
        <div class="admin-product-preview__image">
          <UiImagePlaceholder fill text="Фото" />
        </div>
        <p v-if="previewCategory" class="admin-product-preview__cat">
          <UiAppIcon :name="previewCategory.icon" :size="14" />
          {{ previewCategory.name }}
        </p>
        <p class="admin-product-preview__brand">{{ form.brand || 'Бренд' }}</p>
        <h3 class="admin-product-preview__name">{{ form.name || 'Название товара' }}</h3>
        <p class="admin-product-preview__sku">SKU: {{ form.sku || '—' }} · OEM: {{ form.oem || '—' }}</p>
        <div class="admin-product-preview__prices">
          <strong>{{ formatPrice(Number(form.price) || 0) }}</strong>
          <span v-if="form.oldPrice">{{ formatPrice(Number(form.oldPrice)) }}</span>
        </div>
        <span
          class="admin-product-preview__stock"
          :class="{ 'admin-product-preview__stock--out': !form.inStock }"
        >
          {{ form.inStock ? 'В наличии' : 'Нет в наличии' }}
        </span>
        <p v-if="form.description" class="admin-product-preview__desc">
          {{ form.description.slice(0, 160) }}{{ form.description.length > 160 ? '…' : '' }}
        </p>
        <ul v-if="form.highlightsText.trim()" class="admin-product-preview__highlights">
          <li v-for="(line, i) in form.highlightsText.split('\n').filter(Boolean).slice(0, 3)" :key="i">
            {{ line }}
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.admin-product-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 1.5rem;
  align-items: start;
}

.admin-form {
  display: grid;
  gap: 1rem;
}

.admin-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.admin-form__field {
  display: grid;
  gap: 0.35rem;
}

.admin-form__field span,
.admin-form__fieldset legend {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.admin-form__field input,
.admin-form__field select,
.admin-form__field textarea {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font: inherit;
}

.admin-form__check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.admin-form__fieldset {
  margin: 0;
  padding: 1rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  display: grid;
  gap: 0.75rem;
}

.admin-product-layout__preview {
  position: sticky;
  top: 1rem;
  padding: 1.25rem;
}

.admin-product-layout__preview-label {
  margin: 0 0 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
}

.admin-product-preview__image {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  background: #f1f5f9;
}

.admin-product-preview__cat {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0 0 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
}

.admin-product-preview__brand {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #e85d04;
}

.admin-product-preview__name {
  margin: 0.25rem 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.3;
  color: #0f172a;
}

.admin-product-preview__sku {
  margin: 0 0 0.75rem;
  font-size: 0.78rem;
  color: #94a3b8;
}

.admin-product-preview__prices {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.admin-product-preview__prices strong {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
}

.admin-product-preview__prices span {
  font-size: 0.9rem;
  color: #94a3b8;
  text-decoration: line-through;
}

.admin-product-preview__stock {
  display: inline-block;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  background: #ecfdf5;
  color: #047857;
}

.admin-product-preview__stock--out {
  background: #f1f5f9;
  color: #64748b;
}

.admin-product-preview__desc {
  margin: 1rem 0 0;
  font-size: 0.85rem;
  line-height: 1.55;
  color: #475569;
}

.admin-product-preview__highlights {
  margin: 0.75rem 0 0;
  padding-left: 1.1rem;
  font-size: 0.82rem;
  color: #475569;
}

@media (max-width: 960px) {
  .admin-product-layout {
    grid-template-columns: 1fr;
  }

  .admin-product-layout__preview {
    position: static;
  }
}

@media (max-width: 600px) {
  .admin-form__row {
    grid-template-columns: 1fr;
  }
}
</style>
