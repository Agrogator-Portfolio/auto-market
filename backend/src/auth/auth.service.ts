import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private mapUser(user: {
    id: string
    email: string
    role: string
    fullName: string
    phone: string
    birthDate: Date | null
  }) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      birthDate: user.birthDate?.toISOString().slice(0, 10) ?? null,
    }
  }

  private signToken(userId: string, email: string) {
    return this.jwt.sign({ sub: userId, email })
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new ConflictException('Email уже зарегистрирован')

    const password = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password,
        fullName: dto.fullName,
        phone: dto.phone,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
      },
    })

    return {
      accessToken: this.signToken(user.id, user.email),
      user: this.mapUser(user),
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim()
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthorizedException('Неверный email или пароль')

    const ok = await bcrypt.compare(dto.password, user.password)
    if (!ok) throw new UnauthorizedException('Неверный email или пароль')

    return {
      accessToken: this.signToken(user.id, user.email),
      user: this.mapUser(user),
    }
  }

  mapUserPublic(user: {
    id: string
    email: string
    role: string
    fullName: string
    phone: string
    birthDate: Date | null
  }) {
    return this.mapUser(user)
  }
}
