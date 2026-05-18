import { Body, Controller, Get, Param, Patch, Put, Query, UseGuards } from '@nestjs/common'
import { ServiceAppointmentStatus } from '@prisma/client'
import { AdminGuard } from '../auth/admin.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ScheduleAppointmentDto } from './dto/schedule-appointment.dto'
import { SetRecommendedProductsDto } from './dto/set-recommended-products.dto'
import { ServiceBookingService } from './service-booking.service'

@Controller('admin/service-appointments')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminServiceAppointmentsController {
  constructor(private readonly service: ServiceBookingService) {}

  @Get()
  list(@Query('status') status?: ServiceAppointmentStatus) {
    return this.service.listAllAppointments(status)
  }

  @Get(':id/recommendable-products')
  recommendable(@Param('id') id: string, @Query('search') search?: string) {
    return this.service.getRecommendableProducts(id, search)
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getAppointmentAdmin(id)
  }

  @Put(':id/recommended-products')
  setRecommended(@Param('id') id: string, @Body() dto: SetRecommendedProductsDto) {
    return this.service.setRecommendedProducts(id, dto.productIds)
  }

  @Patch(':id/schedule')
  schedule(@Param('id') id: string, @Body() dto: ScheduleAppointmentDto) {
    return this.service.scheduleAppointment(id, dto)
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Body() body: { rejectReason?: string }) {
    return this.service.rejectAppointment(id, body.rejectReason)
  }
}
