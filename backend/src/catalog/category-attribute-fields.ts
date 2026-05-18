/** Поля attributes по категории (кроме brand, inStock, price — они в основной форме). */
export const categoryAttributeFields: Record<
  string,
  Array<{ key: string; label: string; type: 'select' | 'text'; options?: { label: string; value: string }[] }>
> = {
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
}

export function buildProductAttributes(
  categoryId: string,
  brand: string,
  price: number,
  inStock: boolean,
  extra: Record<string, string | number | boolean>,
) {
  return {
    brand,
    inStock,
    price,
    ...extra,
  }
}
