export declare class AdminCreateProductDto {
    categoryId: string;
    name: string;
    brand: string;
    price: number;
    oldPrice?: number;
    inStock: boolean;
    oem: string;
    sku: string;
    description: string;
    highlights: string[];
    attributeValues: Record<string, string>;
}
