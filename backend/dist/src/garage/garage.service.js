"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fitment_1 = require("../common/fitment");
function mapVehicle(v) {
    return {
        id: v.id,
        brand: v.brand,
        model: v.model,
        year: v.year,
        vin: v.vin ?? undefined,
        nickname: v.nickname ?? undefined,
        isDefault: v.isDefault,
        label: (0, fitment_1.vehicleLabel)(v.brand, v.model),
        createdAt: v.createdAt.toISOString(),
        updatedAt: v.updatedAt.toISOString(),
    };
}
let GarageService = class GarageService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId) {
        const vehicles = await this.prisma.garageVehicle.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
        return vehicles.map(mapVehicle);
    }
    async create(userId, dto) {
        const count = await this.prisma.garageVehicle.count({ where: { userId } });
        const isDefault = dto.isDefault ?? count === 0;
        if (isDefault) {
            await this.prisma.garageVehicle.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
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
        });
        return mapVehicle(vehicle);
    }
    async update(userId, id, dto) {
        const existing = await this.prisma.garageVehicle.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Автомобиль не найден');
        if (existing.userId !== userId)
            throw new common_1.ForbiddenException();
        if (dto.isDefault) {
            await this.prisma.garageVehicle.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
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
        });
        return mapVehicle(vehicle);
    }
    async remove(userId, id) {
        const existing = await this.prisma.garageVehicle.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Автомобиль не найден');
        if (existing.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.garageVehicle.delete({ where: { id } });
        if (existing.isDefault) {
            const next = await this.prisma.garageVehicle.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });
            if (next) {
                await this.prisma.garageVehicle.update({
                    where: { id: next.id },
                    data: { isDefault: true },
                });
            }
        }
        return { ok: true };
    }
    async setDefault(userId, id) {
        const existing = await this.prisma.garageVehicle.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Автомобиль не найден');
        if (existing.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.garageVehicle.updateMany({
            where: { userId },
            data: { isDefault: false },
        });
        const vehicle = await this.prisma.garageVehicle.update({
            where: { id },
            data: { isDefault: true },
        });
        return mapVehicle(vehicle);
    }
    async getForUser(userId, vehicleId) {
        const vehicle = await this.prisma.garageVehicle.findUnique({ where: { id: vehicleId } });
        if (!vehicle || vehicle.userId !== userId) {
            throw new common_1.NotFoundException('Автомобиль не найден');
        }
        return vehicle;
    }
};
exports.GarageService = GarageService;
exports.GarageService = GarageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GarageService);
//# sourceMappingURL=garage.service.js.map