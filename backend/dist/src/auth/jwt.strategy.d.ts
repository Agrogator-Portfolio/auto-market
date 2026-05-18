import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        fullName: string;
        phone: string;
        birthDate: Date | null;
        updatedAt: Date;
    }>;
}
export {};
