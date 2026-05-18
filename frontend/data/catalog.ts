import { formatPrice } from './mock'

export type CategorySlug = 'engine' | 'brakes' | 'suspension' | 'electrics'

export type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'name_asc' | 'rating_desc'

export type FilterType = 'select' | 'multiselect' | 'range' | 'checkbox'

export interface FilterOption {
  label: string
  value: string
}

export interface CatalogFilterDef {
  key: string
  label: string
  type: FilterType
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
}

export interface CatalogCategory {
  id: CategorySlug
  name: string
  icon: string
  slug: CategorySlug
  description: string
  filters: CatalogFilterDef[]
}

export interface ProductFitment {
  carBrand: string
  carModel: string
  yearFrom: number
  yearTo: number
}

export interface CatalogProduct {
  id: number
  categorySlug: CategorySlug
  name: string
  brand: string
  price: number
  oldPrice?: number
  image: string
  inStock: boolean
  oem: string
  sku: string
  rating: number
  reviewsCount: number
  description: string
  /** Атрибуты для фильтрации и отображения в деталке */
  attributes: Record<string, string | number | boolean>
  fitment?: ProductFitment[]
  /** Ключевые характеристики для карточки категории */
  highlights: string[]
  /** Плашка «подходит для …» при подборе по гаражу */
  garageMatchLabel?: string
}

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price_asc', label: 'Сначала дешевле' },
  { value: 'price_desc', label: 'Сначала дороже' },
  { value: 'name_asc', label: 'По названию А–Я' },
  { value: 'rating_desc', label: 'По рейтингу' },
]

export const PAGE_SIZE = 8

const brands = ['Bosch', 'Mann-Filter', 'NGK', 'Brembo', 'ATE', 'KYB', 'Gates', 'Varta', 'Denso', 'Febi']

export const catalogCategories: CatalogCategory[] = [
  {
    id: 'engine',
    name: 'Двигатель',
    icon: 'lucide:cog',
    slug: 'engine',
    description: 'Фильтры, ремни, свечи, насосы и расходники для двигателя',
    filters: [
      {
        key: 'partType',
        label: 'Тип детали',
        type: 'multiselect',
        options: [
          { label: 'Масляный фильтр', value: 'oil-filter' },
          { label: 'Воздушный фильтр', value: 'air-filter' },
          { label: 'Свечи зажигания', value: 'spark-plug' },
          { label: 'Ремень ГРМ', value: 'timing-belt' },
          { label: 'Помпа', value: 'water-pump' },
        ],
      },
      {
        key: 'brand',
        label: 'Бренд',
        type: 'multiselect',
        options: brands.map((b) => ({ label: b, value: b })),
      },
      { key: 'inStock', label: 'Только в наличии', type: 'checkbox' },
      { key: 'price', label: 'Цена, ₽', type: 'range', min: 500, max: 15000, step: 500 },
    ],
  },
  {
    id: 'brakes',
    name: 'Тормозная система',
    icon: 'lucide:circle-parking',
    slug: 'brakes',
    description: 'Колодки, диски, жидкости и комплектующие тормозов',
    filters: [
      {
        key: 'partType',
        label: 'Тип детали',
        type: 'multiselect',
        options: [
          { label: 'Колодки', value: 'pads' },
          { label: 'Диски', value: 'discs' },
          { label: 'Тормозная жидкость', value: 'fluid' },
          { label: 'Суппорт', value: 'caliper' },
        ],
      },
      {
        key: 'axle',
        label: 'Ось',
        type: 'select',
        options: [
          { label: 'Любая', value: '' },
          { label: 'Передняя', value: 'front' },
          { label: 'Задняя', value: 'rear' },
        ],
      },
      {
        key: 'brand',
        label: 'Бренд',
        type: 'multiselect',
        options: brands.map((b) => ({ label: b, value: b })),
      },
      { key: 'inStock', label: 'Только в наличии', type: 'checkbox' },
      { key: 'price', label: 'Цена, ₽', type: 'range', min: 800, max: 12000, step: 500 },
    ],
  },
  {
    id: 'suspension',
    name: 'Подвеска',
    icon: 'lucide:wrench',
    slug: 'suspension',
    description: 'Амортизаторы, пружины, сайлентблоки и рычаги',
    filters: [
      {
        key: 'partType',
        label: 'Тип детали',
        type: 'multiselect',
        options: [
          { label: 'Амортизатор', value: 'shock' },
          { label: 'Пружина', value: 'spring' },
          { label: 'Сайлентблок', value: 'bushing' },
          { label: 'Рычаг', value: 'arm' },
        ],
      },
      {
        key: 'axle',
        label: 'Ось',
        type: 'select',
        options: [
          { label: 'Любая', value: '' },
          { label: 'Передняя', value: 'front' },
          { label: 'Задняя', value: 'rear' },
        ],
      },
      {
        key: 'brand',
        label: 'Бренд',
        type: 'multiselect',
        options: brands.map((b) => ({ label: b, value: b })),
      },
      { key: 'inStock', label: 'Только в наличии', type: 'checkbox' },
      { key: 'price', label: 'Цена, ₽', type: 'range', min: 600, max: 18000, step: 500 },
    ],
  },
  {
    id: 'electrics',
    name: 'Электрика',
    icon: 'lucide:zap',
    slug: 'electrics',
    description: 'Аккумуляторы, генераторы, стартеры и электрокомпоненты',
    filters: [
      {
        key: 'partType',
        label: 'Тип детали',
        type: 'multiselect',
        options: [
          { label: 'Аккумулятор', value: 'battery' },
          { label: 'Генератор', value: 'alternator' },
          { label: 'Стартер', value: 'starter' },
          { label: 'Реле / предохранитель', value: 'relay' },
        ],
      },
      {
        key: 'voltage',
        label: 'Напряжение',
        type: 'select',
        options: [
          { label: 'Любое', value: '' },
          { label: '12 В', value: '12' },
          { label: '24 В', value: '24' },
        ],
      },
      {
        key: 'brand',
        label: 'Бренд',
        type: 'multiselect',
        options: brands.map((b) => ({ label: b, value: b })),
      },
      { key: 'inStock', label: 'Только в наличии', type: 'checkbox' },
      { key: 'price', label: 'Цена, ₽', type: 'range', min: 400, max: 25000, step: 500 },
    ],
  },
]

function seedProducts(): CatalogProduct[] {
  const items: CatalogProduct[] = []
  let id = 1

  const engineTemplates = [
    { name: 'Масляный фильтр', partType: 'oil-filter', highlights: ['Ресурс 15 000 км', 'Металлический корпус'] },
    { name: 'Воздушный фильтр', partType: 'air-filter', highlights: ['Высокая пропускная способность', 'Для турбо'] },
    { name: 'Свечи зажигания (комплект)', partType: 'spark-plug', highlights: ['Иридиевые электроды', '4 шт. в комплекте'] },
    { name: 'Ремень ГРМ', partType: 'timing-belt', highlights: ['С натяжителем', 'Ресурс 90 000 км'] },
    { name: 'Помпа водяная', partType: 'water-pump', highlights: ['С прокладкой', 'Подшипник усиленный'] },
  ]

  const brakesTemplates = [
    { name: 'Тормозные колодки', partType: 'pads', axle: 'front', highlights: ['Низкий уровень пыли', 'Керамическая фрикционная накладка'] },
    { name: 'Тормозные колодки задние', partType: 'pads', axle: 'rear', highlights: ['OEM-качество', 'Датчик износа в комплекте'] },
    { name: 'Тормозной диск', partType: 'discs', axle: 'front', highlights: ['Вентилируемый', 'Диаметр 312 мм'] },
    { name: 'Тормозная жидкость DOT 4', partType: 'fluid', axle: 'front', highlights: ['Температура кипения 260°C', 'Объём 1 л'] },
    { name: 'Суппорт тормозной', partType: 'caliper', axle: 'front', highlights: ['Восстановленный', 'С поршнем'] },
  ]

  const suspensionTemplates = [
    { name: 'Амортизатор передний', partType: 'shock', axle: 'front', highlights: ['Газомасляный', 'Пара'] },
    { name: 'Амортизатор задний', partType: 'shock', axle: 'rear', highlights: ['Комфортная настройка', 'Пара'] },
    { name: 'Пружина подвески', partType: 'spring', axle: 'front', highlights: ['Понижающая -30 мм', 'Сталь'] },
    { name: 'Сайлентблок рычага', partType: 'bushing', axle: 'front', highlights: ['Полиуретан', '2 шт.'] },
    { name: 'Рычаг подвески', partType: 'arm', axle: 'rear', highlights: ['С шаровой опорой', 'Левый'] },
  ]

  const electricsTemplates = [
    { name: 'Аккумулятор', partType: 'battery', voltage: '12', highlights: ['60 А·ч', 'Пусковой ток 540 А'] },
    { name: 'Аккумулятор AGM', partType: 'battery', voltage: '12', highlights: ['70 А·ч', 'Start-Stop'] },
    { name: 'Генератор', partType: 'alternator', voltage: '12', highlights: ['140 А', 'С натяжным роликом'] },
    { name: 'Стартер', partType: 'starter', voltage: '12', highlights: ['1.4 кВт', 'Бензин'] },
    { name: 'Реле фар', partType: 'relay', voltage: '12', highlights: ['4 контакта', '40 А'] },
  ]

  const addBatch = (
    slug: CategorySlug,
    templates: typeof engineTemplates,
    extraAttrs: (t: (typeof engineTemplates)[0], i: number) => Record<string, string | number | boolean>,
  ) => {
    for (let i = 0; i < 24; i++) {
      const t = templates[i % templates.length]!
      const brand = brands[i % brands.length]!
      const basePrice = 800 + (i % 12) * 650 + (slug === 'electrics' ? 2000 : 0)
      items.push({
        id: id++,
        categorySlug: slug,
        name: `${t.name} ${brand} ${100 + i}`,
        brand,
        price: basePrice,
        oldPrice: i % 4 === 0 ? Math.round(basePrice * 1.15) : undefined,
        image: '',
        inStock: i % 5 !== 0,
        oem: `OEM-${slug.toUpperCase()}-${1000 + id}`,
        sku: `AD-${slug.slice(0, 3).toUpperCase()}-${id}`,
        rating: 3.8 + (i % 12) * 0.1,
        reviewsCount: 12 + (i % 40),
        description: `${t.name} для широкого парка автомобилей. Проверенное качество бренда ${brand}. Подходит для планового ТО и замены изношенных узлов.`,
        attributes: {
          partType: t.partType,
          brand,
          inStock: i % 5 !== 0,
          price: basePrice,
          ...extraAttrs(t, i),
        },
        highlights: t.highlights,
      })
    }
  }

  addBatch('engine', engineTemplates, () => ({}))
  addBatch('brakes', brakesTemplates, (t) => ({ axle: (t as { axle?: string }).axle ?? 'front' }))
  addBatch('suspension', suspensionTemplates, (t) => ({ axle: (t as { axle?: string }).axle ?? 'front' }))
  addBatch('electrics', electricsTemplates, (t) => ({
    voltage: (t as { voltage?: string }).voltage ?? '12',
  }))

  return items
}

export const catalogProducts: CatalogProduct[] = seedProducts()

export function getCategoryBySlug(slug: string): CatalogCategory | undefined {
  return catalogCategories.find((c) => c.slug === slug)
}

export function getProductById(id: number): CatalogProduct | undefined {
  return catalogProducts.find((p) => p.id === id)
}

export function getProductsByCategory(slug: CategorySlug): CatalogProduct[] {
  return catalogProducts.filter((p) => p.categorySlug === slug)
}

export function getRelatedProducts(product: CatalogProduct, limit = 4): CatalogProduct[] {
  return catalogProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .sort((a, b) => b.reviewsCount - a.reviewsCount)
    .slice(0, limit)
}

export { formatPrice }
