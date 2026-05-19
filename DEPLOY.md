# Auto Market deployment

## Stack

- Frontend: Nuxt 3
- Backend: NestJS + Prisma
- Database: PostgreSQL
- Runtime: Docker Compose

## Server layout

Project path on the server:

```bash
/web/auto-market
```

Recommended external ports:

```bash
frontend: 3005
backend: 3105
postgres: 3205
```

## Server launch

Create `.env` from the example:

```bash
cp .env.example .env
```

Then start the stack:

```bash
docker-compose -f docker-compose.server.yml up -d --build
```

## Checks

```bash
docker-compose -f docker-compose.server.yml ps
docker-compose -f docker-compose.server.yml logs -f frontend
docker-compose -f docker-compose.server.yml logs -f backend
curl -I http://127.0.0.1:${FRONTEND_PORT}
curl http://127.0.0.1:${BACKEND_PORT}/api/catalog/categories
```
