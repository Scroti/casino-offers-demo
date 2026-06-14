# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack casino offers aggregation platform. Frontend: Next.js 16 (canary) with App Router. Backend: NestJS 11 with MongoDB. Multi-language (EN, ES, FR, DE, RO) with IP-based auto-detection.

---

## Commands

### Full Stack

```bash
npm run install:all    # Install all deps (frontend + backend)
npm run dev:all        # Run both frontend and backend concurrently
npm run build:all      # Build both
```

### Frontend (root)

```bash
npm run dev            # Next.js dev server on :3000
npm run build          # Production build
npm run lint           # ESLint
```

### Backend (`server/`)

```bash
cd server
npm run start:dev      # NestJS watch mode on :3003
npm run build          # NestJS production build
npm run test           # Jest unit tests
npm run test:e2e       # End-to-end tests
npm run test:cov       # Coverage report
npm run lint           # ESLint with auto-fix
```

### Docker (full stack with MongoDB)

```bash
docker-compose up      # Starts MongoDB :27017, backend :3003, frontend :3000
```

---

## Architecture

### Frontend (`app/` and `components/`)

**Entry points:**
- `app/layout.tsx` — Root layout. Sets `export const dynamic = 'force-dynamic'` which disables static generation for ALL pages. Wraps everything in `AppWrapper`.
- `app/app-wrapper.component.tsx` — Provider stack: Redux → I18nProvider → AuthProvider → ThemeProvider.

**Routing:**
- `app/(root)/` — Main route group for all user-facing pages (casinos, bonuses, games, guides, news, profile, support).
- `app/login`, `app/signup`, etc. — Auth pages sit outside the `(root)` group.
- `app/admin/` — Admin dashboard, protected by `middleware.ts`.

**State management (Redux Toolkit):**
- Store config: `app/lib/data-access/store/store.config.ts`
- Auth slice: `app/lib/data-access/slices/auth.slice.ts` — stores `accessToken` and `refreshToken` in Redux.
- API configs: `app/lib/data-access/configs/` — one RTK Query `createApi` per resource (casinos, bonuses, games, etc.). All use `credentials: 'include'` and attach `Bearer` token from Redux state.
- Data models: `app/lib/data-access/models/` — TypeScript interfaces for Casino, Bonus, Game, UserProfile.

**i18n:**
- Context: `context/i18n.context.tsx` — provides `t(key)` function and `setLanguage()`.
- On first load, reads `app-language` cookie. If missing, calls `ipinfo.io` to detect country → language. Cookie is set for 365 days.
- Translation files: `lib/i18n/messages/{en,es,fr,de,ro}.json`. Keys are dot-separated (e.g. `t('nav.home')`).
- **Always call `useI18n()` at the top of any component that uses `t()`** — it must be within `I18nProvider`.

**Auth:**
- Context: `context/auth.context.tsx` — wraps user session state.
- Admin protection: `middleware.ts` — manually decodes JWT payload from `accessToken` cookie (no library), checks `payload.role === 'admin'`. Only runs on `/admin/:path*`.

**Component structure:**
- `components/ui/` — shadcn/ui base components (New York style, configured in `components.json`).
- `components/shared/` — Reusable patterns: filters, modals, tables.
- `components/admin/` — Admin-specific components.
- `components/user-homepage/` — Homepage section components.

### Backend (`server/src/`)

NestJS app with URI versioning (`/api/v1/` prefix).

**Module layout:**
- `projects/admin-dashboard/` — Admin modules: bonuses, casinos, games, guides, campaigns, contact, newsletter.
- `projects/playwise-guru/` — Main user-facing modules.
- `projects/health/` — Health check endpoint at `/api/v1/health`.
- `shared/` — Auth strategies (Local, JWT, Google OAuth, Apple OAuth), guards, Swagger config.

**Auth flow:** JWT with refresh tokens. `bcryptjs` for passwords. Passport strategies for social login. Role-based guard checks `role === 'admin'`.

**Email:** SendGrid primary, Nodemailer fallback. Campaign management for newsletters.

**External services:** Google Sheets API (optional content sync), RSS Parser (news), ipinfo.io (geo-detection on frontend).

---

## Key Gotchas

- **`typescript.ignoreBuildErrors: true`** in `next.config.ts` — TypeScript errors do not fail the build. Fix errors but don't rely on build failure to catch them.
- **`images.unoptimized: true`** — Next.js image optimization is disabled. Images load from any domain without caching benefits.
- **`export const dynamic = 'force-dynamic'`** in root layout prevents all static generation/ISR across the app.
- **JWT in middleware** is decoded via raw base64 string split — no signature verification. This means the middleware only checks the payload structure, not authenticity.
- **`forceUpdate`** hack in `I18nProvider` (`const [, forceUpdate] = useState(0)`) is used to force re-renders on language change alongside `setLanguageState`.
- **Auth state is dual-tracked**: tokens are in both Redux (in-memory) and cookies. The middleware reads the cookie; API calls read Redux. They must stay in sync.
- Backend default credentials in `docker-compose.yml` are `admin/admin123` — change before any non-local deployment.
