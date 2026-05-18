import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common'
import { User } from '@prisma/client'
import { CurrentUser } from '../auth/current-user.decorator'
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard'
import { CatalogService } from './catalog.service'
import { ProductsQueryDto } from './dto/products-query.dto'

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('categories')
  getCategories() {
    return this.catalog.getCategories()
  }

  @Get('products')
  @UseGuards(OptionalJwtAuthGuard)
  getProducts(@Query() query: ProductsQueryDto, @CurrentUser() user?: User) {
    return this.catalog.getProducts(query, user?.id)
  }

  @Get('products/:id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.catalog.getProductById(id)
  }

  @Get('products/:id/related')
  getRelated(
    @Param('id', ParseIntPipe) id: number,
    @Query('category') category: string,
    @Query('limit') limit?: string,
  ) {
    return this.catalog.getRelated(category, id, limit ? Number(limit) : 4)
  }

  @Get('search')
  search(@Query('q') q: string, @Query('limit') limit?: string) {
    return this.catalog.search(q ?? '', limit ? Number(limit) : 6)
  }

  @Get('popular')
  popular(@Query('limit') limit?: string) {
    return this.catalog.getPopular(limit ? Number(limit) : 8)
  }
}
