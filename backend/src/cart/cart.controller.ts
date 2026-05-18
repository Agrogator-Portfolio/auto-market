import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { CurrentUser } from '../auth/current-user.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CartService } from './cart.service'
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto'

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  getCart(@CurrentUser() user: User) {
    return this.cart.getCart(user.id)
  }

  @Post('items')
  addItem(@CurrentUser() user: User, @Body() dto: AddCartItemDto) {
    return this.cart.addItem(user.id, dto.productId, dto.quantity)
  }

  @Patch('items/:productId')
  updateItem(
    @CurrentUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cart.updateQuantity(user.id, productId, dto.quantity)
  }

  @Delete('items/:productId')
  removeItem(
    @CurrentUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cart.removeItem(user.id, productId)
  }

  @Delete()
  clear(@CurrentUser() user: User) {
    return this.cart.clear(user.id)
  }
}
