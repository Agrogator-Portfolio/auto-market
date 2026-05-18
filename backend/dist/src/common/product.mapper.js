"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProduct = mapProduct;
exports.buildGarageMatchLabel = buildGarageMatchLabel;
const fitment_1 = require("./fitment");
function mapProduct(p, opts) {
    const attrs = p.attributes;
    const fitment = (0, fitment_1.parseFitment)(attrs);
    const { fitment: _f, ...filterAttrs } = attrs;
    return {
        id: p.id,
        categorySlug: p.categoryId,
        name: p.name,
        brand: p.brand,
        price: p.price,
        oldPrice: p.oldPrice ?? undefined,
        image: p.image,
        inStock: p.inStock,
        oem: p.oem,
        sku: p.sku,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        description: p.description,
        attributes: filterAttrs,
        fitment,
        highlights: p.highlights,
        garageMatchLabel: opts?.garageMatchLabel,
        garageMatchLabels: opts?.garageMatchLabels,
    };
}
function buildGarageMatchLabel(fitment, vehicle) {
    if ((0, fitment_1.productMatchesVehicle)(fitment, vehicle)) {
        return (0, fitment_1.vehicleLabel)(vehicle.brand, vehicle.model);
    }
    return undefined;
}
//# sourceMappingURL=product.mapper.js.map