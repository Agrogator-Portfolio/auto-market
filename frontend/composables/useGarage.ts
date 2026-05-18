export interface GarageVehicle {
  id: string
  brand: string
  model: string
  year: number
  vin?: string
  nickname?: string
  isDefault: boolean
  label: string
  createdAt: string
  updatedAt: string
}

export interface GarageVehicleInput {
  brand: string
  model: string
  year: number
  vin?: string
  nickname?: string
  isDefault?: boolean
}

export function useGarage() {
  const { apiFetch } = useApi()
  const { isLoggedIn } = useUser()

  const vehicles = useState<GarageVehicle[]>('garage-vehicles', () => [])
  const loaded = useState('garage-loaded', () => false)
  const loading = ref(false)

  const defaultVehicle = computed(
    () => vehicles.value.find((v) => v.isDefault) ?? vehicles.value[0] ?? null,
  )

  async function load(force = false) {
    if (!isLoggedIn.value) {
      vehicles.value = []
      loaded.value = true
      return
    }
    if (loaded.value && !force) return
    loading.value = true
    try {
      vehicles.value = await apiFetch<GarageVehicle[]>('/garage')
      loaded.value = true
    } catch {
      vehicles.value = []
    } finally {
      loading.value = false
    }
  }

  async function create(body: GarageVehicleInput) {
    const created = await apiFetch<GarageVehicle>('/garage', { method: 'POST', body })
    vehicles.value = [
      created,
      ...vehicles.value.map((v) => ({
        ...v,
        isDefault: created.isDefault ? false : v.isDefault,
      })),
    ]
    return created
  }

  async function update(id: string, body: Partial<GarageVehicleInput>) {
    const updated = await apiFetch<GarageVehicle>(`/garage/${id}`, { method: 'PATCH', body })
    vehicles.value = vehicles.value.map((v) => {
      if (v.id === updated.id) return updated
      if (updated.isDefault) return { ...v, isDefault: false }
      return v
    })
    return updated
  }

  async function remove(id: string) {
    await apiFetch(`/garage/${id}`, { method: 'DELETE' })
    vehicles.value = vehicles.value.filter((v) => v.id !== id)
    if (!vehicles.value.some((v) => v.isDefault) && vehicles.value[0]) {
      await setDefault(vehicles.value[0].id)
    }
  }

  async function setDefault(id: string) {
    const updated = await apiFetch<GarageVehicle>(`/garage/${id}/default`, { method: 'PATCH' })
    vehicles.value = vehicles.value.map((v) => ({
      ...v,
      isDefault: v.id === updated.id,
    }))
    return updated
  }

  function vehicleTitle(v: GarageVehicle) {
    const name = v.nickname ? `${v.nickname} · ${v.label}` : v.label
    return `${name} (${v.year})`
  }

  return {
    vehicles,
    loaded,
    loading,
    defaultVehicle,
    load,
    create,
    update,
    remove,
    setDefault,
    vehicleTitle,
  }
}
