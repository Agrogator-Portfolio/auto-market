import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { OrderStatus, Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import {
  buildProductAttributes,
  categoryAttributeFields,
} from '../catalog/category-attribute-fields'
import { PrismaService } from '../prisma/prisma.service'
import { AdminCreateProductDto } from './dto/create-product.dto'
import { AdminCreateUserDto } from './dto/create-user.dto'
import { AdminUpdateProductDto } from './dto/update-product.dto'
import { AdminUpdateUserDto } from './dto/update-user.dto'

const ADMIN_ORDER_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending_confirmation: OrderStatus.in_progress,
  in_progress: OrderStatus.awaiting_pickup,
}

function mapProduct(p: {
  id: number
  categoryId: string
  name: string
  brand: string
  price: number
  oldPrice: number | null
  image: string
  inStock: boolean
  oem: string
  sku: string
  rating: number
  reviewsCount: number
  description: string
  attributes: Prisma.JsonValue
  highlights: Prisma.JsonValue
}) {
  const attrs = p.attributes as Record<string, unknown>
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
    attributes: attrs,
    highlights: p.highlights as string[],
  }
}

function mapOrderAdmin(order: {
  id: string
  number: string
  createdAt: Date
  status: OrderStatus
  subtotal: number
  deliveryCost: number
  total: number
  deliveryMethod: string
  address: string
  recipientName: string
  phone: string
  comment: string | null
  user: { id: string; email: string; fullName: string }
  items: Array<{
    productId: number
    categorySlug: string
    name: string
    brand: string
    sku: string
    price: number
    quantity: number
  }>
}) {
  return {
    id: order.id,
    number: order.number,
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    subtotal: order.subtotal,
    deliveryCost: order.deliveryCost,
    total: order.total,
    deliveryMethod: order.deliveryMethod,
    address: order.address,
    recipientName: order.recipientName,
    phone: order.phone,
    comment: order.comment ?? undefined,
    user: order.user,
    items: order.items.map((i) => ({
      productId: i.productId,
      categorySlug: i.categorySlug,
      name: i.name,
      brand: i.brand,
      sku: i.sku,
      price: i.price,
      quantity: i.quantity,
    })),
  }
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ——— Users ———

  async listUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        birthDate: true,
        role: true,
        createdAt: true,
      },
    })

    const completedOrders = await this.prisma.order.findMany({
      where: { status: 'completed' },
      select: {
        userId: true,
        total: true,
        items: { select: { quantity: true } },
      },
    })

    const statsByUser = new Map<string, { totalSpent: number; itemsPurchased: number; completedOrders: number }>()
    for (const order of completedOrders) {
      const cur = statsByUser.get(order.userId) ?? {
        totalSpent: 0,
        itemsPurchased: 0,
        completedOrders: 0,
      }
      cur.totalSpent += order.total
      cur.completedOrders += 1
      cur.itemsPurchased += order.items.reduce((s, i) => s + i.quantity, 0)
      statsByUser.set(order.userId, cur)
    }

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      phone: u.phone,
      birthDate: u.birthDate?.toISOString().slice(0, 10) ?? null,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      stats: statsByUser.get(u.id) ?? {
        totalSpent: 0,
        itemsPurchased: 0,
        completedOrders: 0,
      },
    }))
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        birthDate: true,
        role: true,
        createdAt: true,
      },
    })
    if (!user) throw new NotFoundException('Пользователь не найден')

    const orders = await this.prisma.order.findMany({
      where: { userId: id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })

    const completed = orders.filter((o) => o.status === 'completed')
    const stats = {
      totalSpent: completed.reduce((s, o) => s + o.total, 0),
      itemsPurchased: completed.reduce(
        (s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0),
        0,
      ),
      completedOrders: completed.length,
      totalOrders: orders.length,
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      birthDate: user.birthDate?.toISOString().slice(0, 10) ?? null,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      stats,
    }
  }

  async getUserOrders(userId: string, completedOnly = true) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('Пользователь не найден')

    const orders = await this.prisma.order.findMany({
      where: {
        userId,
        ...(completedOnly ? { status: 'completed' } : {}),
      },
      include: {
        items: true,
        user: { select: { id: true, email: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return orders.map(mapOrderAdmin)
  }

  async createUser(dto: AdminCreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new ConflictException('Email уже занят')

    const password = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password,
        fullName: dto.fullName,
        phone: dto.phone,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        birthDate: true,
        role: true,
        createdAt: true,
      },
    })
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      birthDate: user.birthDate?.toISOString().slice(0, 10) ?? null,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    }
  }

  async updateUser(id: string, dto: AdminUpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('Пользователь не найден')

    if (dto.email) {
      const taken = await this.prisma.user.findFirst({
        where: { email: dto.email, id: { not: id } },
      })
      if (taken) throw new ConflictException('Email уже занят')
    }

    const data: Prisma.UserUpdateInput = {
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
    }
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10)
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        birthDate: true,
        role: true,
        createdAt: true,
      },
    })
    return {
      id: updated.id,
      email: updated.email,
      fullName: updated.fullName,
      phone: updated.phone,
      birthDate: updated.birthDate?.toISOString().slice(0, 10) ?? null,
      role: updated.role,
      createdAt: updated.createdAt.toISOString(),
    }
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('Пользователь не найден')
    if (user.role === 'admin') {
      throw new BadRequestException('Нельзя удалить администратора')
    }
    await this.prisma.user.delete({ where: { id } })
    return { ok: true }
  }

  // ——— Products ———

  getCategoryFields() {
    return categoryAttributeFields
  }

  async listProducts() {
    const products = await this.prisma.product.findMany({
      orderBy: { id: 'desc' },
    })
    return products.map(mapProduct)
  }

  async getProduct(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundException('Товар не найден')
    return mapProduct(product)
  }

  private validateAttributeValues(categoryId: string, values: Record<string, string>) {
    const fields = categoryAttributeFields[categoryId]
    if (!fields) throw new BadRequestException('Неизвестная категория')
    for (const field of fields) {
      const val = values[field.key]
      if (!val) {
        throw new BadRequestException(`Укажите поле «${field.label}»`)
      }
      if (field.options && !field.options.some((o) => o.value === val)) {
        throw new BadRequestException(`Недопустимое значение для «${field.label}»`)
      }
    }
  }

  async createProduct(dto: AdminCreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    })
    if (!category) throw new BadRequestException('Категория не найдена')

    this.validateAttributeValues(dto.categoryId, dto.attributeValues)

    const attributes = buildProductAttributes(
      dto.categoryId,
      dto.brand,
      dto.price,
      dto.inStock,
      dto.attributeValues,
    )

    try {
      const product = await this.prisma.product.create({
        data: {
          categoryId: dto.categoryId,
          name: dto.name,
          brand: dto.brand,
          price: dto.price,
          oldPrice: dto.oldPrice,
          inStock: dto.inStock,
          oem: dto.oem,
          sku: dto.sku,
          description: dto.description,
          attributes,
          highlights: dto.highlights,
        },
      })
      return mapProduct(product)
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('OEM или артикул уже заняты')
      }
      throw e
    }
  }

  async updateProduct(id: number, dto: AdminUpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Товар не найден')

    const categoryId = dto.categoryId ?? existing.categoryId
    const brand = dto.brand ?? existing.brand
    const price = dto.price ?? existing.price
    const inStock = dto.inStock ?? existing.inStock

    const currentAttrs = existing.attributes as Record<string, string>
    const attributeValues = dto.attributeValues ?? {
      partType: currentAttrs.partType as string,
      axle: currentAttrs.axle as string,
      voltage: currentAttrs.voltage as string,
    }
    Object.keys(attributeValues).forEach((k) => {
      if (attributeValues[k] === undefined) delete attributeValues[k]
    })

    if (dto.categoryId || dto.attributeValues) {
      this.validateAttributeValues(categoryId, attributeValues as Record<string, string>)
    }

    const attributes = buildProductAttributes(
      categoryId,
      brand,
      price,
      inStock,
      attributeValues as Record<string, string>,
    )

    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          categoryId: dto.categoryId,
          name: dto.name,
          brand: dto.brand,
          price: dto.price,
          oldPrice: dto.oldPrice,
          inStock: dto.inStock,
          oem: dto.oem,
          sku: dto.sku,
          description: dto.description,
          attributes,
          highlights: dto.highlights,
        },
      })
      return mapProduct(product)
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('OEM или артикул уже заняты')
      }
      throw e
    }
  }

  async deleteProduct(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundException('Товар не найден')
    await this.prisma.product.delete({ where: { id } })
    return { ok: true }
  }

  // ——— Orders ———

  async listOrders(status?: string) {
    const orders = await this.prisma.order.findMany({
      where: status && status !== 'all' ? { status: status as OrderStatus } : undefined,
      include: {
        items: true,
        user: { select: { id: true, email: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return orders.map(mapOrderAdmin)
  }

  async getOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: { select: { id: true, email: true, fullName: true } } },
    })
    if (!order) throw new NotFoundException('Заказ не найден')
    return mapOrderAdmin(order)
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: { select: { id: true, email: true, fullName: true } } },
    })
    if (!order) throw new NotFoundException('Заказ не найден')

    const allowed = ADMIN_ORDER_TRANSITIONS[order.status]
    if (!allowed || allowed !== status) {
      throw new BadRequestException(
        'Недопустимый переход статуса. Доступно: ожидание → в работе → ожидает получения',
      )
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true, user: { select: { id: true, email: true, fullName: true } } },
    })
    return mapOrderAdmin(updated)
  }
}
