import { Injectable, NotFoundException } from '@nestjs/common'
import { mapProduct } from '../common/product.mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    })

    const lines = items.map((item) => ({
      product: mapProduct(item.product),
      quantity: item.quantity,
      lineTotal: item.product.price * item.quantity,
    }))

    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)
    const count = lines.reduce((s, l) => s + l.quantity, 0)

    return { lines, subtotal, count, isEmpty: lines.length === 0 }
  }

  async addItem(userId: string, productId: number, quantity: number) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new NotFoundException('Товар не найден')

    await this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId, quantity },
      update: { quantity: { increment: quantity } },
    })

    return this.getCart(userId)
  }

  async updateQuantity(userId: string, productId: number, quantity: number) {
    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    })
    if (!existing) throw new NotFoundException('Позиция не найдена в корзине')

    await this.prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    })

    return this.getCart(userId)
  }

  async removeItem(userId: string, productId: number) {
    await this.prisma.cartItem.deleteMany({ where: { userId, productId } })
    return this.getCart(userId)
  }

  async clear(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } })
    return this.getCart(userId)
  }
}
