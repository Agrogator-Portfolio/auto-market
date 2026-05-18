import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../auth/admin.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateAutoServiceDto } from './dto/create-auto-service.dto'
import { UpdateAutoServiceDto } from './dto/update-auto-service.dto'
import { ServiceBookingService } from './service-booking.service'

@Controller('admin/auto-services')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminAutoServicesController {
  constructor(private readonly service: ServiceBookingService) {}

  @Get('categories')
  listCategories() {
    return this.service.listCategories()
  }

  @Get()
  list() {
    return this.service.listCentersAdmin()
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getCenter(id)
  }

  @Post()
  create(@Body() dto: CreateAutoServiceDto) {
    return this.service.createCenter(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAutoServiceDto) {
    return this.service.updateCenter(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.deleteCenter(id)
  }
}
