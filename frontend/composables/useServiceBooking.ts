import type {
  AutoServiceCenter,
  ServiceAppointment,
  ServiceAppointmentStatus,
  ServiceCategory,
} from '~/data/service'

export function useServiceBooking() {
  const { apiFetch } = useApi()

  function listCategories() {
    return apiFetch<ServiceCategory[]>('/service-categories')
  }

  function listCenters(opts?: { city?: string; categoryIds?: string[] }) {
    return apiFetch<AutoServiceCenter[]>('/service-centers', {
      query: {
        city: opts?.city,
        categories: opts?.categoryIds?.length ? opts.categoryIds.join(',') : undefined,
      },
    })
  }

  function listAppointments(status?: ServiceAppointmentStatus) {
    return apiFetch<ServiceAppointment[]>('/service-appointments', {
      query: status ? { status } : undefined,
    })
  }

  function getAppointment(id: string) {
    return apiFetch<ServiceAppointment>(`/service-appointments/${id}`)
  }

  function createAppointment(body: {
    garageVehicleId: string
    autoServiceId: string
    categoryIds: string[]
    problemDescription: string
  }) {
    return apiFetch<ServiceAppointment>('/service-appointments', {
      method: 'POST',
      body,
    })
  }

  return {
    listCategories,
    listCenters,
    listAppointments,
    getAppointment,
    createAppointment,
  }
}

export function useAdminService() {
  const { apiFetch } = useApi()

  function listCategories() {
    return apiFetch<ServiceCategory[]>('/admin/auto-services/categories')
  }

  function listAutoServices() {
    return apiFetch<AutoServiceCenter[]>('/admin/auto-services')
  }

  function getAutoService(id: string) {
    return apiFetch<AutoServiceCenter>(`/admin/auto-services/${id}`)
  }

  function createAutoService(body: {
    name: string
    city: string
    address: string
    description: string
    rating: number
    workSchedule: string
    phone?: string
    categoryIds: string[]
  }) {
    return apiFetch<AutoServiceCenter>('/admin/auto-services', { method: 'POST', body })
  }

  function updateAutoService(
    id: string,
    body: Partial<{
      name: string
      city: string
      address: string
      description: string
      rating: number
      workSchedule: string
      phone: string
      categoryIds: string[]
    }>,
  ) {
    return apiFetch<AutoServiceCenter>(`/admin/auto-services/${id}`, { method: 'PATCH', body })
  }

  function deleteAutoService(id: string) {
    return apiFetch<{ ok: boolean }>(`/admin/auto-services/${id}`, { method: 'DELETE' })
  }

  function listAppointments(status?: ServiceAppointmentStatus) {
    return apiFetch<ServiceAppointment[]>('/admin/service-appointments', {
      query: status ? { status } : undefined,
    })
  }

  function getAppointment(id: string) {
    return apiFetch<ServiceAppointment>(`/admin/service-appointments/${id}`)
  }

  function scheduleAppointment(id: string, scheduledAt: string) {
    return apiFetch<ServiceAppointment>(`/admin/service-appointments/${id}/schedule`, {
      method: 'PATCH',
      body: { scheduledAt },
    })
  }

  function rejectAppointment(id: string, rejectReason?: string) {
    return apiFetch<ServiceAppointment>(`/admin/service-appointments/${id}/reject`, {
      method: 'PATCH',
      body: { rejectReason },
    })
  }

  function getRecommendableProducts(appointmentId: string, search?: string) {
    return apiFetch<import('~/data/catalog').CatalogProduct[]>(
      `/admin/service-appointments/${appointmentId}/recommendable-products`,
      { query: search ? { search } : undefined },
    )
  }

  function setRecommendedProducts(appointmentId: string, productIds: number[]) {
    return apiFetch<ServiceAppointment>(
      `/admin/service-appointments/${appointmentId}/recommended-products`,
      { method: 'PUT', body: { productIds } },
    )
  }

  return {
    listCategories,
    listAutoServices,
    getAutoService,
    createAutoService,
    updateAutoService,
    deleteAutoService,
    listAppointments,
    getAppointment,
    scheduleAppointment,
    rejectAppointment,
    getRecommendableProducts,
    setRecommendedProducts,
  }
}
