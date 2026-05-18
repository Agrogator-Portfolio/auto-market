import { DeliveryMethod } from '@prisma/client'
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateOrderDto {
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod

  @IsString()
  @MinLength(5)
  address: string

  @IsString()
  @MinLength(2)
  recipientName: string

  @IsString()
  @MinLength(10)
  phone: string

  @IsOptional()
  @IsString()
  comment?: string
}
