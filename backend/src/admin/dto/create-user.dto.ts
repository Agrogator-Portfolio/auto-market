import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class AdminCreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  @MinLength(2)
  fullName: string

  @IsString()
  @MinLength(10)
  phone: string

  @IsOptional()
  @IsString()
  birthDate?: string
}
