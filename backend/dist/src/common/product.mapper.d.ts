import { Product } from '@prisma/client';
import { FitmentEntry } from './fitment';
export declare function mapProduct(p: Product, opts?: {
    garageMatchLabel?: string;
    garageMatchLabels?: string[];
}): {
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
    fitment: FitmentEntry[];
    highlights: string[];
    garageMatchLabel: string | undefined;
    garageMatchLabels: string[] | undefined;
};
export declare function buildGarageMatchLabel(fitment: FitmentEntry[], vehicle: {
    brand: string;
    model: string;
    year: number;
}): string | undefined;
