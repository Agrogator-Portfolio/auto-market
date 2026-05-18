export interface FitmentEntry {
    carBrand: string;
    carModel: string;
    yearFrom: number;
    yearTo: number;
}
export interface GarageVehicleLike {
    brand: string;
    model: string;
    year: number;
}
export declare function parseFitment(attrs: Record<string, unknown>): FitmentEntry[];
export declare function vehicleLabel(brand: string, model: string): string;
export declare function productMatchesVehicle(fitment: FitmentEntry[], vehicle: GarageVehicleLike): boolean;
export declare function matchingVehicleLabels(fitment: FitmentEntry[], vehicles: GarageVehicleLike[]): string[];
