import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AdminGuard } from '../auth/admin.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AdminService } from './admin.service'
import { AdminCreateProductDto } from './dto/create-product.dto'
import { AdminUpdateProductDto } from './dto/update-product.dto'

@Controller('admin/products')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminProductsController {
  constructor(private readonly admin: AdminService) {}

  @Get('category-fields')
  categoryFields() {
    return this.admin.getCategoryFields()
  }

  @Get()
  list() {
    return this.admin.listProducts()
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.admin.getProduct(id)
  }

  @Post()
  create(@Body() dto: AdminCreateProductDto) {
    return this.admin.createProduct(dto)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: AdminUpdateProductDto) {
    return this.admin.updateProduct(id, dto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteProduct(id)
  }
}
