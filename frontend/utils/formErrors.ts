import { ApiError } from '~/composables/useApi'

const FIELD_MESSAGES: Record<string, Record<string, string>> = {
  address: {
    minLength: 'Укажите адрес не короче 5 символов',
    isString: 'Укажите адрес доставки',
  },
  recipientName: {
    minLength: 'ФИО должно быть не короче 2 символов',
    isString: 'Укажите ФИО получателя',
  },
  phone: {
    minLength: 'Телефон должен быть не короче 10 символов',
    isString: 'Укажите телефон',
  },
  email: {
    isEmail: 'Укажите корректный email',
    minLength: 'Email слишком короткий',
  },
  password: {
    minLength: 'Пароль должен быть не короче 6 символов',
  },
  fullName: {
    minLength: 'ФИО должно быть не короче 2 символов',
  },
  name: {
    minLength: 'Название слишком короткое',
  },
  oem: { isString: 'Укажите OEM' },
  sku: { isString: 'Укажите артикул' },
  categoryId: { isString: 'Выберите категорию' },
  price: { min: 'Цена не может быть отрицательной' },
}

function messageForField(field: string, raw: string): string {
  const rules = FIELD_MESSAGES[field]
  if (!rules) return humanizeRawMessage(raw, field)
  if (raw.includes('must be longer') || raw.includes('minLength')) {
    return rules.minLength ?? humanizeRawMessage(raw, field)
  }
  if (raw.includes('must be an email') || raw.includes('isEmail')) {
    return rules.isEmail ?? 'Некорректный email'
  }
  if (raw.includes('must not be less than') || raw.includes('min ')) {
    return rules.min ?? rules.minLength ?? humanizeRawMessage(raw, field)
  }
  return humanizeRawMessage(raw, field)
}

function humanizeRawMessage(raw: string, field: string): string {
  const fieldMatch = raw.match(/^(\w+)\s/)
  const key = fieldMatch?.[1] ?? field
  const labels: Record<string, string> = {
    address: 'адрес',
    recipientName: 'ФИО',
    phone: 'телефон',
    email: 'email',
    password: 'пароль',
    fullName: 'ФИО',
  }
  const label = labels[key] ?? 'поле'
  if (raw.includes('longer than or equal to')) {
    const n = raw.match(/equal to (\d+)/)?.[1]
    return n ? `Поле «${label}» — минимум ${n} символов` : `Проверьте поле «${label}»`
  }
  if (raw.includes('must be an email')) return 'Некорректный email'
  if (raw.includes('should not be empty') || raw.includes('must be a string')) {
    return `Заполните поле «${label}»`
  }
  return 'Проверьте введённые данные'
}

function fieldFromStringMessage(msg: string): string | null {
  const m = msg.match(/^(\w+)\s+(must|should)/i)
  return m?.[1] ?? null
}

export function parseValidationErrors(data: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (!data || typeof data !== 'object') return out

  const payload = data as {
    message?: string | string[] | Array<{ property?: string; constraints?: Record<string, string> }>
  }

  const message = payload.message
  if (!message) return out

  const items = Array.isArray(message) ? message : [message]

  for (const item of items) {
    if (typeof item === 'string') {
      const field = fieldFromStringMessage(item)
      const text = field ? messageForField(field, item) : item
      if (field) out[field] = text
      else out._form = out._form ? `${out._form}. ${text}` : text
      continue
    }
    if (item && typeof item === 'object' && item.property) {
      const field = item.property
      const constraint = item.constraints ? Object.values(item.constraints)[0] : ''
      out[field] = messageForField(field, constraint || `${field} invalid`)
    }
  }

  return out
}

export function applyApiErrorToFields(
  error: unknown,
  target: Record<string, string>,
): boolean {
  if (!(error instanceof ApiError)) return false
  const parsed = parseValidationErrors(error.data)
  Object.keys(target).forEach((k) => delete target[k])
  Object.assign(target, parsed)
  return Object.keys(parsed).length > 0
}

const LOGIN_FAIL_TEXT = 'Неверный логин или пароль'

/** Ошибки входа: 401 — под полем пароля, валидация — по полям. */
export function applyLoginError(error: unknown, target: Record<string, string>): boolean {
  if (!(error instanceof ApiError)) return false

  Object.keys(target).forEach((k) => delete target[k])

  if (error.status === 401) {
    target.password = LOGIN_FAIL_TEXT
    return true
  }

  const parsed = parseValidationErrors(error.data)
  if (Object.keys(parsed).length > 0) {
    Object.assign(target, parsed)
    return true
  }

  if (
    error.message.includes('Неверный') ||
    error.message.includes('Unauthorized') ||
    error.message.toLowerCase().includes('unauthorized')
  ) {
    target.password = LOGIN_FAIL_TEXT
    return true
  }

  return false
}
