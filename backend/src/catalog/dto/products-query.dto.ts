import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class ProductsQueryDto {
  @IsString()
  category: string

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsIn(['popular', 'price_asc', 'price_desc', 'name_asc', 'rating_desc'])
  sort?: string = 'popular'

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize?: number = 8

  @IsOptional()
  @IsString()
  partType?: string

  @IsOptional()
  @IsString()
  brand?: string

  @IsOptional()
  @IsString()
  axle?: string

  @IsOptional()
  @IsString()
  voltage?: string

  @IsOptional()
  inStock?: string

  @IsOptional()
  @IsInt()
  priceMin?: number

  @IsOptional()
  @IsInt()
  priceMax?: number

  @IsOptional()
  @IsString()
  garageVehicleId?: string
}
