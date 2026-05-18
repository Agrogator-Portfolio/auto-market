import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { User } from '@prisma/client'
import { CurrentUser } from '../auth/current-user.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateGarageVehicleDto } from './dto/create-garage-vehicle.dto'
import { UpdateGarageVehicleDto } from './dto/update-garage-vehicle.dto'
import { GarageService } from './garage.service'

@Controller('garage')
@UseGuards(JwtAuthGuard)
export class GarageController {
  constructor(private readonly garage: GarageService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.garage.list(user.id)
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateGarageVehicleDto) {
    return this.garage.create(user.id, dto)
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateGarageVehicleDto,
  ) {
    return this.garage.update(user.id, id, dto)
  }

  @Patch(':id/default')
  setDefault(@CurrentUser() user: User, @Param('id') id: string) {
    return this.garage.setDefault(user.id, id)
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.garage.remove(user.id, id)
  }
}
