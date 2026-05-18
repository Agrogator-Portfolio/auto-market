export interface Product {
  id: number
  name: string
  brand: string
  price: number
  oldPrice?: number
  image: string
  inStock: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  slug: string
  products: Product[]
}

export const featureBanners = [
  {
    id: 1,
    title: 'Подбор по VIN',
    description:
      'Введите VIN автомобиля — система покажет только совместимые запчасти и снизит риск ошибки при заказе.',
    icon: 'lucide:scan-search',
    accent: '#1e3a5f',
  },
  {
    id: 2,
    title: 'Поиск по OEM-номеру',
    description:
      'Найдите оригинальную деталь по артикулу производителя или подберите проверенный аналог.',
    icon: 'lucide:tag',
    accent: '#e85d04',
  },
  {
    id: 3,
    title: 'Каталог и фильтры',
    description:
      'Двигатель, тормоза, подвеска, электрика — удобная навигация по категориям, брендам и цене.',
    icon: 'lucide:layout-grid',
    accent: '#059669',
  },
  {
    id: 4,
    title: 'Доставка и отслеживание',
    description:
      'Курьер, пункт выдачи или Почта России. Статус заказа — в личном кабинете после оформления.',
    icon: 'lucide:truck',
    accent: '#7c3aed',
  },
]

export const popularProducts: Product[] = [
  {
    id: 1,
    name: 'Тормозные колодки передние',
    brand: 'Brembo',
    price: 4290,
    oldPrice: 5190,
    image:
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
    inStock: true,
  },
  {
    id: 2,
    name: 'Масляный фильтр',
    brand: 'Mann-Filter',
    price: 890,
    image:
      'https://images.unsplash.com/photo-1625048836902-7948da83e26d?w=400&h=300&fit=crop',
    inStock: true,
  },
  {
    id: 3,
    name: 'Свечи зажигания (комплект)',
    brand: 'NGK',
    price: 2150,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    inStock: true,
  },
  {
    id: 4,
    name: 'Амортизатор передний',
    brand: 'KYB',
    price: 5890,
    oldPrice: 6490,
    image:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
    inStock: false,
  },
  {
    id: 5,
    name: 'Ремень ГРМ',
    brand: 'Gates',
    price: 3420,
    image:
      'https://images.unsplash.com/photo-1619642751034-765dfec7d936?w=400&h=300&fit=crop',
    inStock: true,
  },
  {
    id: 6,
    name: 'Аккумулятор 60 А·ч',
    brand: 'Varta',
    price: 8790,
    image:
      'https://images.unsplash.com/photo-1601362840992-1e0e485ccc2f?w=400&h=300&fit=crop',
    inStock: true,
  },
  {
    id: 7,
    name: 'Воздушный фильтр',
    brand: 'Bosch',
    price: 760,
    image:
      'https://images.unsplash.com/photo-1487754180451-cde0e997aafd?w=400&h=300&fit=crop',
    inStock: true,
  },
  {
    id: 8,
    name: 'Тормозной диск',
    brand: 'ATE',
    price: 4650,
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
    inStock: true,
  },
]

export const stoPartners = [
  { id: 1, name: 'АвтоМастер', city: 'Москва', rating: 4.8, services: 'ТО, тормоза, подвеска' },
  { id: 2, name: 'Drive Service', city: 'Санкт-Петербург', rating: 4.9, services: 'Диагностика, двигатель' },
  { id: 3, name: 'ProGarage', city: 'Казань', rating: 4.7, services: 'Шиномонтаж, развал-схождение' },
]

export const categories: Category[] = [
  {
    id: 'engine',
    name: 'Двигатель',
    icon: 'lucide:cog',
    slug: 'engine',
    products: popularProducts.slice(0, 4),
  },
  {
    id: 'brakes',
    name: 'Тормозная система',
    icon: 'lucide:circle-parking',
    slug: 'brakes',
    products: [popularProducts[0]!, popularProducts[7]!, popularProducts[1]!, popularProducts[5]!],
  },
  {
    id: 'suspension',
    name: 'Подвеска',
    icon: 'lucide:wrench',
    slug: 'suspension',
    products: [popularProducts[3]!, popularProducts[4]!, popularProducts[2]!, popularProducts[6]!],
  },
  {
    id: 'electrics',
    name: 'Электрика',
    icon: 'lucide:zap',
    slug: 'electrics',
    products: [popularProducts[5]!, popularProducts[2]!, popularProducts[6]!, popularProducts[1]!],
  },
]

export { carBrands } from './vehicles'

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}
