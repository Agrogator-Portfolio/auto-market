import { IsArray, IsInt } from 'class-validator'

export class SetRecommendedProductsDto {
  @IsArray()
  @IsInt({ each: true })
  productIds!: number[]
}
