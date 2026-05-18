import { AdminService } from './admin.service';
import { AdminCreateProductDto } from './dto/create-product.dto';
import { AdminUpdateProductDto } from './dto/update-product.dto';
export declare class AdminProductsController {
    private readonly admin;
    constructor(admin: AdminService);
    categoryFields(): Record<string, {
        key: string;
        label: string;
        type: "select" | "text";
        options?: {
            label: string;
            value: string;
        }[];
    }[]>;
    list(): Promise<{
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
    getOne(id: number): Promise<{
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
    create(dto: AdminCreateProductDto): Promise<{
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
    update(id: number, dto: AdminUpdateProductDto): Promise<{
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
    remove(id: number): Promise<{
        ok: boolean;
    }>;
}
