export const carBrands = [
  'Toyota',
  'Volkswagen',
  'Hyundai',
  'Kia',
  'BMW',
  'Mercedes-Benz',
  'Lada',
  'Renault',
] as const

export const carModelsByBrand: Record<string, string[]> = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser'],
  Volkswagen: ['Polo', 'Golf', 'Tiguan', 'Passat'],
  Hyundai: ['Solaris', 'Creta', 'Tucson', 'Santa Fe'],
  Kia: ['Rio', 'Sportage', 'Cerato', 'Sorento'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'Sprinter'],
  Lada: ['Vesta', 'Granta', 'Largus', 'Niva'],
  Renault: ['Logan', 'Duster', 'Sandero', 'Arkana'],
}

export function modelsForBrand(brand: string) {
  return carModelsByBrand[brand] ?? []
}

export const yearOptions = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => 2026 - i)
