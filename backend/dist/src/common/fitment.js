"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFitment = parseFitment;
exports.vehicleLabel = vehicleLabel;
exports.productMatchesVehicle = productMatchesVehicle;
exports.matchingVehicleLabels = matchingVehicleLabels;
function parseFitment(attrs) {
    const raw = attrs.fitment;
    if (!Array.isArray(raw))
        return [];
    return raw
        .filter((item) => item != null && typeof item === 'object')
        .map((item) => ({
        carBrand: String(item.carBrand ?? ''),
        carModel: String(item.carModel ?? ''),
        yearFrom: Number(item.yearFrom ?? 1980),
        yearTo: Number(item.yearTo ?? 2030),
    }))
        .filter((f) => f.carBrand && f.carModel);
}
function vehicleLabel(brand, model) {
    return `${brand} ${model}`;
}
function productMatchesVehicle(fitment, vehicle) {
    if (!fitment.length)
        return false;
    const brand = vehicle.brand.trim().toLowerCase();
    const model = vehicle.model.trim().toLowerCase();
    return fitment.some((f) => {
        if (f.carBrand.trim().toLowerCase() !== brand)
            return false;
        if (f.carModel.trim().toLowerCase() !== model)
            return false;
        return vehicle.year >= f.yearFrom && vehicle.year <= f.yearTo;
    });
}
function matchingVehicleLabels(fitment, vehicles) {
    const labels = [];
    for (const v of vehicles) {
        if (productMatchesVehicle(fitment, v)) {
            const label = vehicleLabel(v.brand, v.model);
            if (!labels.includes(label))
                labels.push(label);
        }
    }
    return labels;
}
//# sourceMappingURL=fitment.js.map