export type ServiceAppointmentStatus = 'pending' | 'scheduled' | 'rejected'

export interface ServiceCategory {
  id: string
  name: string
  description: string
}

export interface AutoServiceCenter {
  id: string
  name: string
  city: string
  address: string
  description: string
  rating: number
  workSchedule: string
  phone?: string
  categories: ServiceCategory[]
}

import type { CatalogProduct } from '~/data/catalog'

export interface ServiceAppointment {
  id: string
  number: string
  problemDescription: string
  status: ServiceAppointmentStatus
  scheduledAt?: string
  rejectReason?: string
  createdAt: string
  updatedAt: string
  requestedCategories: ServiceCategory[]
  recommendedProducts: CatalogProduct[]
  vehicle: {
    id: string
    brand: string
    model: string
    year: number
    nickname?: string
    label: string
  }
  autoService: AutoServiceCenter
  user?: {
    id: string
    email: string
    fullName: string
    phone: string
  }
}

export const serviceStatusMeta: Record<
  ServiceAppointmentStatus,
  { label: string; tone: 'warning' | 'success' | 'danger'; icon: string }
> = {
  pending: {
    label: 'Ожидает подтверждения',
    tone: 'warning',
    icon: 'lucide:clock',
  },
  scheduled: {
    label: 'Запись осуществлена',
    tone: 'success',
    icon: 'lucide:calendar-check',
  },
  rejected: {
    label: 'Отклонена',
    tone: 'danger',
    icon: 'lucide:circle-x',
  },
}

export const serviceStatusFilters: Array<{ value: ServiceAppointmentStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'pending', label: serviceStatusMeta.pending.label },
  { value: 'scheduled', label: serviceStatusMeta.scheduled.label },
  { value: 'rejected', label: serviceStatusMeta.rejected.label },
]

export function formatServiceDate(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatServiceDateShort(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}
