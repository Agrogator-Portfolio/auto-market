import type { CatalogFilterDef, CatalogProduct, CategorySlug, SortOption } from '~/data/catalog'
import { PAGE_SIZE, getCategoryBySlug } from '~/data/catalog'
import type { CatalogListResponse } from '~/types/api'

export type FilterValues = Record<string, string | string[] | boolean | [number, number]>

function defaultFilterValues(filters: CatalogFilterDef[]): FilterValues {
  const values: FilterValues = {}
  for (const f of filters) {
    if (f.type === 'multiselect') values[f.key] = []
    else if (f.type === 'range') values[f.key] = [f.min ?? 0, f.max ?? 999999]
    else if (f.type === 'checkbox') values[f.key] = false
    else values[f.key] = ''
  }
  return values
}

function buildQuery(
  slug: string,
  search: string,
  sort: SortOption,
  page: number,
  filterValues: FilterValues,
  garage?: { enabled: boolean; vehicleId: string },
): Record<string, string | number | undefined> {
  const params: Record<string, string | number | undefined> = {
    category: slug,
    search: search.trim() || undefined,
    sort,
    page,
    pageSize: PAGE_SIZE,
  }

  const partType = filterValues.partType
  if (Array.isArray(partType) && partType.length) {
    params.partType = partType.join(',')
  }

  const brand = filterValues.brand
  if (Array.isArray(brand) && brand.length) {
    params.brand = brand.join(',')
  }

  if (filterValues.inStock === true) params.inStock = 'true'

  const price = filterValues.price
  if (Array.isArray(price) && price.length === 2) {
    params.priceMin = price[0] as number
    params.priceMax = price[1] as number
  }

  const axle = filterValues.axle
  if (typeof axle === 'string' && axle) params.axle = axle

  const voltage = filterValues.voltage
  if (typeof voltage === 'string' && voltage) params.voltage = voltage

  if (garage?.enabled && garage.vehicleId) {
    params.garageVehicleId = garage.vehicleId
  }

  return params
}

export function useCatalogList(
  categorySlug: Ref<string> | string,
  garageFilter?: Ref<{ enabled: boolean; vehicleId: string }>,
) {
  const slug = computed(() => (typeof categorySlug === 'string' ? categorySlug : categorySlug.value))
  const { apiFetch } = useApi()

  const category = computed(() => getCategoryBySlug(slug.value))

  const search = ref('')
  const sort = ref<SortOption>('popular')
  const page = ref(1)
  const filterValues = ref<FilterValues>({})

  watch(
    category,
    (cat) => {
      if (cat) filterValues.value = defaultFilterValues(cat.filters)
      page.value = 1
    },
    { immediate: true },
  )

  const queryKey = computed(
    () =>
      `catalog-${slug.value}-${search.value}-${sort.value}-${page.value}-${JSON.stringify(filterValues.value)}-${garageFilter?.value.enabled}-${garageFilter?.value.vehicleId}`,
  )

  const queryParams = computed(() =>
    buildQuery(
      slug.value,
      search.value,
      sort.value,
      page.value,
      filterValues.value,
      garageFilter?.value,
    ),
  )

  const needsAuth = computed(
    () => Boolean(garageFilter?.value.enabled && garageFilter.value.vehicleId),
  )

  const { data, pending, refresh } = useAsyncData(
    queryKey,
    () =>
      apiFetch<CatalogListResponse>('/catalog/products', {
        query: queryParams.value,
        auth: needsAuth.value,
      }),
    { watch: [queryParams] },
  )

  const paginatedList = computed(() => data.value?.items ?? [])
  const totalCount = computed(() => data.value?.total ?? 0)
  const totalPages = computed(() => data.value?.totalPages ?? 1)
  const filteredList = computed(() => data.value?.items ?? [])

  watch([search, sort, filterValues, () => garageFilter?.value], () => {
    page.value = 1
  }, { deep: true })

  function resetFilters() {
    const cat = category.value
    if (cat) filterValues.value = defaultFilterValues(cat.filters)
    search.value = ''
    page.value = 1
  }

  function setPage(p: number) {
    page.value = Math.min(Math.max(1, p), totalPages.value)
  }

  return {
    category,
    search,
    sort,
    page,
    filterValues,
    filteredList,
    paginatedList,
    totalPages,
    totalCount,
    pending,
    refresh,
    resetFilters,
    setPage,
    pageSize: PAGE_SIZE,
  }
}

export async function fetchGlobalCatalogSearch(query: string, limit = 6): Promise<CatalogProduct[]> {
  const { apiFetch } = useApi()
  if (!query.trim()) return []
  return apiFetch<CatalogProduct[]>('/catalog/search', {
    query: { q: query, limit },
    auth: false,
  })
}
