import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
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
    me(user: User): {
        id: string;
        email: string;
        role: string;
        fullName: string;
        phone: string;
        birthDate: string | null;
    };
}
