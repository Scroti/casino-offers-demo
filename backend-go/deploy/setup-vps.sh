#!/usr/bin/env bash
# Initial VPS provisioning for Playwise Guru API.
# Run ONCE on a fresh Ubuntu 22.04 or 24.04 box, as root or via sudo.
#
#   curl -fsSL https://raw.githubusercontent.com/.../setup-vps.sh | sudo bash
# Or: scp this file to the box and run `sudo bash setup-vps.sh`.

set -euo pipefail

APP_USER=${APP_USER:-playwise}
APP_DIR=${APP_DIR:-/opt/playwise}
PG_DB=${PG_DB:-playwise_guru}
PG_USER=${PG_USER:-playwise}
GO_VERSION=${GO_VERSION:-1.23.4}

log() { echo -e "\n\033[1;34m▶ $*\033[0m"; }

log "Updating system packages"
apt-get update -y
apt-get upgrade -y

log "Installing core tools"
apt-get install -y --no-install-recommends \
    curl wget git unzip ufw fail2ban ca-certificates \
    build-essential gnupg lsb-release

log "Installing Go ${GO_VERSION}"
if ! command -v go >/dev/null 2>&1; then
    cd /tmp
    wget -q "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz"
    rm -rf /usr/local/go
    tar -C /usr/local -xzf "go${GO_VERSION}.linux-amd64.tar.gz"
    rm "go${GO_VERSION}.linux-amd64.tar.gz"
    echo 'export PATH=$PATH:/usr/local/go/bin' > /etc/profile.d/go.sh
    chmod +x /etc/profile.d/go.sh
fi
export PATH=$PATH:/usr/local/go/bin

log "Installing Postgres 16"
install -d /usr/share/postgresql-common/pgdg
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
    | gpg --dearmor -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.gpg
echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.gpg] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
    > /etc/apt/sources.list.d/pgdg.list
apt-get update -y
apt-get install -y postgresql-16 postgresql-client-16
systemctl enable --now postgresql

log "Installing Caddy (reverse proxy + auto-TLS)"
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    | tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
apt-get update -y
apt-get install -y caddy
systemctl enable caddy

log "Installing goose (DB migration tool)"
GOBIN=/usr/local/bin go install github.com/pressly/goose/v3/cmd/goose@latest

log "Creating app user '${APP_USER}'"
if ! id "${APP_USER}" &>/dev/null; then
    useradd -m -s /bin/bash "${APP_USER}"
fi
install -d -o "${APP_USER}" -g "${APP_USER}" "${APP_DIR}"

log "Configuring Postgres database and role"
PG_PASSWORD=$(openssl rand -base64 32 | tr -d '+/=' | cut -c1-32)
sudo -u postgres psql <<SQL
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${PG_USER}') THEN
        CREATE ROLE ${PG_USER} WITH LOGIN PASSWORD '${PG_PASSWORD}';
    ELSE
        ALTER ROLE ${PG_USER} WITH PASSWORD '${PG_PASSWORD}';
    END IF;
END
\$\$;
SQL
sudo -u postgres psql <<SQL
SELECT 'CREATE DATABASE ${PG_DB} OWNER ${PG_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${PG_DB}')
\gexec
SQL
echo "${PG_PASSWORD}" > /root/.pg_password
chmod 600 /root/.pg_password

log "Hardening Postgres (local connections only)"
PG_CONF=/etc/postgresql/16/main/postgresql.conf
sed -i "s/^#listen_addresses = .*/listen_addresses = 'localhost'/" "$PG_CONF" || true
systemctl restart postgresql

log "Configuring firewall (allow SSH + HTTP + HTTPS)"
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

log "Enabling fail2ban"
systemctl enable --now fail2ban

cat <<EOF


  ✅ VPS provisioning complete.

  Postgres password stored at: /root/.pg_password
    (Save it now and put it into /opt/playwise/.env later.)

  Next steps:
    1. Copy the backend-go/ source onto this server into ${APP_DIR}/backend-go/
       (rsync or git clone — example below).

    2. Create ${APP_DIR}/.env from .env.example and fill it in.
       DATABASE_URL=postgres://${PG_USER}:\$(cat /root/.pg_password)@localhost:5432/${PG_DB}?sslmode=disable

    3. Build the binary:
       cd ${APP_DIR}/backend-go && /usr/local/go/bin/go build -o /opt/playwise/api ./cmd/api

    4. Apply schema:
       cd ${APP_DIR}/backend-go && goose -dir migrations postgres "\$DATABASE_URL" up

    5. Install systemd unit + Caddyfile (see DEPLOY.md).

EOF
