import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator'

export class CreateAutoServiceDto {
  @IsString()
  @MinLength(2)
  name!: string

  @IsString()
  @MinLength(2)
  city!: string

  @IsString()
  @MinLength(5)
  address!: string

  @IsString()
  @MinLength(10)
  description!: string

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number

  @IsString()
  @MinLength(3)
  workSchedule!: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categoryIds!: string[]
}
