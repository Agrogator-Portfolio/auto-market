import { AdminService } from './admin.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class AdminOrdersController {
    private readonly admin;
    constructor(admin: AdminService);
    list(status?: string): Promise<{
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
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
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
    }>;
}
