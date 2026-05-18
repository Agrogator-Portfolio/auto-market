import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { User, UserRole } from '@prisma/client'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user as User | undefined
    if (!user || user.role !== UserRole.admin) {
      throw new ForbiddenException('Доступ только для администратора')
    }
    return true
  }
}
