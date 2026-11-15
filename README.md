# Syntecxhub Project 2 — Product & SKU Inventory Management

Standalone enterprise Product Catalog & Inventory Control full-stack platform with Table & Card views (Project 2).

Built with **Nuxt 4 (Vue 3 Composition API, Strict TypeScript, Tailwind CSS, Pinia, VueUse, Lucide Icons, Zod)** on the frontend and **NestJS + MongoDB (Mongoose) + Swagger/OpenAPI** on the backend.

## Structure

- `frontend/` — Complete Nuxt 4 SSR application (`app/pages/`, `app/components/`, `app/layouts/`, `app/composables/`, `app/stores/`, `app/middleware/`, `app/plugins/`, `shared/`, `server/`).
- `backend/` — Complete NestJS application (`src/products/`, `src/dashboard/`, `src/common/`, `src/config/`, `src/seed/`).
- `postman/` — Postman API collection for this project.
- `docker-compose.yml` — Container orchestration for MongoDB (`syntecxhub_products_db`), NestJS Backend (`:4000`), and Nuxt 4 Frontend (`:3000`).
- `.env.example` — Environment configuration template.

## Quick Start

```bash
# Option A: Run with Docker Compose
docker compose up --build -d

# Option B: Run Locally
cd backend
cp .env.example .env
npm install
npm run seed
npm run start:dev

# In a second terminal:
cd frontend
cp .env.example .env
npm install
npm run dev
```

- **Frontend UI**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000/api`
- **Swagger OpenAPI UI**: `http://localhost:4000/api/docs`
