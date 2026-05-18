import { User } from '@prisma/client';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';
export declare class CartController {
    private readonly cart;
    constructor(cart: CartService);
    getCart(user: User): Promise<{
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
    addItem(user: User, dto: AddCartItemDto): Promise<{
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
    updateItem(user: User, productId: number, dto: UpdateCartItemDto): Promise<{
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
    removeItem(user: User, productId: number): Promise<{
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
    clear(user: User): Promise<{
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
