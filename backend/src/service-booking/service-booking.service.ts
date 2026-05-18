import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, ServiceAppointmentStatus } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { CreateAutoServiceDto } from './dto/create-auto-service.dto'
import { ScheduleAppointmentDto } from './dto/schedule-appointment.dto'
import { UpdateAutoServiceDto } from './dto/update-auto-service.dto'
import { buildGarageMatchLabel, mapProduct } from '../common/product.mapper'
import { parseFitment, productMatchesVehicle } from '../common/fitment'
import {
  appointmentInclude,
  mapAppointment,
  mapAutoService,
} from './service-booking.mapper'

@Injectable()
export class ServiceBookingService {
  constructor(private readonly prisma: PrismaService) {}

  async listCategories() {
    const rows = await this.prisma.serviceCategory.findMany({ orderBy: { name: 'asc' } })
    return rows.map((c) => ({ id: c.id, name: c.name, description: c.description }))
  }

  async listCenters(city?: string, categoryIds?: string[]) {
    const uniqueIds = [...new Set((categoryIds ?? []).filter(Boolean))]
    const where: Prisma.AutoServiceWhereInput = {
      ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
      ...(uniqueIds.length
        ? {
            AND: uniqueIds.map((categoryId) => ({
              categories: { some: { categoryId } },
            })),
          }
        : {}),
    }

    const centers = await this.prisma.autoService.findMany({
      where,
      include: { categories: { include: { category: true } } },
      orderBy: [{ rating: 'desc' }, { name: 'asc' }],
    })
    return centers.map(mapAutoService)
  }

  async listRandomCenters(limit: number) {
    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "AutoService" ORDER BY RANDOM() LIMIT ${limit}
    `
    const ids = rows.map((r) => r.id)
    if (!ids.length) return []

    const centers = await this.prisma.autoService.findMany({
      where: { id: { in: ids } },
      include: { categories: { include: { category: true } } },
    })
    const byId = new Map(centers.map((c) => [c.id, c]))
    return ids.map((id) => byId.get(id)).filter(Boolean).map((c) => mapAutoService(c!))
  }

  async getCenter(id: string) {
    const center = await this.prisma.autoService.findUnique({
      where: { id },
      include: { categories: { include: { category: true } } },
    })
    if (!center) throw new NotFoundException('Автосервис не найден')
    return mapAutoService(center)
  }

  async listMyAppointments(userId: string, status?: ServiceAppointmentStatus) {
    const rows = await this.prisma.serviceAppointment.findMany({
      where: { userId, ...(status ? { status } : {}) },
      include: appointmentInclude,
      orderBy: { createdAt: 'desc' },
    })
    return rows.map((r) => mapAppointment(r))
  }

  async getMyAppointment(userId: string, id: string) {
    const row = await this.prisma.serviceAppointment.findUnique({
      where: { id },
      include: appointmentInclude,
    })
    if (!row) throw new NotFoundException('Обращение не найдено')
    if (row.userId !== userId) throw new ForbiddenException()
    return mapAppointment(row)
  }

  private async resolveCategoryIds(categoryIds: string[], maxCount?: number) {
    const unique = [...new Set(categoryIds.filter(Boolean))]
    if (unique.length < 1) {
      throw new BadRequestException('Укажите виды работ')
    }
    if (maxCount !== undefined && unique.length > maxCount) {
      throw new BadRequestException(`Можно выбрать не более ${maxCount} видов работ`)
    }
    const found = await this.prisma.serviceCategory.findMany({ where: { id: { in: unique } } })
    if (found.length !== unique.length) {
      throw new BadRequestException('Неизвестный вид работ')
    }
    return unique
  }

  private async assertCenterSupportsCategories(autoServiceId: string, categoryIds: string[]) {
    const center = await this.prisma.autoService.findUnique({
      where: { id: autoServiceId },
      include: { categories: true },
    })
    if (!center) throw new BadRequestException('Автосервис не найден')
    const supported = new Set(center.categories.map((c) => c.categoryId))
    const missing = categoryIds.filter((id) => !supported.has(id))
    if (missing.length) {
      throw new BadRequestException('Автосервис не выполняет выбранные виды работ')
    }
    return center
  }

  async createAppointment(userId: string, dto: CreateAppointmentDto) {
    const categoryIds = await this.resolveCategoryIds(dto.categoryIds, 2)

    const vehicle = await this.prisma.garageVehicle.findUnique({
      where: { id: dto.garageVehicleId },
    })
    if (!vehicle || vehicle.userId !== userId) {
      throw new BadRequestException('Выберите автомобиль из вашего гаража')
    }

    await this.assertCenterSupportsCategories(dto.autoServiceId, categoryIds)

    const number = `STO-${Math.floor(10000 + Math.random() * 89999)}`
    const row = await this.prisma.serviceAppointment.create({
      data: {
        number,
        userId,
        garageVehicleId: dto.garageVehicleId,
        autoServiceId: dto.autoServiceId,
        problemDescription: dto.problemDescription.trim(),
        requestedCategories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
      include: appointmentInclude,
    })
    return mapAppointment(row)
  }

  async listAllAppointments(status?: ServiceAppointmentStatus) {
    const rows = await this.prisma.serviceAppointment.findMany({
      where: status ? { status } : undefined,
      include: appointmentInclude,
      orderBy: { createdAt: 'desc' },
    })
    return rows.map((r) => mapAppointment(r))
  }

  async getAppointmentAdmin(id: string) {
    const row = await this.prisma.serviceAppointment.findUnique({
      where: { id },
      include: appointmentInclude,
    })
    if (!row) throw new NotFoundException('Обращение не найдено')
    return mapAppointment(row)
  }

  async scheduleAppointment(id: string, dto: ScheduleAppointmentDto) {
    const existing = await this.prisma.serviceAppointment.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Обращение не найдено')
    if (existing.status === 'rejected') {
      throw new BadRequestException('Заявка отклонена')
    }

    const scheduledAt = new Date(dto.scheduledAt)
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('Некорректная дата и время')
    }

    const row = await this.prisma.serviceAppointment.update({
      where: { id },
      data: { status: 'scheduled', scheduledAt, rejectReason: null },
      include: appointmentInclude,
    })
    return mapAppointment(row)
  }

  async rejectAppointment(id: string, rejectReason?: string) {
    const existing = await this.prisma.serviceAppointment.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Обращение не найдено')
    if (existing.status === 'rejected') {
      throw new BadRequestException('Заявка уже отклонена')
    }

    const row = await this.prisma.serviceAppointment.update({
      where: { id },
      data: {
        status: 'rejected',
        scheduledAt: null,
        rejectReason: rejectReason?.trim() || 'Заявка отклонена администратором',
      },
      include: appointmentInclude,
    })
    return mapAppointment(row)
  }

  async getRecommendableProducts(appointmentId: string, search?: string) {
    const appointment = await this.prisma.serviceAppointment.findUnique({
      where: { id: appointmentId },
      include: { garageVehicle: true },
    })
    if (!appointment) throw new NotFoundException('Обращение не найдено')

    const vehicle = {
      brand: appointment.garageVehicle.brand,
      model: appointment.garageVehicle.model,
      year: appointment.garageVehicle.year,
    }

    let products = await this.prisma.product.findMany({ orderBy: { reviewsCount: 'desc' } })
    products = products.filter((p) => {
      const fitment = parseFitment(p.attributes as Record<string, unknown>)
      return productMatchesVehicle(fitment, vehicle)
    })

    const q = search?.trim().toLowerCase()
    if (q) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q)
          || p.brand.toLowerCase().includes(q)
          || p.oem.toLowerCase().includes(q)
          || p.sku.toLowerCase().includes(q),
      )
    }

    return products.slice(0, 80).map((p) => {
      const fitment = parseFitment(p.attributes as Record<string, unknown>)
      return mapProduct(p, { garageMatchLabel: buildGarageMatchLabel(fitment, vehicle) })
    })
  }

  async setRecommendedProducts(appointmentId: string, productIds: number[]) {
    const appointment = await this.prisma.serviceAppointment.findUnique({
      where: { id: appointmentId },
      include: { garageVehicle: true },
    })
    if (!appointment) throw new NotFoundException('Обращение не найдено')

    const uniqueIds = [...new Set(productIds)]
    const vehicle = {
      brand: appointment.garageVehicle.brand,
      model: appointment.garageVehicle.model,
      year: appointment.garageVehicle.year,
    }

    if (uniqueIds.length) {
      const products = await this.prisma.product.findMany({ where: { id: { in: uniqueIds } } })
      if (products.length !== uniqueIds.length) {
        throw new BadRequestException('Некоторые товары не найдены')
      }
      const invalid = products.filter((p) => {
        const fitment = parseFitment(p.attributes as Record<string, unknown>)
        return !productMatchesVehicle(fitment, vehicle)
      })
      if (invalid.length) {
        throw new BadRequestException('Часть товаров не подходит для автомобиля клиента')
      }
    }

    await this.prisma.serviceAppointmentRecommendation.deleteMany({
      where: { appointmentId },
    })
    if (uniqueIds.length) {
      await this.prisma.serviceAppointmentRecommendation.createMany({
        data: uniqueIds.map((productId) => ({ appointmentId, productId })),
      })
    }

    const row = await this.prisma.serviceAppointment.findUnique({
      where: { id: appointmentId },
      include: appointmentInclude,
    })
    return mapAppointment(row!)
  }

  // ——— Admin: автосервисы ———

  async listCentersAdmin() {
    return this.listCenters()
  }

  async createCenter(dto: CreateAutoServiceDto) {
    const categoryIds = await this.resolveCategoryIds(dto.categoryIds)
    const id = `svc-${Date.now().toString(36)}`
    const row = await this.prisma.autoService.create({
      data: {
        id,
        name: dto.name.trim(),
        city: dto.city.trim(),
        address: dto.address.trim(),
        description: dto.description.trim(),
        rating: dto.rating,
        workSchedule: dto.workSchedule.trim(),
        phone: dto.phone?.trim() || null,
        categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
      },
      include: { categories: { include: { category: true } } },
    })
    return mapAutoService(row)
  }

  async updateCenter(id: string, dto: UpdateAutoServiceDto) {
    const existing = await this.prisma.autoService.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Автосервис не найден')

    if (dto.categoryIds) {
      await this.resolveCategoryIds(dto.categoryIds)
      await this.prisma.autoServiceOnCategory.deleteMany({ where: { autoServiceId: id } })
      await this.prisma.autoServiceOnCategory.createMany({
        data: dto.categoryIds.map((categoryId) => ({ autoServiceId: id, categoryId })),
      })
    }

    const row = await this.prisma.autoService.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.city !== undefined ? { city: dto.city.trim() } : {}),
        ...(dto.address !== undefined ? { address: dto.address.trim() } : {}),
        ...(dto.description !== undefined ? { description: dto.description.trim() } : {}),
        ...(dto.rating !== undefined ? { rating: dto.rating } : {}),
        ...(dto.workSchedule !== undefined ? { workSchedule: dto.workSchedule.trim() } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone?.trim() || null } : {}),
      },
      include: { categories: { include: { category: true } } },
    })
    return mapAutoService(row)
  }

  async deleteCenter(id: string) {
    const appointments = await this.prisma.serviceAppointment.count({ where: { autoServiceId: id } })
    if (appointments > 0) {
      throw new BadRequestException('Нельзя удалить: есть связанные обращения')
    }
    await this.prisma.autoService.delete({ where: { id } })
    return { ok: true }
  }
}
