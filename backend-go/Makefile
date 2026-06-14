# Playwise Guru — Go backend

DB_URL ?= postgres://playwise:playwise@localhost:5432/playwise_guru?sslmode=disable

.PHONY: dev build run test fmt tidy migrate-up migrate-down migrate-new migrate-mongo sqlc docker-up docker-down

dev:
	go run ./cmd/api

build:
	CGO_ENABLED=0 go build -ldflags="-s -w" -o bin/api ./cmd/api

run: build
	./bin/api

test:
	go test -race -cover ./...

fmt:
	gofmt -s -w .

tidy:
	go mod tidy

# SQL schema migrations (requires: go install github.com/pressly/goose/v3/cmd/goose@latest)
migrate-up:
	goose -dir migrations postgres "$(DB_URL)" up

migrate-down:
	goose -dir migrations postgres "$(DB_URL)" down

migrate-new:
	@read -p "Migration name: " name; goose -dir migrations create $$name sql

# One-shot Mongo → Postgres data import
migrate-mongo:
	go run ./cmd/migrate-mongo

# Optional: generate type-safe queries from queries/*.sql (sqlc)
sqlc:
	sqlc generate

docker-up:
	docker compose up -d

docker-down:
	docker compose down
