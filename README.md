# GCC | Programador de Despachos

MVP para programar despachos (React + Express + MongoDB).

## Requisitos

- Node.js >= 20
- pnpm
- MongoDB Atlas (URI con nombre de DB `gcc_despachos`)

## Setup

```bash
cp .env.example .env   # solo completa MONGODB_URI
pnpm i
```

Un solo `.env` en la raíz (API y web lo leen). Puertos por defecto (si están ocupados, no se mata ningún proceso):

- API: `3017`
- Web: `5177`

## Desarrollo

```bash
pnpm dev
# o por separado:
pnpm dev:api
pnpm dev:web
```

- Web: http://localhost:5177
- API health: http://localhost:3017/health

## Pruebas

```bash
pnpm test      # unitarias API (+ smoke Atlas)
pnpm test:e2e  # Playwright (API :3017 y web :5177 levantados)
```
