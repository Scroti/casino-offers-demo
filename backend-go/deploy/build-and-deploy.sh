#!/usr/bin/env bash
# Build the API and (re)start it as a systemd service.
# Run from /opt/playwise/backend-go as user `playwise` (or via sudo wrapper).

set -euo pipefail

APP_DIR=/opt/playwise
SRC_DIR=${APP_DIR}/backend-go

log() { echo -e "\n\033[1;34m▶ $*\033[0m"; }

log "Compiling api binary"
cd "$SRC_DIR"
export PATH=$PATH:/usr/local/go/bin
CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o "${APP_DIR}/api.new" ./cmd/api

log "Applying DB migrations"
set -a; . "${APP_DIR}/.env"; set +a
goose -dir "${SRC_DIR}/migrations" postgres "$DATABASE_URL" up

log "Swapping in new binary"
mv "${APP_DIR}/api.new" "${APP_DIR}/api"
chown playwise:playwise "${APP_DIR}/api"
chmod 750 "${APP_DIR}/api"

log "Restarting service"
sudo systemctl restart playwise-api
sleep 1
sudo systemctl --no-pager status playwise-api

log "Health check"
curl -fsS http://127.0.0.1:8080/health && echo
