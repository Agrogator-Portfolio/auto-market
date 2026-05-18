import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { vehicleLabel } from '../common/fitment'
import { CreateGarageVehicleDto } from './dto/create-garage-vehicle.dto'
import { UpdateGarageVehicleDto } from './dto/update-garage-vehicle.dto'

function mapVehicle(v: {
  id: string
  brand: string
  model: string
  year: number
  vin: string | null
  nickname: string | null
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: v.id,
    brand: v.brand,
    model: v.model,
    year: v.year,
    vin: v.vin ?? undefined,
    nickname: v.nickname ?? undefined,
    isDefault: v.isDefault,
    label: vehicleLabel(v.brand, v.model),
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
  }
}

@Injectable()
export class GarageService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const vehicles = await this.prisma.garageVehicle.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })
    return vehicles.map(mapVehicle)
  }

  async create(userId: string, dto: CreateGarageVehicleDto) {
    const count = await this.prisma.garageVehicle.count({ where: { userId } })
    const isDefault = dto.isDefault ?? count === 0

    if (isDefault) {
      await this.prisma.garageVehicle.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    const vehicle = await this.prisma.garageVehicle.create({
      data: {
        userId,
        brand: dto.brand.trim(),
        model: dto.model.trim(),
        year: dto.year,
        vin: dto.vin?.trim() || null,
        nickname: dto.nickname?.trim() || null,
        isDefault,
      },
    })
    return mapVehicle(vehicle)
  }

  async update(userId: string, id: string, dto: UpdateGarageVehicleDto) {
    const existing = await this.prisma.garageVehicle.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Автомобиль не найден')
    if (existing.userId !== userId) throw new ForbiddenException()

    if (dto.isDefault) {
      await this.prisma.garageVehicle.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    const vehicle = await this.prisma.garageVehicle.update({
      where: { id },
      data: {
        ...(dto.brand != null ? { brand: dto.brand.trim() } : {}),
        ...(dto.model != null ? { model: dto.model.trim() } : {}),
        ...(dto.year != null ? { year: dto.year } : {}),
        ...(dto.vin !== undefined ? { vin: dto.vin?.trim() || null } : {}),
        ...(dto.nickname !== undefined ? { nickname: dto.nickname?.trim() || null } : {}),
        ...(dto.isDefault != null ? { isDefault: dto.isDefault } : {}),
      },
    })
    return mapVehicle(vehicle)
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.garageVehicle.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Автомобиль не найден')
    if (existing.userId !== userId) throw new ForbiddenException()

    await this.prisma.garageVehicle.delete({ where: { id } })

    if (existing.isDefault) {
      const next = await this.prisma.garageVehicle.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      if (next) {
        await this.prisma.garageVehicle.update({
          where: { id: next.id },
          data: { isDefault: true },
        })
      }
    }

    return { ok: true }
  }

  async setDefault(userId: string, id: string) {
    const existing = await this.prisma.garageVehicle.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Автомобиль не найден')
    if (existing.userId !== userId) throw new ForbiddenException()

    await this.prisma.garageVehicle.updateMany({
      where: { userId },
      data: { isDefault: false },
    })

    const vehicle = await this.prisma.garageVehicle.update({
      where: { id },
      data: { isDefault: true },
    })
    return mapVehicle(vehicle)
  }

  async getForUser(userId: string, vehicleId: string) {
    const vehicle = await this.prisma.garageVehicle.findUnique({ where: { id: vehicleId } })
    if (!vehicle || vehicle.userId !== userId) {
      throw new NotFoundException('Автомобиль не найден')
    }
    return vehicle
  }
}
