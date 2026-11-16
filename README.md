# Serwaa

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3010
```

## Scripts

| Command         | What it does                 |
| --------------- | ---------------------------- |
| `npm run dev`   | Start dev server (Turbopack) |
| `npm run build` | Production build             |
| `npm run start` | Serve the production build   |
| `npm run lint`  | Run ESLint                   |

## Structure

- `src/app/` — routes, layouts and pages
- `public/` — static assets
- Import alias: `@/*` → `src/*`
