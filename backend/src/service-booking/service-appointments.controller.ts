import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ServiceAppointmentStatus, User } from '@prisma/client'
import { CurrentUser } from '../auth/current-user.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { ServiceBookingService } from './service-booking.service'

@Controller('service-appointments')
@UseGuards(JwtAuthGuard)
export class ServiceAppointmentsController {
  constructor(private readonly service: ServiceBookingService) {}

  @Get()
  list(@CurrentUser() user: User, @Query('status') status?: ServiceAppointmentStatus) {
    return this.service.listMyAppointments(user.id, status)
  }

  @Get(':id')
  getOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.getMyAppointment(user.id, id)
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateAppointmentDto) {
    return this.service.createAppointment(user.id, dto)
  }
}
