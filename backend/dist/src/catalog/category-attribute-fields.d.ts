export declare const categoryAttributeFields: Record<string, Array<{
    key: string;
    label: string;
    type: 'select' | 'text';
    options?: {
        label: string;
        value: string;
    }[];
}>>;
export declare function buildProductAttributes(categoryId: string, brand: string, price: number, inStock: boolean, extra: Record<string, string | number | boolean>): {
    brand: string;
    inStock: boolean;
    price: number;
};
