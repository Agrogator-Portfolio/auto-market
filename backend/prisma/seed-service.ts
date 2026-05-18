import { PrismaClient } from '@prisma/client'

export const SERVICE_CATEGORIES = [
  { id: 'maintenance', name: 'Техническое обслуживание', description: 'Плановое ТО, замена масла и расходников' },
  { id: 'brakes', name: 'Тормозная система', description: 'Колодки, диски, тормозная жидкость' },
  { id: 'suspension', name: 'Подвеска', description: 'Амортизаторы, рычаги, сайлентблоки' },
  { id: 'engine', name: 'Двигатель', description: 'Ремонт и обслуживание ДВС' },
  { id: 'diagnostics', name: 'Диагностика', description: 'Компьютерная диагностика, поиск неисправностей' },
  { id: 'tires', name: 'Шиномонтаж', description: 'Сезонная замена и балансировка колёс' },
  { id: 'alignment', name: 'Развал-схождение', description: 'Регулировка углов установки колёс' },
  { id: 'electrics', name: 'Электрика', description: 'Проводка, аккумулятор, освещение' },
] as const

const TARGET_COUNT = 40

const NAME_BY_PRIMARY: Record<string, string[]> = {
  maintenance: ['ТО Центр', 'Сервис ТО', 'МаслоПро', 'АвтоТО', 'ТехОбслуживание'],
  brakes: ['ТормозПро', 'Стоп-Авто', 'ТормозМастер', 'БрейкСервис', 'Тормозной центр'],
  suspension: ['Подвеска+', 'Ходовая Про', 'Амортисервис', 'СайлентПро', 'Рычаг Центр'],
  engine: ['МоторСервис', 'Двигатель Про', 'МоторМастер', 'ДВС Центр', 'Поршень СТО'],
  diagnostics: ['ДиагноСтик', 'АвтоСкан', 'Диагностика+', 'Чек-Двигатель', 'СканМотор'],
  tires: ['Шиномир', 'Колёса Про', 'ШинаСервис', 'БалансКолёс', 'Резина Центр'],
  alignment: ['РазвалЦентр', 'Схождение Про', 'Углы Колёс', 'Развал-Мастер', 'Геометрия+'],
  electrics: ['ЭлектроАвто', 'ВольтСервис', 'Проводка Про', 'АКБ Центр', 'СветАвто'],
}

function secondaryCategories(primary: string, allIds: string[]): string[] {
  const idx = allIds.indexOf(primary)
  return allIds.filter((id) => id !== primary).sort((a, b) => {
    const da = (allIds.indexOf(a) - idx + allIds.length) % allIds.length
    const db = (allIds.indexOf(b) - idx + allIds.length) % allIds.length
    return da - db
  })
}

const LOCATION_SUFFIX = ['', ' Север', ' Юг', ' Центр', ' у метро']

const CITY_DISTRIBUTION: Array<{ city: string; streets: string[]; phonePrefix: string }> = [
  {
    city: 'Москва',
    phonePrefix: '+7 (495)',
    streets: [
      'ул. Автозаводская, 23',
      'Ленинградское ш., 39',
      'ул. Профсоюзная, 56',
      'Варшавское ш., 132',
      'ул. Дмитровка, 12',
      'пр. Мира, 88',
      'ул. Сущёвский вал, 5',
      'Кутузовский пр., 21',
      'ул. Люблинская, 78',
      'ул. Большая Черкизовская, 3',
      'ул. Вавилова, 9',
      'ул. Перерва, 44',
      'ул. Подольских Курсантов, 2',
      'Шоссе Энтузиастов, 31',
    ],
  },
  {
    city: 'Санкт-Петербург',
    phonePrefix: '+7 (812)',
    streets: [
      'пр. Обуховской обороны, 120',
      'ул. Савушкина, 83',
      'ул. Бухарестская, 30',
      'пр. Просвещения, 72',
      'ул. Типанова, 15',
      'ул. Коломяжская, 28',
      'ул. Дыбенко, 7',
      'ул. Заставская, 45',
      'ул. Кораблестроителей, 32',
      'ул. Большевиков, 55',
    ],
  },
  {
    city: 'Казань',
    phonePrefix: '+7 (843)',
    streets: ['ул. Спартаковская, 5', 'ул. Петербургская, 50', 'пр. Победы, 91', 'ул. Декабристов, 18', 'ул. Амирхана, 12', 'ул. Баумана, 44'],
  },
  {
    city: 'Екатеринбург',
    phonePrefix: '+7 (343)',
    streets: ['ул. Машинная, 27', 'пр. Ленина, 68', 'ул. Репина, 4', 'ул. Сулимова, 6', 'ул. Фурманова, 126'],
  },
  {
    city: 'Новосибирск',
    phonePrefix: '+7 (383)',
    streets: ['ул. Немировича-Данченко, 122', 'Красный пр., 220', 'ул. Гоголя, 15', 'ул. Станционная, 33', 'ул. Кирова, 86'],
  },
]

function buildCategorySets(): string[][] {
  const ids = SERVICE_CATEGORIES.map((c) => c.id)
  const sets: string[][] = []

  for (const primary of ids) {
    const secondaries = secondaryCategories(primary, ids)
    for (let v = 0; v < 5; v++) {
      const secondary = secondaries[v % secondaries.length]!
      const tertiary = secondaries[(v + 1) % secondaries.length]!
      const cats = v % 2 === 0 ? [primary, secondary] : [primary, secondary, tertiary]
      sets.push([...new Set(cats)])
    }
  }

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i]!
      const b = ids[j]!
      let matching = sets.filter((s) => s.includes(a) && s.includes(b)).length
      let ptr = 0
      while (matching < 3 && ptr < sets.length) {
        const set = sets[ptr]!
        if (set.includes(a) && !set.includes(b)) {
          set.push(b)
          matching++
        } else if (set.includes(b) && !set.includes(a)) {
          set.push(a)
          matching++
        } else if (!set.includes(a) && !set.includes(b)) {
          sets[ptr] = [a, b, set[0]!]
          matching++
        }
        ptr++
      }
    }
  }

  return sets
}

function buildServices() {
  const categorySets = buildCategorySets()
  const services: Array<{
    id: string
    name: string
    city: string
    address: string
    description: string
    rating: number
    workSchedule: string
    phone: string
    categoryIds: string[]
  }> = []

  let globalIdx = 0
  const primaries = SERVICE_CATEGORIES.map((c) => c.id)

  for (let p = 0; p < primaries.length; p++) {
    const primary = primaries[p]!
    const names = NAME_BY_PRIMARY[primary]!
    for (let v = 0; v < 5; v++) {
      const cityBlock = CITY_DISTRIBUTION[globalIdx % CITY_DISTRIBUTION.length]!
      const street = cityBlock.streets[globalIdx % cityBlock.streets.length]!
      const loc = LOCATION_SUFFIX[v % LOCATION_SUFFIX.length]
      const nameBase = names[v % names.length]!
      const name =
        loc && !nameBase.includes('Центр')
          ? `${nameBase}${loc}`
          : `${nameBase} ${cityBlock.city.split(' ')[0]}`

      const categoryIds = categorySets[p * 5 + v]!
      const rating = 4.4 + ((globalIdx % 12) * 0.05)

      services.push({
        id: `svc-${primary}-${String(globalIdx + 1).padStart(2, '0')}`,
        name,
        city: cityBlock.city,
        address: street,
        description: `Автосервис «${name}»: ${SERVICE_CATEGORIES.find((c) => c.id === primary)?.name?.toLowerCase()} и смежные работы. Современное оборудование, опытные мастера.`,
        rating: Math.min(5, Math.round(rating * 100) / 100),
        workSchedule:
          globalIdx % 3 === 0
            ? 'Пн–Вс 8:00–21:00'
            : globalIdx % 3 === 1
              ? 'Пн–Пт 9:00–20:00, Сб 10:00–18:00'
              : 'Пн–Сб 9:00–19:00, Вс 10:00–16:00',
        phone: `${cityBlock.phonePrefix} ${100 + (globalIdx % 800)}-${10 + (globalIdx % 80)}-${20 + (globalIdx % 80)}`,
        categoryIds,
      })
      globalIdx++
    }
  }

  return services
}

export async function seedServiceCenters(prisma: PrismaClient) {
  for (const cat of SERVICE_CATEGORIES) {
    await prisma.serviceCategory.upsert({
      where: { id: cat.id },
      create: cat,
      update: cat,
    })
  }

  const count = await prisma.autoService.count()
  if (count === TARGET_COUNT) {
    console.log(`Service centers seed skipped: ${count} centers already exist`)
    return
  }

  await prisma.serviceAppointmentOnCategory.deleteMany()
  await prisma.serviceAppointment.deleteMany()
  await prisma.autoServiceOnCategory.deleteMany()
  await prisma.autoService.deleteMany()

  const services = buildServices()
  for (const svc of services) {
    const { categoryIds, ...data } = svc
    await prisma.autoService.create({
      data: {
        ...data,
        categories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
    })
  }

  console.log(`Seeded ${services.length} auto service centers`)
}
