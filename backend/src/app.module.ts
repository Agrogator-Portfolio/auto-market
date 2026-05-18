import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AdminModule } from './admin/admin.module'
import { AuthModule } from './auth/auth.module'
import { CartModule } from './cart/cart.module'
import { CatalogModule } from './catalog/catalog.module'
import { GarageModule } from './garage/garage.module'
import { ServiceBookingModule } from './service-booking/service-booking.module'
import { OrdersModule } from './orders/orders.module'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CatalogModule,
    GarageModule,
    ServiceBookingModule,
    CartModule,
    OrdersModule,
    AdminModule,
  ],
})
export class AppModule {}
