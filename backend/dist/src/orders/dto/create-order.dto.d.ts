import { DeliveryMethod } from '@prisma/client';
export declare class CreateOrderDto {
    deliveryMethod: DeliveryMethod;
    address: string;
    recipientName: string;
    phone: string;
    comment?: string;
}
