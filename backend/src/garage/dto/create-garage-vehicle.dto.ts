import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'

export class CreateGarageVehicleDto {
  @IsString()
  @MinLength(1)
  brand: string

  @IsString()
  @MinLength(1)
  model: string

  @IsInt()
  @Min(1980)
  @Max(2030)
  year: number

  @IsOptional()
  @IsString()
  @MaxLength(17)
  vin?: string

  @IsOptional()
  @IsString()
  @MaxLength(80)
  nickname?: string

  @IsOptional()
  isDefault?: boolean
}
