"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const category_attribute_fields_1 = require("../catalog/category-attribute-fields");
const prisma_service_1 = require("../prisma/prisma.service");
const ADMIN_ORDER_TRANSITIONS = {
    pending_confirmation: client_1.OrderStatus.in_progress,
    in_progress: client_1.OrderStatus.awaiting_pickup,
};
function mapProduct(p) {
    const attrs = p.attributes;
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
        highlights: p.highlights,
    };
}
function mapOrderAdmin(order) {
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
    };
}
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
        });
        const completedOrders = await this.prisma.order.findMany({
            where: { status: 'completed' },
            select: {
                userId: true,
                total: true,
                items: { select: { quantity: true } },
            },
        });
        const statsByUser = new Map();
        for (const order of completedOrders) {
            const cur = statsByUser.get(order.userId) ?? {
                totalSpent: 0,
                itemsPurchased: 0,
                completedOrders: 0,
            };
            cur.totalSpent += order.total;
            cur.completedOrders += 1;
            cur.itemsPurchased += order.items.reduce((s, i) => s + i.quantity, 0);
            statsByUser.set(order.userId, cur);
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
        }));
    }
    async getUser(id) {
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
        });
        if (!user)
            throw new common_1.NotFoundException('Пользователь не найден');
        const orders = await this.prisma.order.findMany({
            where: { userId: id },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
        const completed = orders.filter((o) => o.status === 'completed');
        const stats = {
            totalSpent: completed.reduce((s, o) => s + o.total, 0),
            itemsPurchased: completed.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0),
            completedOrders: completed.length,
            totalOrders: orders.length,
        };
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            birthDate: user.birthDate?.toISOString().slice(0, 10) ?? null,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            stats,
        };
    }
    async getUserOrders(userId, completedOnly = true) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Пользователь не найден');
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
        });
        return orders.map(mapOrderAdmin);
    }
    async createUser(dto) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists)
            throw new common_1.ConflictException('Email уже занят');
        const password = await bcrypt.hash(dto.password, 10);
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
        });
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            birthDate: user.birthDate?.toISOString().slice(0, 10) ?? null,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
        };
    }
    async updateUser(id, dto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Пользователь не найден');
        if (dto.email) {
            const taken = await this.prisma.user.findFirst({
                where: { email: dto.email, id: { not: id } },
            });
            if (taken)
                throw new common_1.ConflictException('Email уже занят');
        }
        const data = {
            fullName: dto.fullName,
            email: dto.email,
            phone: dto.phone,
            birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        };
        if (dto.password) {
            data.password = await bcrypt.hash(dto.password, 10);
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
        });
        return {
            id: updated.id,
            email: updated.email,
            fullName: updated.fullName,
            phone: updated.phone,
            birthDate: updated.birthDate?.toISOString().slice(0, 10) ?? null,
            role: updated.role,
            createdAt: updated.createdAt.toISOString(),
        };
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Пользователь не найден');
        if (user.role === 'admin') {
            throw new common_1.BadRequestException('Нельзя удалить администратора');
        }
        await this.prisma.user.delete({ where: { id } });
        return { ok: true };
    }
    getCategoryFields() {
        return category_attribute_fields_1.categoryAttributeFields;
    }
    async listProducts() {
        const products = await this.prisma.product.findMany({
            orderBy: { id: 'desc' },
        });
        return products.map(mapProduct);
    }
    async getProduct(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Товар не найден');
        return mapProduct(product);
    }
    validateAttributeValues(categoryId, values) {
        const fields = category_attribute_fields_1.categoryAttributeFields[categoryId];
        if (!fields)
            throw new common_1.BadRequestException('Неизвестная категория');
        for (const field of fields) {
            const val = values[field.key];
            if (!val) {
                throw new common_1.BadRequestException(`Укажите поле «${field.label}»`);
            }
            if (field.options && !field.options.some((o) => o.value === val)) {
                throw new common_1.BadRequestException(`Недопустимое значение для «${field.label}»`);
            }
        }
    }
    async createProduct(dto) {
        const category = await this.prisma.category.findUnique({
            where: { id: dto.categoryId },
        });
        if (!category)
            throw new common_1.BadRequestException('Категория не найдена');
        this.validateAttributeValues(dto.categoryId, dto.attributeValues);
        const attributes = (0, category_attribute_fields_1.buildProductAttributes)(dto.categoryId, dto.brand, dto.price, dto.inStock, dto.attributeValues);
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
            });
            return mapProduct(product);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('OEM или артикул уже заняты');
            }
            throw e;
        }
    }
    async updateProduct(id, dto) {
        const existing = await this.prisma.product.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Товар не найден');
        const categoryId = dto.categoryId ?? existing.categoryId;
        const brand = dto.brand ?? existing.brand;
        const price = dto.price ?? existing.price;
        const inStock = dto.inStock ?? existing.inStock;
        const currentAttrs = existing.attributes;
        const attributeValues = dto.attributeValues ?? {
            partType: currentAttrs.partType,
            axle: currentAttrs.axle,
            voltage: currentAttrs.voltage,
        };
        Object.keys(attributeValues).forEach((k) => {
            if (attributeValues[k] === undefined)
                delete attributeValues[k];
        });
        if (dto.categoryId || dto.attributeValues) {
            this.validateAttributeValues(categoryId, attributeValues);
        }
        const attributes = (0, category_attribute_fields_1.buildProductAttributes)(categoryId, brand, price, inStock, attributeValues);
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
            });
            return mapProduct(product);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('OEM или артикул уже заняты');
            }
            throw e;
        }
    }
    async deleteProduct(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Товар не найден');
        await this.prisma.product.delete({ where: { id } });
        return { ok: true };
    }
    async listOrders(status) {
        const orders = await this.prisma.order.findMany({
            where: status && status !== 'all' ? { status: status } : undefined,
            include: {
                items: true,
                user: { select: { id: true, email: true, fullName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return orders.map(mapOrderAdmin);
    }
    async getOrder(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, user: { select: { id: true, email: true, fullName: true } } },
        });
        if (!order)
            throw new common_1.NotFoundException('Заказ не найден');
        return mapOrderAdmin(order);
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, user: { select: { id: true, email: true, fullName: true } } },
        });
        if (!order)
            throw new common_1.NotFoundException('Заказ не найден');
        const allowed = ADMIN_ORDER_TRANSITIONS[order.status];
        if (!allowed || allowed !== status) {
            throw new common_1.BadRequestException('Недопустимый переход статуса. Доступно: ожидание → в работе → ожидает получения');
        }
        const updated = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { items: true, user: { select: { id: true, email: true, fullName: true } } },
        });
        return mapOrderAdmin(updated);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map