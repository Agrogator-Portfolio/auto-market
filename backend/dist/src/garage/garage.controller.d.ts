import { User } from '@prisma/client';
import { CreateGarageVehicleDto } from './dto/create-garage-vehicle.dto';
import { UpdateGarageVehicleDto } from './dto/update-garage-vehicle.dto';
import { GarageService } from './garage.service';
export declare class GarageController {
    private readonly garage;
    constructor(garage: GarageService);
    list(user: User): Promise<{
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
    create(user: User, dto: CreateGarageVehicleDto): Promise<{
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
    update(user: User, id: string, dto: UpdateGarageVehicleDto): Promise<{
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
    setDefault(user: User, id: string): Promise<{
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
    remove(user: User, id: string): Promise<{
        ok: boolean;
    }>;
}
