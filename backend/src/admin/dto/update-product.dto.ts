import {
  IsArray,
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator'

export class AdminUpdateProductDto {
  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string

  @IsOptional()
  @IsString()
  brand?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  oldPrice?: number

  @IsOptional()
  @IsBoolean()
  inStock?: boolean

  @IsOptional()
  @IsString()
  oem?: string

  @IsOptional()
  @IsString()
  sku?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[]

  @IsOptional()
  @IsObject()
  attributeValues?: Record<string, string>
}
