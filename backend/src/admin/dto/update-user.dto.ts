import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class AdminUpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string

  @IsOptional()
  @IsString()
  @MinLength(10)
  phone?: string

  @IsOptional()
  @IsString()
  birthDate?: string
}
