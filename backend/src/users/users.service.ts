import { ConflictException, Injectable } from '@nestjs/common'
import { AuthService } from '../auth/auth.service'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ) {
    if (dto.email) {
      const taken = await this.prisma.user.findFirst({
        where: { email: dto.email, id: { not: userId } },
      })
      if (taken) throw new ConflictException('Email уже занят')
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
    })

    return this.auth.mapUserPublic(user)
  }
}
