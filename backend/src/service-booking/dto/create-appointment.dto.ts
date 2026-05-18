import { ArrayMaxSize, ArrayMinSize, IsArray, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'

export class CreateAppointmentDto {
  @IsUUID()
  garageVehicleId!: string

  @IsString()
  @MinLength(1)
  autoServiceId!: string

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  categoryIds!: string[]

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  problemDescription!: string
}
