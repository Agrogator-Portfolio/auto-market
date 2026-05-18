import { Product } from '@prisma/client'
import { FitmentEntry, parseFitment, productMatchesVehicle, vehicleLabel } from './fitment'

export function mapProduct(
  p: Product,
  opts?: { garageMatchLabel?: string; garageMatchLabels?: string[] },
) {
  const attrs = p.attributes as Record<string, unknown>
  const fitment = parseFitment(attrs)
  const { fitment: _f, ...filterAttrs } = attrs

  return {
    id: p.id,
    categorySlug: p.categoryId,
    name: p.name,
    brand: p.brand,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    image: p.image,
    inStock: p.inStock,
    oem: p.oem,
    sku: p.sku,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    description: p.description,
    attributes: filterAttrs as Record<string, string | number | boolean>,
    fitment,
    highlights: p.highlights as string[],
    garageMatchLabel: opts?.garageMatchLabel,
    garageMatchLabels: opts?.garageMatchLabels,
  }
}

export function buildGarageMatchLabel(
  fitment: FitmentEntry[],
  vehicle: { brand: string; model: string; year: number },
) {
  if (productMatchesVehicle(fitment, vehicle)) {
    return vehicleLabel(vehicle.brand, vehicle.model)
  }
  return undefined
}
