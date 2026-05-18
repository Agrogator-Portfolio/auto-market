import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string, status?: string): Promise<{
        id: string;
        number: string;
        createdAt: string;
        status: string;
        items: {
            productId: number;
            categorySlug: string;
            name: string;
            brand: string;
            sku: string;
            price: number;
            quantity: number;
        }[];
        subtotal: number;
        deliveryCost: number;
        total: number;
        deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
        address: string;
        recipientName: string;
        phone: string;
        comment: string | undefined;
    }[]>;
    getById(userId: string, id: string): Promise<{
        id: string;
        number: string;
        createdAt: string;
        status: string;
        items: {
            productId: number;
            categorySlug: string;
            name: string;
            brand: string;
            sku: string;
            price: number;
            quantity: number;
        }[];
        subtotal: number;
        deliveryCost: number;
        total: number;
        deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
        address: string;
        recipientName: string;
        phone: string;
        comment: string | undefined;
    }>;
    create(userId: string, dto: CreateOrderDto): Promise<{
        id: string;
        number: string;
        createdAt: string;
        status: string;
        items: {
            productId: number;
            categorySlug: string;
            name: string;
            brand: string;
            sku: string;
            price: number;
            quantity: number;
        }[];
        subtotal: number;
        deliveryCost: number;
        total: number;
        deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
        address: string;
        recipientName: string;
        phone: string;
        comment: string | undefined;
    }>;
    confirmReceived(userId: string, orderId: string): Promise<{
        id: string;
        number: string;
        createdAt: string;
        status: string;
        items: {
            productId: number;
            categorySlug: string;
            name: string;
            brand: string;
            sku: string;
            price: number;
            quantity: number;
        }[];
        subtotal: number;
        deliveryCost: number;
        total: number;
        deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
        address: string;
        recipientName: string;
        phone: string;
        comment: string | undefined;
    }>;
}
