import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../auth/admin.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AdminService } from './admin.service'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminOrdersController {
  constructor(private readonly admin: AdminService) {}

  @Get()
  list(@Query('status') status?: string) {
    return this.admin.listOrders(status)
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.admin.getOrder(id)
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.admin.updateOrderStatus(id, dto.status)
  }
}
