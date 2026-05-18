"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const brands = ['Bosch', 'Mann-Filter', 'NGK', 'Brembo', 'ATE', 'KYB', 'Gates', 'Varta', 'Denso', 'Febi'];
const categories = [
    {
        id: 'engine',
        name: 'Двигатель',
        icon: 'lucide:cog',
        description: 'Фильтры, ремни, свечи, насосы и расходники для двигателя',
    },
    {
        id: 'brakes',
        name: 'Тормозная система',
        icon: 'lucide:circle-parking',
        description: 'Колодки, диски, жидкости и комплектующие тормозов',
    },
    {
        id: 'suspension',
        name: 'Подвеска',
        icon: 'lucide:wrench',
        description: 'Амортизаторы, пружины, сайлентблоки и рычаги',
    },
    {
        id: 'electrics',
        name: 'Электрика',
        icon: 'lucide:zap',
        description: 'Аккумуляторы, генераторы, стартеры и электрокомпоненты',
    },
];
const engineTemplates = [
    { name: 'Масляный фильтр', partType: 'oil-filter', highlights: ['Ресурс 15 000 км', 'Металлический корпус'] },
    { name: 'Воздушный фильтр', partType: 'air-filter', highlights: ['Высокая пропускная способность', 'Для турбо'] },
    { name: 'Свечи зажигания (комплект)', partType: 'spark-plug', highlights: ['Иридиевые электроды', '4 шт. в комплекте'] },
    { name: 'Ремень ГРМ', partType: 'timing-belt', highlights: ['С натяжителем', 'Ресурс 90 000 км'] },
    { name: 'Помпа водяная', partType: 'water-pump', highlights: ['С прокладкой', 'Подшипник усиленный'] },
];
const brakesTemplates = [
    { name: 'Тормозные колодки', partType: 'pads', axle: 'front', highlights: ['Низкий уровень пыли', 'Керамическая накладка'] },
    { name: 'Тормозные колодки задние', partType: 'pads', axle: 'rear', highlights: ['OEM-качество', 'Датчик износа'] },
    { name: 'Тормозной диск', partType: 'discs', axle: 'front', highlights: ['Вентилируемый', 'Диаметр 312 мм'] },
    { name: 'Тормозная жидкость DOT 4', partType: 'fluid', axle: 'front', highlights: ['Температура кипения 260°C', 'Объём 1 л'] },
    { name: 'Суппорт тормозной', partType: 'caliper', axle: 'front', highlights: ['Восстановленный', 'С поршнем'] },
];
const suspensionTemplates = [
    { name: 'Амортизатор передний', partType: 'shock', axle: 'front', highlights: ['Газомасляный', 'Пара'] },
    { name: 'Амортизатор задний', partType: 'shock', axle: 'rear', highlights: ['Комфортная настройка', 'Пара'] },
    { name: 'Пружина подвески', partType: 'spring', axle: 'front', highlights: ['Понижающая -30 мм', 'Сталь'] },
    { name: 'Сайлентблок рычага', partType: 'bushing', axle: 'front', highlights: ['Полиуретан', '2 шт.'] },
    { name: 'Рычаг подвески', partType: 'arm', axle: 'rear', highlights: ['С шаровой опорой', 'Левый'] },
];
const electricsTemplates = [
    { name: 'Аккумулятор', partType: 'battery', voltage: '12', highlights: ['60 А·ч', 'Пусковой ток 540 А'] },
    { name: 'Аккумулятор AGM', partType: 'battery', voltage: '12', highlights: ['70 А·ч', 'Start-Stop'] },
    { name: 'Генератор', partType: 'alternator', voltage: '12', highlights: ['140 А', 'С натяжным роликом'] },
    { name: 'Стартер', partType: 'starter', voltage: '12', highlights: ['1.4 кВт', 'Бензин'] },
    { name: 'Реле фар', partType: 'relay', voltage: '12', highlights: ['4 контакта', '40 А'] },
];
const PRODUCTS_PER_CATEGORY = 13;
async function main() {
    const productCount = await prisma.product.count();
    if (productCount > 0) {
        console.log(`Seed skipped: ${productCount} products already exist`);
        return;
    }
    console.log('Seeding database...');
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { id: cat.id },
            create: cat,
            update: cat,
        });
    }
    const batches = [
        { categoryId: 'engine', templates: engineTemplates, extra: () => ({}) },
        {
            categoryId: 'brakes',
            templates: brakesTemplates,
            extra: (t) => ({ axle: t.axle ?? 'front' }),
        },
        {
            categoryId: 'suspension',
            templates: suspensionTemplates,
            extra: (t) => ({ axle: t.axle ?? 'front' }),
        },
        {
            categoryId: 'electrics',
            templates: electricsTemplates,
            extra: (t) => ({ voltage: t.voltage ?? '12' }),
        },
    ];
    for (const batch of batches) {
        for (let i = 0; i < PRODUCTS_PER_CATEGORY; i++) {
            const t = batch.templates[i % batch.templates.length];
            const brand = brands[i % brands.length];
            const basePrice = 800 + (i % 12) * 650 + (batch.categoryId === 'electrics' ? 2000 : 0);
            const inStock = i % 5 !== 0;
            const idSuffix = 100 + i;
            await prisma.product.create({
                data: {
                    categoryId: batch.categoryId,
                    name: `${t.name} ${brand} ${idSuffix}`,
                    brand,
                    price: basePrice,
                    oldPrice: i % 4 === 0 ? Math.round(basePrice * 1.15) : null,
                    inStock,
                    oem: `OEM-${batch.categoryId.toUpperCase()}-${1000 + i + batch.categoryId.length * 100}`,
                    sku: `AD-${batch.categoryId.slice(0, 3).toUpperCase()}-${idSuffix}`,
                    rating: 3.8 + (i % 12) * 0.1,
                    reviewsCount: 12 + (i % 40),
                    description: `${t.name} для широкого парка автомобилей. Проверенное качество бренда ${brand}. Подходит для планового ТО.`,
                    attributes: {
                        partType: t.partType,
                        brand,
                        inStock,
                        price: basePrice,
                        ...batch.extra(t),
                    },
                    highlights: t.highlights,
                },
            });
        }
    }
    const demoPassword = await bcrypt.hash('demo12345', 10);
    await prisma.user.upsert({
        where: { email: 'demo@autodetail.ru' },
        create: {
            email: 'demo@autodetail.ru',
            password: demoPassword,
            fullName: 'Иванов Иван Иванович',
            phone: '+7 (999) 123-45-67',
        },
        update: {},
    });
    console.log('Seed completed');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map