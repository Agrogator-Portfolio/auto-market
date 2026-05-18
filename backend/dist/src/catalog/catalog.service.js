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
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const fitment_1 = require("../common/fitment");
const product_mapper_1 = require("../common/product.mapper");
const garage_service_1 = require("../garage/garage.service");
const prisma_service_1 = require("../prisma/prisma.service");
const FILTER_DEFS = {
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
};
let CatalogService = class CatalogService {
    constructor(prisma, garage) {
        this.prisma = prisma;
        this.garage = garage;
    }
    async getCategories() {
        return this.prisma.category.findMany({ orderBy: { id: 'asc' } });
    }
    async getProducts(query, userId) {
        const where = { categoryId: query.category };
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { brand: { contains: q, mode: 'insensitive' } },
                { oem: { contains: q, mode: 'insensitive' } },
                { sku: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (query.inStock === 'true')
            where.inStock = true;
        if (query.priceMin != null || query.priceMax != null) {
            where.price = {};
            if (query.priceMin != null)
                where.price.gte = query.priceMin;
            if (query.priceMax != null)
                where.price.lte = query.priceMax;
        }
        const brands = query.brand?.split(',').filter(Boolean) ?? [];
        if (brands.length)
            where.brand = { in: brands };
        let products = await this.prisma.product.findMany({ where });
        const partTypes = query.partType?.split(',').filter(Boolean) ?? [];
        if (partTypes.length) {
            products = products.filter((p) => {
                const attrs = p.attributes;
                return partTypes.includes(String(attrs.partType ?? ''));
            });
        }
        if (query.axle) {
            products = products.filter((p) => {
                const attrs = p.attributes;
                return String(attrs.axle ?? '') === query.axle;
            });
        }
        if (query.voltage) {
            products = products.filter((p) => {
                const attrs = p.attributes;
                return String(attrs.voltage ?? '') === query.voltage;
            });
        }
        let garageVehicle = null;
        if (query.garageVehicleId) {
            if (!userId)
                throw new common_1.UnauthorizedException('Войдите в аккаунт для подбора по гаражу');
            const v = await this.garage.getForUser(userId, query.garageVehicleId);
            garageVehicle = { brand: v.brand, model: v.model, year: v.year };
            products = products.filter((p) => {
                const fitment = (0, fitment_1.parseFitment)(p.attributes);
                return (0, fitment_1.productMatchesVehicle)(fitment, garageVehicle);
            });
        }
        products = this.sortProducts(products, query.sort ?? 'popular');
        const total = products.length;
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 8;
        const start = (page - 1) * pageSize;
        const items = products.slice(start, start + pageSize).map((p) => {
            const fitment = (0, fitment_1.parseFitment)(p.attributes);
            const garageMatchLabel = garageVehicle
                ? (0, product_mapper_1.buildGarageMatchLabel)(fitment, garageVehicle)
                : undefined;
            return (0, product_mapper_1.mapProduct)(p, { garageMatchLabel });
        });
        return {
            items,
            total,
            page,
            pageSize,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        };
    }
    sortProducts(list, sort) {
        const copy = [...list];
        switch (sort) {
            case 'price_asc':
                return copy.sort((a, b) => a.price - b.price);
            case 'price_desc':
                return copy.sort((a, b) => b.price - a.price);
            case 'name_asc':
                return copy.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
            case 'rating_desc':
                return copy.sort((a, b) => b.rating - a.rating);
            default:
                return copy.sort((a, b) => b.reviewsCount - a.reviewsCount);
        }
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Товар не найден');
        return (0, product_mapper_1.mapProduct)(product);
    }
    async getRelated(categoryId, excludeId, limit = 4) {
        const products = await this.prisma.product.findMany({
            where: { categoryId, id: { not: excludeId } },
            orderBy: { reviewsCount: 'desc' },
            take: limit,
        });
        return products.map((p) => (0, product_mapper_1.mapProduct)(p));
    }
    async search(q, limit = 6) {
        if (!q.trim())
            return [];
        const query = q.trim();
        const products = await this.prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { brand: { contains: query, mode: 'insensitive' } },
                    { oem: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: limit,
        });
        return products.map((p) => (0, product_mapper_1.mapProduct)(p));
    }
    getFilterKeys(category) {
        return FILTER_DEFS[category] ?? [];
    }
    async getPopular(limit = 8) {
        const products = await this.prisma.product.findMany({
            orderBy: { reviewsCount: 'desc' },
            take: limit,
        });
        return products.map((p) => (0, product_mapper_1.mapProduct)(p));
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        garage_service_1.GarageService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map