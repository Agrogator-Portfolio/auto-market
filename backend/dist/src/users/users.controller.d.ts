import { User } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly users;
    private readonly auth;
    constructor(users: UsersService, auth: AuthService);
    profile(user: User): {
        id: string;
        email: string;
        role: string;
        fullName: string;
        phone: string;
        birthDate: string | null;
    };
    updateProfile(user: User, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        role: string;
        fullName: string;
        phone: string;
        birthDate: string | null;
    }>;
}
