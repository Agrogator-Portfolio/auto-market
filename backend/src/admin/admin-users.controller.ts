import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../auth/admin.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AdminService } from './admin.service'
import { AdminCreateUserDto } from './dto/create-user.dto'
import { AdminUpdateUserDto } from './dto/update-user.dto'

@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminUsersController {
  constructor(private readonly admin: AdminService) {}

  @Get()
  list() {
    return this.admin.listUsers()
  }

  @Get(':id/orders')
  userOrders(@Param('id') id: string) {
    return this.admin.getUserOrders(id, true)
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.admin.getUser(id)
  }

  @Post()
  create(@Body() dto: AdminCreateUserDto) {
    return this.admin.createUser(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.admin.updateUser(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.admin.deleteUser(id)
  }
}
