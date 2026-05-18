import { PrismaService } from '../prisma/prisma.service';
import { CreateGarageVehicleDto } from './dto/create-garage-vehicle.dto';
import { UpdateGarageVehicleDto } from './dto/update-garage-vehicle.dto';
export declare class GarageService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): Promise<{
        id: string;
        brand: string;
        model: string;
        year: number;
        vin: string | undefined;
        nickname: string | undefined;
        isDefault: boolean;
        label: string;
        createdAt: string;
        updatedAt: string;
    }[]>;
    create(userId: string, dto: CreateGarageVehicleDto): Promise<{
        id: string;
        brand: string;
        model: string;
        year: number;
        vin: string | undefined;
        nickname: string | undefined;
        isDefault: boolean;
        label: string;
        createdAt: string;
        updatedAt: string;
    }>;
    update(userId: string, id: string, dto: UpdateGarageVehicleDto): Promise<{
        id: string;
        brand: string;
        model: string;
        year: number;
        vin: string | undefined;
        nickname: string | undefined;
        isDefault: boolean;
        label: string;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    setDefault(userId: string, id: string): Promise<{
        id: string;
        brand: string;
        model: string;
        year: number;
        vin: string | undefined;
        nickname: string | undefined;
        isDefault: boolean;
        label: string;
        createdAt: string;
        updatedAt: string;
    }>;
    getForUser(userId: string, vehicleId: string): Promise<{
        id: string;
        brand: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        nickname: string | null;
        model: string;
        year: number;
        vin: string | null;
        isDefault: boolean;
    }>;
}
