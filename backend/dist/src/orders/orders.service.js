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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function calcDeliveryCost(method, subtotal) {
    if (method === 'pickup')
        return 0;
    if (subtotal >= 10000)
        return 0;
    return method === 'courier' ? 490 : 350;
}
function mapOrder(order) {
    return {
        id: order.id,
        number: order.number,
        createdAt: order.createdAt.toISOString(),
        status: order.status,
        items: order.items.map((i) => ({
            productId: i.productId,
            categorySlug: i.categorySlug,
            name: i.name,
            brand: i.brand,
            sku: i.sku,
            price: i.price,
            quantity: i.quantity,
        })),
        subtotal: order.subtotal,
        deliveryCost: order.deliveryCost,
        total: order.total,
        deliveryMethod: order.deliveryMethod,
        address: order.address,
        recipientName: order.recipientName,
        phone: order.phone,
        comment: order.comment ?? undefined,
    };
}
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId, status) {
        const orders = await this.prisma.order.findMany({
            where: {
                userId,
                ...(status && status !== 'all' ? { status: status } : {}),
            },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
        return orders.map(mapOrder);
    }
    async getById(userId, id) {
        const order = await this.prisma.order.findFirst({
            where: { id, userId },
            include: { items: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Заказ не найден');
        return mapOrder(order);
    }
    async create(userId, dto) {
        const cartItems = await this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });
        if (!cartItems.length) {
            throw new common_1.BadRequestException('Корзина пуста');
        }
        const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
        const deliveryCost = calcDeliveryCost(dto.deliveryMethod, subtotal);
        const total = subtotal + deliveryCost;
        const number = `AD-${Math.floor(10000 + Math.random() * 89999)}`;
        const order = await this.prisma.$transaction(async (tx) => {
            const created = await tx.order.create({
                data: {
                    number,
                    userId,
                    subtotal,
                    deliveryCost,
                    total,
                    deliveryMethod: dto.deliveryMethod,
                    address: dto.address,
                    recipientName: dto.recipientName,
                    phone: dto.phone,
                    comment: dto.comment,
                    items: {
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            categorySlug: item.product.categoryId,
                            name: item.product.name,
                            brand: item.product.brand,
                            sku: item.product.sku,
                            price: item.product.price,
                            quantity: item.quantity,
                        })),
                    },
                },
                include: { items: true },
            });
            await tx.cartItem.deleteMany({ where: { userId } });
            return created;
        });
        return mapOrder(order);
    }
    async confirmReceived(userId, orderId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userId },
        });
        if (!order)
            throw new common_1.NotFoundException('Заказ не найден');
        if (order.status !== 'awaiting_pickup') {
            throw new common_1.BadRequestException('Подтвердить получение можно только для заказа, готового к выдаче');
        }
        const updated = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'completed' },
            include: { items: true },
        });
        return mapOrder(updated);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map