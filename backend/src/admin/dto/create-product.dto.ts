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

export class AdminCreateProductDto {
  @IsString()
  categoryId: string

  @IsString()
  @MinLength(2)
  name: string

  @IsString()
  brand: string

  @IsInt()
  @Min(0)
  price: number

  @IsOptional()
  @IsInt()
  @Min(0)
  oldPrice?: number

  @IsBoolean()
  inStock: boolean

  @IsString()
  oem: string

  @IsString()
  sku: string

  @IsString()
  description: string

  @IsArray()
  @IsString({ each: true })
  highlights: string[]

  @IsObject()
  attributeValues: Record<string, string>
}
