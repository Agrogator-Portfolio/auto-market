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

export class UpdateAutoServiceDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  city?: string

  @IsOptional()
  @IsString()
  @MinLength(5)
  address?: string

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number

  @IsOptional()
  @IsString()
  @MinLength(3)
  workSchedule?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categoryIds?: string[]
}
