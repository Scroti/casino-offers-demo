# Playwise Guru — Go API

Go 1.23 backend for Playwise Guru. Replaces the previous NestJS server with a leaner, single-binary stack:

| Layer       | Tool                              |
|-------------|-----------------------------------|
| Router      | `chi/v5` + stdlib `net/http`      |
| DB          | Postgres 16 + `pgx/v5`            |
| Migrations  | `goose` (SQL files)               |
| Auth        | `golang-jwt/v5` + bcrypt          |
| Email       | **Resend** (`resend-go/v2`)       |
| News        | RSS (`gofeed`) + NewsAPI + 15min in-memory cache |
| Config      | `envconfig` (struct-tagged env)   |
| Logging     | `slog` (stdlib, JSON)             |
| Validation  | `go-playground/validator/v10`     |

## Quick start (local dev)

```bash
# 1. Install tools (one time)
go install github.com/pressly/goose/v3/cmd/goose@latest

# 2. Spin up Postgres
make docker-up

# 3. Configure env
cp .env.example .env
# edit JWT_SECRET, JWT_REFRESH_SECRET, RESEND_API_KEY, EMAIL_FROM

# 4. Apply schema
make migrate-up

# 5. Run
make dev
```

Server lives at `http://localhost:8080`. Health check at `/health`.

## API map

All endpoints are versioned under `/api/v1`.

### Public

```
POST   /auth/signup
POST   /auth/login
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
POST   /auth/verify-email
POST   /auth/resend-verification

GET    /casinos
GET    /casinos/{id}

GET    /bonuses
GET    /bonuses/casino/{casinoId}
GET    /bonuses/{id}

GET    /games
GET    /games/active
GET    /games/{id}
GET    /games/gameId/{gameId}
POST   /games/{id}/increment-views
POST   /games/{id}/increment-plays

GET    /guides              ?published=true
GET    /guides/featured
GET    /guides/category/{category}
GET    /guides/slug/{slug}
GET    /guides/{id}
POST   /guides/{id}/view

GET    /campaigns/validate  ?token=XYZ

POST   /contact             # optional auth — user_id attached if logged in

POST   /newsletter/subscribe
POST   /newsletter/unsubscribe
POST   /newsletter/check

GET    /news                ?country=US&limit=20
```

### Authenticated (any role)

```
GET    /auth/me
POST   /auth/logout
PATCH  /auth/profile
```

### Admin + moderator

```
GET    /users
GET    /users/{id}
PATCH  /users/{id}/status
PATCH  /users/{id}/verify
POST   /users/bulk-status
```

### Admin only

```
POST   /users
DELETE /users/{id}
PATCH  /users/{id}/role
POST   /users/{id}/email
POST   /users/bulk-delete

POST/PATCH/DELETE  /casinos
POST/PATCH/DELETE  /bonuses
POST/PATCH/DELETE  /games  (+ POST /games/seed)
POST/PATCH/DELETE  /guides
GET/POST/PATCH/DELETE /campaigns
GET/PATCH /contact (read & resolve)
```

## Project layout

```
cmd/
  api/                  # HTTP server entry point
  migrate-mongo/        # Mongo → Postgres one-shot data migration
internal/
  config/               # envconfig-typed config
  server/               # chi router + middleware + route wiring
  handlers/             # one file per resource — HTTP-layer only
  services/             # business logic (errors, RBAC checks, etc)
  repository/           # pgx queries (one file per resource)
  models/               # JSON-tagged domain types
  auth/                 # JWT sign/parse + middleware + bcrypt + token helpers
  email/                # Resend client + HTML templates
migrations/             # goose SQL schema migrations
queries/                # sqlc-ready query files (optional, not used yet)
```

## Migrating data from Mongo

Once Postgres is up and migrations applied, run the one-shot importer.
It's **idempotent** — safe to re-run; ObjectIDs deterministically map to UUIDs
so cross-collection refs (bonus → casino) survive multiple passes.

```bash
# .env or shell:
export MONGO_URI="mongodb://user:pass@HOST/?loadBalanced=true&tls=true&authMechanism=SCRAM-SHA-256&retryWrites=false"
export MONGO_DB_NAME="casino-offers-dev"
export DATABASE_URL="postgres://playwise:playwise@localhost:5432/playwise_guru?sslmode=disable"

make migrate-mongo
```

What gets migrated, in order:
`users → casinos → bonuses → games → guides → campaigns → contacts → newsletter`.

If a row fails, the importer logs and continues. After it finishes, verify counts:

```bash
psql "$DATABASE_URL" -c "SELECT
  (SELECT COUNT(*) FROM users)     AS users,
  (SELECT COUNT(*) FROM casinos)   AS casinos,
  (SELECT COUNT(*) FROM bonuses)   AS bonuses,
  (SELECT COUNT(*) FROM games)     AS games,
  (SELECT COUNT(*) FROM guides)    AS guides,
  (SELECT COUNT(*) FROM campaigns) AS campaigns;"
```

## Deploying to your VPS

1. Build & push the image, or build on the box directly:

```bash
docker compose up -d --build
```

2. Add a reverse proxy (Caddy/Nginx) terminating TLS in front of `:8080`.
3. Point `DATABASE_URL` at your prod Postgres and pre-create the DB.
4. Run `make migrate-up` once after deploy to apply the schema.
5. Run `make migrate-mongo` once with `MONGO_URI` pointing at the old prod Mongo to seed data, then disable that step.

## Adding a new resource

1. New migration: `make migrate-new` → fill in the `CREATE TABLE`.
2. `internal/models/<resource>.go` — JSON-tagged struct.
3. `internal/repository/<resource>.go` — pgx CRUD.
4. `internal/services/<resource>.go` — business logic.
5. `internal/handlers/<resource>.go` — HTTP layer.
6. Wire route in `internal/server/server.go`.

## Required env vars

See `.env.example`. Required at startup: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`.
