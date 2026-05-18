import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { User } from '@prisma/client'
import { CurrentUser } from '../auth/current-user.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrdersService } from './orders.service'

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@CurrentUser() user: User, @Query('status') status?: string) {
    return this.orders.list(user.id, status)
  }

  @Get(':id')
  getOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.orders.getById(user.id, id)
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.orders.create(user.id, dto)
  }

  @Patch(':id/complete')
  complete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.orders.confirmReceived(user.id, id)
  }
}
