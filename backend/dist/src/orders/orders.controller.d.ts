import { User } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly orders;
    constructor(orders: OrdersService);
    list(user: User, status?: string): Promise<{
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
    getOne(user: User, id: string): Promise<{
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
    create(user: User, dto: CreateOrderDto): Promise<{
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
    complete(user: User, id: string): Promise<{
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
