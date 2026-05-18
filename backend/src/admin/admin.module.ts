import { Module } from '@nestjs/common'
import { AdminOrdersController } from './admin-orders.controller'
import { AdminProductsController } from './admin-products.controller'
import { AdminUsersController } from './admin-users.controller'
import { AdminService } from './admin.service'

@Module({
  controllers: [AdminUsersController, AdminProductsController, AdminOrdersController],
  providers: [AdminService],
})
export class AdminModule {}
