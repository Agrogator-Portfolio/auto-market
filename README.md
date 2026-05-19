# АвтоДеталь — магазин автозапчастей

**Полное описание проекта для диплома / ИИ:** см. [README_DIPLOMA.md](./README_DIPLOMA.md) (архитектура, модули, страницы, API, диаграммы).

**Деплой на сервер (nginx, env, типичные ошибки):** [DEPLOY.md](./DEPLOY.md).

## Запуск через Docker (рекомендуется)

```bash
docker compose up --build
```

Если появляется ошибка `project name must not be empty` (часто из‑за кириллицы в пути к папке), в `docker-compose.yml` уже задано имя `autodetail`. Альтернатива:

```bash
docker compose -p autodetail up --build
```

После старта:

| Сервис   | URL                        |
|----------|----------------------------|
| Фронтенд | http://localhost:3000      |
| API      | http://localhost:3001/api  |
| Postgres | localhost:5432             |

Сиды выполняются один раз: если в БД уже есть товары, повторно не дублируются.

**Демо-аккаунты:** покупатель `demo@autodetail.ru` / `demo12345`, админ `admin@admin.ru` / `test_test`

## Локальная разработка

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

### Frontend

```bash
cd frontend
# NUXT_PUBLIC_API_BASE=http://localhost:3001/api
npm install
npm run dev
```

## API (кратко)

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/catalog/categories`, `GET /api/catalog/products`, `GET /api/catalog/products/:id`
- `GET|POST|PATCH|DELETE /api/cart` (JWT)
- `GET|POST /api/orders`, `GET /api/orders/:id` (JWT)
- `PATCH /api/admin/orders/:id/status` — смена статуса (на фронте пока не подключено)
- `GET|PATCH /api/users/profile` (JWT)
