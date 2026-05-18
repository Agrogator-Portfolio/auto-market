"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryAttributeFields = void 0;
exports.buildProductAttributes = buildProductAttributes;
exports.categoryAttributeFields = {
    engine: [
        {
            key: 'partType',
            label: 'Тип детали',
            type: 'select',
            options: [
                { label: 'Масляный фильтр', value: 'oil-filter' },
                { label: 'Воздушный фильтр', value: 'air-filter' },
                { label: 'Свечи зажигания', value: 'spark-plug' },
                { label: 'Ремень ГРМ', value: 'timing-belt' },
                { label: 'Помпа', value: 'water-pump' },
            ],
        },
    ],
    brakes: [
        {
            key: 'partType',
            label: 'Тип детали',
            type: 'select',
            options: [
                { label: 'Колодки', value: 'pads' },
                { label: 'Диски', value: 'discs' },
                { label: 'Тормозная жидкость', value: 'fluid' },
                { label: 'Суппорт', value: 'caliper' },
            ],
        },
        {
            key: 'axle',
            label: 'Ось',
            type: 'select',
            options: [
                { label: 'Передняя', value: 'front' },
                { label: 'Задняя', value: 'rear' },
            ],
        },
    ],
    suspension: [
        {
            key: 'partType',
            label: 'Тип детали',
            type: 'select',
            options: [
                { label: 'Амортизатор', value: 'shock' },
                { label: 'Пружина', value: 'spring' },
                { label: 'Сайлентблок', value: 'bushing' },
                { label: 'Рычаг', value: 'arm' },
            ],
        },
        {
            key: 'axle',
            label: 'Ось',
            type: 'select',
            options: [
                { label: 'Передняя', value: 'front' },
                { label: 'Задняя', value: 'rear' },
            ],
        },
    ],
    electrics: [
        {
            key: 'partType',
            label: 'Тип детали',
            type: 'select',
            options: [
                { label: 'Аккумулятор', value: 'battery' },
                { label: 'Генератор', value: 'alternator' },
                { label: 'Стартер', value: 'starter' },
                { label: 'Реле / предохранитель', value: 'relay' },
            ],
        },
        {
            key: 'voltage',
            label: 'Напряжение',
            type: 'select',
            options: [
                { label: '12 В', value: '12' },
                { label: '24 В', value: '24' },
            ],
        },
    ],
};
function buildProductAttributes(categoryId, brand, price, inStock, extra) {
    return {
        brand,
        inStock,
        price,
        ...extra,
    };
}
//# sourceMappingURL=category-attribute-fields.js.map