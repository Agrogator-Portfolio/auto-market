/** Совпадение с сидом `fitmentProfiles` в backend/prisma/seed.ts */
export const seedFitmentProfiles = [
  { brand: 'Toyota', model: 'Camry', yearFrom: 2015, yearTo: 2024 },
  { brand: 'Toyota', model: 'RAV4', yearFrom: 2016, yearTo: 2024 },
  { brand: 'Volkswagen', model: 'Polo', yearFrom: 2014, yearTo: 2022 },
  { brand: 'Hyundai', model: 'Solaris', yearFrom: 2017, yearTo: 2024 },
  { brand: 'Kia', model: 'Rio', yearFrom: 2016, yearTo: 2023 },
  { brand: 'BMW', model: '3 Series', yearFrom: 2012, yearTo: 2020 },
  { brand: 'Lada', model: 'Vesta', yearFrom: 2016, yearTo: 2024 },
  { brand: 'Renault', model: 'Logan', yearFrom: 2014, yearTo: 2023 },
] as const

export const demoGarageHint =
  'Демо-аккаунт: Toyota Camry 2020 и Volkswagen Polo 2018 — в каталоге должны быть товары.'
