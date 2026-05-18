import { AdminService } from './admin.service';
import { AdminCreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto } from './dto/update-user.dto';
export declare class AdminUsersController {
    private readonly admin;
    constructor(admin: AdminService);
    list(): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        birthDate: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: string;
        stats: {
            totalSpent: number;
            itemsPurchased: number;
            completedOrders: number;
        };
    }[]>;
    userOrders(id: string): Promise<{
        id: string;
        number: string;
        createdAt: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        deliveryCost: number;
        total: number;
        deliveryMethod: string;
        address: string;
        recipientName: string;
        phone: string;
        comment: string | undefined;
        user: {
            id: string;
            email: string;
            fullName: string;
        };
        items: {
            productId: number;
            categorySlug: string;
            name: string;
            brand: string;
            sku: string;
            price: number;
            quantity: number;
        }[];
    }[]>;
    getOne(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        birthDate: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: string;
        stats: {
            totalSpent: number;
            itemsPurchased: number;
            completedOrders: number;
            totalOrders: number;
        };
    }>;
    create(dto: AdminCreateUserDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        birthDate: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: string;
    }>;
    update(id: string, dto: AdminUpdateUserDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        birthDate: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: string;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
