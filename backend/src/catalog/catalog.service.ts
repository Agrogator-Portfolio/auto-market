import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { parseFitment, productMatchesVehicle } from '../common/fitment'
import { buildGarageMatchLabel, mapProduct } from '../common/product.mapper'
import { GarageService } from '../garage/garage.service'
import { PrismaService } from '../prisma/prisma.service'
import { ProductsQueryDto } from './dto/products-query.dto'

const FILTER_DEFS: Record<string, { key: string; type: string }[]> = {
  engine: [
    { key: 'partType', type: 'multiselect' },
    { key: 'brand', type: 'multiselect' },
    { key: 'inStock', type: 'checkbox' },
    { key: 'price', type: 'range' },
  ],
  brakes: [
    { key: 'partType', type: 'multiselect' },
    { key: 'axle', type: 'select' },
    { key: 'brand', type: 'multiselect' },
    { key: 'inStock', type: 'checkbox' },
    { key: 'price', type: 'range' },
  ],
  suspension: [
    { key: 'partType', type: 'multiselect' },
    { key: 'axle', type: 'select' },
    { key: 'brand', type: 'multiselect' },
    { key: 'inStock', type: 'checkbox' },
    { key: 'price', type: 'range' },
  ],
  electrics: [
    { key: 'partType', type: 'multiselect' },
    { key: 'voltage', type: 'select' },
    { key: 'brand', type: 'multiselect' },
    { key: 'inStock', type: 'checkbox' },
    { key: 'price', type: 'range' },
  ],
}

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly garage: GarageService,
  ) {}

  async getCategories() {
    return this.prisma.category.findMany({ orderBy: { id: 'asc' } })
  }

  async getProducts(query: ProductsQueryDto, userId?: string) {
    const where: Prisma.ProductWhereInput = { categoryId: query.category }

    if (query.search?.trim()) {
      const q = query.search.trim()
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { oem: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (query.inStock === 'true') where.inStock = true

    if (query.priceMin != null || query.priceMax != null) {
      where.price = {}
      if (query.priceMin != null) where.price.gte = query.priceMin
      if (query.priceMax != null) where.price.lte = query.priceMax
    }

    const brands = query.brand?.split(',').filter(Boolean) ?? []
    if (brands.length) where.brand = { in: brands }

    let products = await this.prisma.product.findMany({ where })

    const partTypes = query.partType?.split(',').filter(Boolean) ?? []
    if (partTypes.length) {
      products = products.filter((p) => {
        const attrs = p.attributes as Record<string, unknown>
        return partTypes.includes(String(attrs.partType ?? ''))
      })
    }

    if (query.axle) {
      products = products.filter((p) => {
        const attrs = p.attributes as Record<string, unknown>
        return String(attrs.axle ?? '') === query.axle
      })
    }

    if (query.voltage) {
      products = products.filter((p) => {
        const attrs = p.attributes as Record<string, unknown>
        return String(attrs.voltage ?? '') === query.voltage
      })
    }

    let garageVehicle: { brand: string; model: string; year: number } | null = null
    if (query.garageVehicleId) {
      if (!userId) throw new UnauthorizedException('Войдите в аккаунт для подбора по гаражу')
      const v = await this.garage.getForUser(userId, query.garageVehicleId)
      garageVehicle = { brand: v.brand, model: v.model, year: v.year }
      products = products.filter((p) => {
        const fitment = parseFitment(p.attributes as Record<string, unknown>)
        return productMatchesVehicle(fitment, garageVehicle!)
      })
    }

    products = this.sortProducts(products, query.sort ?? 'popular')

    const total = products.length
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 8
    const start = (page - 1) * pageSize
    const items = products.slice(start, start + pageSize).map((p) => {
      const fitment = parseFitment(p.attributes as Record<string, unknown>)
      const garageMatchLabel = garageVehicle
        ? buildGarageMatchLabel(fitment, garageVehicle)
        : undefined
      return mapProduct(p, { garageMatchLabel })
    })

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    }
  }

  private sortProducts<T extends { price: number; name: string; rating: number; reviewsCount: number }>(
    list: T[],
    sort: string,
  ): T[] {
    const copy = [...list]
    switch (sort) {
      case 'price_asc':
        return copy.sort((a, b) => a.price - b.price)
      case 'price_desc':
        return copy.sort((a, b) => b.price - a.price)
      case 'name_asc':
        return copy.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
      case 'rating_desc':
        return copy.sort((a, b) => b.rating - a.rating)
      default:
        return copy.sort((a, b) => b.reviewsCount - a.reviewsCount)
    }
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundException('Товар не найден')
    return mapProduct(product)
  }

  async getRelated(categoryId: string, excludeId: number, limit = 4) {
    const products = await this.prisma.product.findMany({
      where: { categoryId, id: { not: excludeId } },
      orderBy: { reviewsCount: 'desc' },
      take: limit,
    })
    return products.map((p) => mapProduct(p))
  }

  async search(q: string, limit = 6) {
    if (!q.trim()) return []
    const query = q.trim()
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { oem: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    })
    return products.map((p) => mapProduct(p))
  }

  getFilterKeys(category: string) {
    return FILTER_DEFS[category] ?? []
  }

  async getPopular(limit = 8) {
    const products = await this.prisma.product.findMany({
      orderBy: { reviewsCount: 'desc' },
      take: limit,
    })
    return products.map((p) => mapProduct(p))
  }
}
