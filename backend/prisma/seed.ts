import { PrismaClient } from '@prisma/client'
import { seedServiceCenters } from './seed-service'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const brands = ['Bosch', 'Mann-Filter', 'NGK', 'Brembo', 'ATE', 'KYB', 'Gates', 'Varta', 'Denso', 'Febi']

const categories = [
  {
    id: 'engine',
    name: 'Двигатель',
    icon: 'lucide:cog',
    description: 'Фильтры, ремни, свечи, насосы и расходники для двигателя',
  },
  {
    id: 'brakes',
    name: 'Тормозная система',
    icon: 'lucide:circle-parking',
    description: 'Колодки, диски, жидкости и комплектующие тормозов',
  },
  {
    id: 'suspension',
    name: 'Подвеска',
    icon: 'lucide:wrench',
    description: 'Амортизаторы, пружины, сайлентблоки и рычаги',
  },
  {
    id: 'electrics',
    name: 'Электрика',
    icon: 'lucide:zap',
    description: 'Аккумуляторы, генераторы, стартеры и электрокомпоненты',
  },
]

const engineTemplates = [
  { name: 'Масляный фильтр', partType: 'oil-filter', highlights: ['Ресурс 15 000 км', 'Металлический корпус'] },
  { name: 'Воздушный фильтр', partType: 'air-filter', highlights: ['Высокая пропускная способность', 'Для турбо'] },
  { name: 'Свечи зажигания (комплект)', partType: 'spark-plug', highlights: ['Иридиевые электроды', '4 шт. в комплекте'] },
  { name: 'Ремень ГРМ', partType: 'timing-belt', highlights: ['С натяжителем', 'Ресурс 90 000 км'] },
  { name: 'Помпа водяная', partType: 'water-pump', highlights: ['С прокладкой', 'Подшипник усиленный'] },
]

const brakesTemplates = [
  { name: 'Тормозные колодки', partType: 'pads', axle: 'front', highlights: ['Низкий уровень пыли', 'Керамическая накладка'] },
  { name: 'Тормозные колодки задние', partType: 'pads', axle: 'rear', highlights: ['OEM-качество', 'Датчик износа'] },
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

const PRODUCTS_PER_CATEGORY = 13

const fitmentProfiles = [
  { carBrand: 'Toyota', carModel: 'Camry', yearFrom: 2015, yearTo: 2024 },
  { carBrand: 'Toyota', carModel: 'RAV4', yearFrom: 2016, yearTo: 2024 },
  { carBrand: 'Volkswagen', carModel: 'Polo', yearFrom: 2014, yearTo: 2022 },
  { carBrand: 'Hyundai', carModel: 'Solaris', yearFrom: 2017, yearTo: 2024 },
  { carBrand: 'Kia', carModel: 'Rio', yearFrom: 2016, yearTo: 2023 },
  { carBrand: 'BMW', carModel: '3 Series', yearFrom: 2012, yearTo: 2020 },
  { carBrand: 'Lada', carModel: 'Vesta', yearFrom: 2016, yearTo: 2024 },
  { carBrand: 'Renault', carModel: 'Logan', yearFrom: 2014, yearTo: 2023 },
]

function buildFitment(productIndex: number) {
  const a = fitmentProfiles[productIndex % fitmentProfiles.length]!
  const b = fitmentProfiles[(productIndex + 2) % fitmentProfiles.length]!
  return [a, b]
}

async function seedProductFitment() {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } })
  let updated = 0
  for (let i = 0; i < products.length; i++) {
    const p = products[i]!
    const attrs = p.attributes as Record<string, unknown>
    if (Array.isArray(attrs.fitment) && (attrs.fitment as unknown[]).length > 0) continue
    await prisma.product.update({
      where: { id: p.id },
      data: {
        attributes: { ...attrs, fitment: buildFitment(i) },
      },
    })
    updated++
  }
  if (updated > 0) console.log(`Fitment added to ${updated} products`)
}

async function seedDemoGarage() {
  const user = await prisma.user.findUnique({ where: { email: 'demo@autodetail.ru' } })
  if (!user) return
  const count = await prisma.garageVehicle.count({ where: { userId: user.id } })
  if (count > 0) return
  await prisma.garageVehicle.createMany({
    data: [
      {
        userId: user.id,
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        isDefault: true,
        nickname: 'Семейная',
      },
      {
        userId: user.id,
        brand: 'Volkswagen',
        model: 'Polo',
        year: 2018,
        isDefault: false,
      },
    ],
  })
  console.log('Demo garage vehicles created for demo@autodetail.ru')
}

async function seedUsers() {
  const demoPassword = await bcrypt.hash('demo12345', 10)
  await prisma.user.upsert({
    where: { email: 'demo@autodetail.ru' },
    create: {
      email: 'demo@autodetail.ru',
      password: demoPassword,
      fullName: 'Иванов Иван Иванович',
      phone: '+7 (999) 123-45-67',
    },
    update: {},
  })

  const adminPassword = await bcrypt.hash('test_test', 10)
  await prisma.user.upsert({
    where: { email: 'admin@admin.ru' },
    create: {
      email: 'admin@admin.ru',
      password: adminPassword,
      role: 'admin',
      fullName: 'Администратор',
      phone: '+7 (800) 000-00-01',
    },
    update: { role: 'admin', password: adminPassword },
  })

  await prisma.user.deleteMany({ where: { email: 'admin@autodetail.ru' } })
}

async function main() {
  const productCount = await prisma.product.count()
  if (productCount > 0) {
    console.log(`Products seed skipped: ${productCount} products already exist`)
  } else {
  console.log('Seeding database...')

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      create: cat,
      update: cat,
    })
  }

  const batches: Array<{
    categoryId: string
    templates: typeof engineTemplates
    extra: (t: (typeof engineTemplates)[0]) => Record<string, string | number | boolean>
  }> = [
    { categoryId: 'engine', templates: engineTemplates, extra: () => ({}) },
    {
      categoryId: 'brakes',
      templates: brakesTemplates,
      extra: (t) => ({ axle: (t as { axle?: string }).axle ?? 'front' }),
    },
    {
      categoryId: 'suspension',
      templates: suspensionTemplates,
      extra: (t) => ({ axle: (t as { axle?: string }).axle ?? 'front' }),
    },
    {
      categoryId: 'electrics',
      templates: electricsTemplates,
      extra: (t) => ({ voltage: (t as { voltage?: string }).voltage ?? '12' }),
    },
  ]

  let productIndex = 0
  for (const batch of batches) {
    for (let i = 0; i < PRODUCTS_PER_CATEGORY; i++) {
      const t = batch.templates[i % batch.templates.length]!
      const brand = brands[i % brands.length]!
      const basePrice = 800 + (i % 12) * 650 + (batch.categoryId === 'electrics' ? 2000 : 0)
      const inStock = i % 5 !== 0
      const idSuffix = 100 + i

      await prisma.product.create({
        data: {
          categoryId: batch.categoryId,
          name: `${t.name} ${brand} ${idSuffix}`,
          brand,
          price: basePrice,
          oldPrice: i % 4 === 0 ? Math.round(basePrice * 1.15) : null,
          inStock,
          oem: `OEM-${batch.categoryId.toUpperCase()}-${1000 + i + batch.categoryId.length * 100}`,
          sku: `AD-${batch.categoryId.slice(0, 3).toUpperCase()}-${idSuffix}`,
          rating: 3.8 + (i % 12) * 0.1,
          reviewsCount: 12 + (i % 40),
          description: `${t.name} для широкого парка автомобилей. Проверенное качество бренда ${brand}. Подходит для планового ТО.`,
          attributes: {
            partType: t.partType,
            brand,
            inStock,
            price: basePrice,
            fitment: buildFitment(productIndex),
            ...batch.extra(t),
          },
          highlights: t.highlights,
        },
      })
      productIndex++
    }
  }
  }

  await seedUsers()
  await seedProductFitment()
  await seedDemoGarage()
  await seedServiceCenters(prisma)
  console.log('Seed completed (admin: admin@admin.ru / test_test)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
