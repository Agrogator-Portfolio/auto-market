import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AdminCreateProductDto } from './dto/create-product.dto';
import { AdminCreateUserDto } from './dto/create-user.dto';
import { AdminUpdateProductDto } from './dto/update-product.dto';
import { AdminUpdateUserDto } from './dto/update-user.dto';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listUsers(): Promise<{
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
    getUser(id: string): Promise<{
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
    getUserOrders(userId: string, completedOnly?: boolean): Promise<{
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
    createUser(dto: AdminCreateUserDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        birthDate: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: string;
    }>;
    updateUser(id: string, dto: AdminUpdateUserDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        birthDate: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: string;
    }>;
    deleteUser(id: string): Promise<{
        ok: boolean;
    }>;
    getCategoryFields(): Record<string, {
        key: string;
        label: string;
        type: "select" | "text";
        options?: {
            label: string;
            value: string;
        }[];
    }[]>;
    listProducts(): Promise<{
        id: number;
        categorySlug: string;
        name: string;
        brand: string;
        price: number;
        oldPrice: number | undefined;
        image: string;
        inStock: boolean;
        oem: string;
        sku: string;
        rating: number;
        reviewsCount: number;
        description: string;
        attributes: Record<string, unknown>;
        highlights: string[];
    }[]>;
    getProduct(id: number): Promise<{
        id: number;
        categorySlug: string;
        name: string;
        brand: string;
        price: number;
        oldPrice: number | undefined;
        image: string;
        inStock: boolean;
        oem: string;
        sku: string;
        rating: number;
        reviewsCount: number;
        description: string;
        attributes: Record<string, unknown>;
        highlights: string[];
    }>;
    private validateAttributeValues;
    createProduct(dto: AdminCreateProductDto): Promise<{
        id: number;
        categorySlug: string;
        name: string;
        brand: string;
        price: number;
        oldPrice: number | undefined;
        image: string;
        inStock: boolean;
        oem: string;
        sku: string;
        rating: number;
        reviewsCount: number;
        description: string;
        attributes: Record<string, unknown>;
        highlights: string[];
    }>;
    updateProduct(id: number, dto: AdminUpdateProductDto): Promise<{
        id: number;
        categorySlug: string;
        name: string;
        brand: string;
        price: number;
        oldPrice: number | undefined;
        image: string;
        inStock: boolean;
        oem: string;
        sku: string;
        rating: number;
        reviewsCount: number;
        description: string;
        attributes: Record<string, unknown>;
        highlights: string[];
    }>;
    deleteProduct(id: number): Promise<{
        ok: boolean;
    }>;
    listOrders(status?: string): Promise<{
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
    getOrder(orderId: string): Promise<{
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
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<{
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
