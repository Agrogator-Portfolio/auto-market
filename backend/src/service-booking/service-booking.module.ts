import { Module } from '@nestjs/common'
import { AdminAutoServicesController } from './admin-auto-services.controller'
import { AdminServiceAppointmentsController } from './admin-service-appointments.controller'
import { ServiceAppointmentsController } from './service-appointments.controller'
import { ServiceBookingService } from './service-booking.service'
import { ServiceCategoriesController } from './service-categories.controller'
import { ServiceCentersController } from './service-centers.controller'

@Module({
  controllers: [
    ServiceCategoriesController,
    ServiceCentersController,
    ServiceAppointmentsController,
    AdminServiceAppointmentsController,
    AdminAutoServicesController,
  ],
  providers: [ServiceBookingService],
})
export class ServiceBookingModule {}
