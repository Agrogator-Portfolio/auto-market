export interface FitmentEntry {
  carBrand: string
  carModel: string
  yearFrom: number
  yearTo: number
}

export interface GarageVehicleLike {
  brand: string
  model: string
  year: number
}

export function parseFitment(attrs: Record<string, unknown>): FitmentEntry[] {
  const raw = attrs.fitment
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
    .map((item) => ({
      carBrand: String(item.carBrand ?? ''),
      carModel: String(item.carModel ?? ''),
      yearFrom: Number(item.yearFrom ?? 1980),
      yearTo: Number(item.yearTo ?? 2030),
    }))
    .filter((f) => f.carBrand && f.carModel)
}

export function vehicleLabel(brand: string, model: string) {
  return `${brand} ${model}`
}

export function productMatchesVehicle(
  fitment: FitmentEntry[],
  vehicle: GarageVehicleLike,
): boolean {
  if (!fitment.length) return false
  const brand = vehicle.brand.trim().toLowerCase()
  const model = vehicle.model.trim().toLowerCase()
  return fitment.some((f) => {
    if (f.carBrand.trim().toLowerCase() !== brand) return false
    if (f.carModel.trim().toLowerCase() !== model) return false
    return vehicle.year >= f.yearFrom && vehicle.year <= f.yearTo
  })
}

export function matchingVehicleLabels(
  fitment: FitmentEntry[],
  vehicles: GarageVehicleLike[],
): string[] {
  const labels: string[] = []
  for (const v of vehicles) {
    if (productMatchesVehicle(fitment, v)) {
      const label = vehicleLabel(v.brand, v.model)
      if (!labels.includes(label)) labels.push(label)
    }
  }
  return labels
}
