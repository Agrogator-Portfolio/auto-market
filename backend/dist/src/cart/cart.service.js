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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const product_mapper_1 = require("../common/product.mapper");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        const items = await this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });
        const lines = items.map((item) => ({
            product: (0, product_mapper_1.mapProduct)(item.product),
            quantity: item.quantity,
            lineTotal: item.product.price * item.quantity,
        }));
        const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
        const count = lines.reduce((s, l) => s + l.quantity, 0);
        return { lines, subtotal, count, isEmpty: lines.length === 0 };
    }
    async addItem(userId, productId, quantity) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Товар не найден');
        await this.prisma.cartItem.upsert({
            where: { userId_productId: { userId, productId } },
            create: { userId, productId, quantity },
            update: { quantity: { increment: quantity } },
        });
        return this.getCart(userId);
    }
    async updateQuantity(userId, productId, quantity) {
        const existing = await this.prisma.cartItem.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (!existing)
            throw new common_1.NotFoundException('Позиция не найдена в корзине');
        await this.prisma.cartItem.update({
            where: { userId_productId: { userId, productId } },
            data: { quantity },
        });
        return this.getCart(userId);
    }
    async removeItem(userId, productId) {
        await this.prisma.cartItem.deleteMany({ where: { userId, productId } });
        return this.getCart(userId);
    }
    async clear(userId) {
        await this.prisma.cartItem.deleteMany({ where: { userId } });
        return this.getCart(userId);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map