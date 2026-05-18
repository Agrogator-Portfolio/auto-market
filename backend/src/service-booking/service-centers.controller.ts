import { Controller, Get, Param, Query } from '@nestjs/common'
import { ServiceBookingService } from './service-booking.service'

@Controller('service-centers')
export class ServiceCentersController {
  constructor(private readonly service: ServiceBookingService) {}

  @Get('featured')
  featured(@Query('limit') limit?: string) {
    const n = Math.min(10, Math.max(1, parseInt(limit ?? '3', 10) || 3))
    return this.service.listRandomCenters(n)
  }

  @Get()
  list(@Query('city') city?: string, @Query('categories') categories?: string) {
    const categoryIds = categories
      ? categories.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined
    return this.service.listCenters(city, categoryIds)
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getCenter(id)
  }
}
