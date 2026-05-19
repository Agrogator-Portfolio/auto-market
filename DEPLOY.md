# Деплой на сервер

## Симптомы неверной конфигурации

| Проблема | Причина |
|----------|---------|
| Логин/регистрация не работают, в Network нет запроса на ваш сервер | В сборке фронта зашит `http://localhost:3001/api` — браузер бьёт в localhost пользователя |
| Каталог пустой при первом заходе, после F5 ок | SSR не достучался до API; клиент при перезагрузке подхватывает другой URL |
| «Товар не найден» при существующем товаре | SSR вернул 404, страница упала до клиентского запроса |

## Рекомендуемая схема (один домен)

```
Браузер  →  https://shop.example.com/api/*  →  NestJS :3001
         →  https://shop.example.com/*     →  Nuxt :3000
```

### Nginx (пример)

```nginx
server {
    listen 443 ssl;
    server_name shop.example.com;

    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### Переменные окружения

**Backend** (`docker-compose` или `.env`):

```env
CORS_ORIGIN=https://shop.example.com
JWT_SECRET=длинный-секрет
```

Если API и фронт на **одном домене** через `/api`, CORS не обязателен для браузера.

**Frontend** (при сборке и при запуске контейнера):

```env
NUXT_PUBLIC_API_BASE=/api
NUXT_API_BASE=http://127.0.0.1:3001/api
NUXT_API_PROXY_TARGET=http://127.0.0.1:3001
```

- `NUXT_PUBLIC_API_BASE` — что видит **браузер** (`/api` или `https://shop.example.com/api`).
- `NUXT_API_BASE` — куда ходит **SSR** (прямо на NestJS, без nginx).
- `NUXT_API_PROXY_TARGET` — куда Nitro проксирует `/api`, если nginx не настроен.

### Docker Compose на сервере

```bash
CORS_ORIGIN=https://ваш-домен.ru NUXT_PUBLIC_API_BASE=/api docker compose up --build -d
```

После изменения `NUXT_PUBLIC_API_BASE` **пересоберите** образ frontend:

```bash
docker compose build frontend --no-cache
docker compose up -d frontend
```

## Отдельный поддомен API

```env
NUXT_PUBLIC_API_BASE=https://api.example.com/api
NUXT_API_BASE=https://api.example.com/api
CORS_ORIGIN=https://shop.example.com
```

## Проверка

```bash
curl -s https://ваш-домен/api/catalog/categories
curl -s -X POST https://ваш-домен/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@autodetail.ru","password":"demo12345"}'
```

В браузере (DevTools → Network) при логине должен быть запрос на **ваш домен**, не на `localhost`.
