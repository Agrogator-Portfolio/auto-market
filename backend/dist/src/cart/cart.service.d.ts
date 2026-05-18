import { PrismaService } from '../prisma/prisma.service';
export declare class CartService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<{
        lines: {
            product: {
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
                attributes: Record<string, string | number | boolean>;
                fitment: import("../common/fitment").FitmentEntry[];
                highlights: string[];
                garageMatchLabel: string | undefined;
                garageMatchLabels: string[] | undefined;
            };
            quantity: number;
            lineTotal: number;
        }[];
        subtotal: number;
        count: number;
        isEmpty: boolean;
    }>;
    addItem(userId: string, productId: number, quantity: number): Promise<{
        lines: {
            product: {
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
                attributes: Record<string, string | number | boolean>;
                fitment: import("../common/fitment").FitmentEntry[];
                highlights: string[];
                garageMatchLabel: string | undefined;
                garageMatchLabels: string[] | undefined;
            };
            quantity: number;
            lineTotal: number;
        }[];
        subtotal: number;
        count: number;
        isEmpty: boolean;
    }>;
    updateQuantity(userId: string, productId: number, quantity: number): Promise<{
        lines: {
            product: {
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
                attributes: Record<string, string | number | boolean>;
                fitment: import("../common/fitment").FitmentEntry[];
                highlights: string[];
                garageMatchLabel: string | undefined;
                garageMatchLabels: string[] | undefined;
            };
            quantity: number;
            lineTotal: number;
        }[];
        subtotal: number;
        count: number;
        isEmpty: boolean;
    }>;
    removeItem(userId: string, productId: number): Promise<{
        lines: {
            product: {
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
                attributes: Record<string, string | number | boolean>;
                fitment: import("../common/fitment").FitmentEntry[];
                highlights: string[];
                garageMatchLabel: string | undefined;
                garageMatchLabels: string[] | undefined;
            };
            quantity: number;
            lineTotal: number;
        }[];
        subtotal: number;
        count: number;
        isEmpty: boolean;
    }>;
    clear(userId: string): Promise<{
        lines: {
            product: {
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
                attributes: Record<string, string | number | boolean>;
                fitment: import("../common/fitment").FitmentEntry[];
                highlights: string[];
                garageMatchLabel: string | undefined;
                garageMatchLabels: string[] | undefined;
            };
            quantity: number;
            lineTotal: number;
        }[];
        subtotal: number;
        count: number;
        isEmpty: boolean;
    }>;
}
