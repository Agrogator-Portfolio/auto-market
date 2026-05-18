import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    private mapUser;
    private signToken;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: string;
            fullName: string;
            phone: string;
            birthDate: string | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: string;
            fullName: string;
            phone: string;
            birthDate: string | null;
        };
    }>;
    mapUserPublic(user: {
        id: string;
        email: string;
        role: string;
        fullName: string;
        phone: string;
        birthDate: Date | null;
    }): {
        id: string;
        email: string;
        role: string;
        fullName: string;
        phone: string;
        birthDate: string | null;
    };
}
