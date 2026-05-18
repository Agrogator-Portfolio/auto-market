import { Controller, Get } from '@nestjs/common'
import { ServiceBookingService } from './service-booking.service'

@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(private readonly service: ServiceBookingService) {}

  @Get()
  list() {
    return this.service.listCategories()
  }
}
