-- Examples for when you switch from hand-written pgx (internal/repository/)
-- to sqlc-generated code. Run `make sqlc` to regenerate
-- internal/repository/sqlc/ from these files.

-- name: ListCasinos :many
SELECT id, name, slug, logo, safety_score, created_at, updated_at
FROM casinos
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: GetCasino :one
SELECT id, name, slug, logo, safety_score, created_at, updated_at
FROM casinos
WHERE id = $1;

-- name: GetCasinoBySlug :one
SELECT id, name, slug, logo, safety_score, created_at, updated_at
FROM casinos
WHERE slug = $1;

-- name: CreateCasino :one
INSERT INTO casinos (name, slug, logo, safety_score)
VALUES ($1, $2, $3, $4)
RETURNING id, name, slug, logo, safety_score, created_at, updated_at;

-- name: UpdateCasino :one
UPDATE casinos
SET name = $2, slug = $3, logo = $4, safety_score = $5, updated_at = NOW()
WHERE id = $1
RETURNING id, name, slug, logo, safety_score, created_at, updated_at;

-- name: DeleteCasino :exec
DELETE FROM casinos WHERE id = $1;
