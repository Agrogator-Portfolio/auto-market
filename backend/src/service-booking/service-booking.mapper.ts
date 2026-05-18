import { Product, ServiceAppointmentStatus } from '@prisma/client'
import { buildGarageMatchLabel, mapProduct } from '../common/product.mapper'
import { parseFitment } from '../common/fitment'
import { vehicleLabel } from '../common/fitment'

const appointmentInclude = {
  garageVehicle: true,
  autoService: {
    include: {
      categories: { include: { category: true } },
    },
  },
  requestedCategories: { include: { category: true } },
  recommendedProducts: {
    include: { product: true },
    orderBy: { createdAt: 'asc' as const },
  },
  user: { select: { id: true, email: true, fullName: true, phone: true } },
} as const

export { appointmentInclude }

function mapCategory(c: { id: string; name: string; description: string }) {
  return { id: c.id, name: c.name, description: c.description }
}

export function mapAutoService(s: {
  id: string
  name: string
  city: string
  address: string
  description: string
  rating: number
  workSchedule: string
  phone: string | null
  categories: Array<{ category: { id: string; name: string; description: string } }>
}) {
  return {
    id: s.id,
    name: s.name,
    city: s.city,
    address: s.address,
    description: s.description,
    rating: s.rating,
    workSchedule: s.workSchedule,
    phone: s.phone ?? undefined,
    categories: s.categories.map((x) => mapCategory(x.category)),
  }
}

function mapRecommendedProducts(
  rows: Array<{ product: Product }>,
  vehicle: { brand: string; model: string; year: number },
) {
  return rows.map((r) => {
    const fitment = parseFitment(r.product.attributes as Record<string, unknown>)
    const garageMatchLabel = buildGarageMatchLabel(fitment, vehicle)
    return mapProduct(r.product, { garageMatchLabel })
  })
}

export function mapAppointment(a: {
  id: string
  number: string
  problemDescription: string
  status: ServiceAppointmentStatus
  scheduledAt: Date | null
  rejectReason: string | null
  createdAt: Date
  updatedAt: Date
  garageVehicle: { id: string; brand: string; model: string; year: number; nickname: string | null }
  autoService: Parameters<typeof mapAutoService>[0]
  requestedCategories: Array<{ category: { id: string; name: string; description: string } }>
  recommendedProducts?: Array<{ product: Product }>
  user?: { id: string; email: string; fullName: string; phone: string }
}) {
  const v = a.garageVehicle
  const vehicle = { brand: v.brand, model: v.model, year: v.year }
  return {
    id: a.id,
    number: a.number,
    problemDescription: a.problemDescription,
    status: a.status,
    scheduledAt: a.scheduledAt?.toISOString() ?? undefined,
    rejectReason: a.rejectReason ?? undefined,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    requestedCategories: a.requestedCategories.map((x) => mapCategory(x.category)),
    recommendedProducts: mapRecommendedProducts(a.recommendedProducts ?? [], vehicle),
    vehicle: {
      id: v.id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      nickname: v.nickname ?? undefined,
      label: vehicleLabel(v.brand, v.model),
    },
    autoService: mapAutoService(a.autoService),
    user: a.user,
  }
}
