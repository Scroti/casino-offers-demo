# Deployment guide — Playwise Guru API on a VPS

Target: Ubuntu 22.04 or 24.04 LTS, Postgres native on host, Caddy in front, Go API as systemd service. **No Docker required.**

## 0. What you need before starting

- ✅ A fresh Ubuntu 22.04/24.04 VPS with SSH access (root or sudo)
- ✅ Public IPv4 address of the VPS
- ✅ Access to playwise.guru DNS records
- ✅ Resend account (you said you have one — domain verification done below)

## 1. DNS setup (do this first — propagation takes minutes)

At your DNS provider, add these records:

| Type  | Name                        | Value                                  |
|-------|-----------------------------|----------------------------------------|
| A     | `api`                       | `<YOUR VPS IPv4>`                      |
| TXT   | _resend                     | (see Resend dashboard — DKIM)           |
| MX    | send                        | feedback-smtp.eu-west-1.amazonses.com  |
| TXT   | send                        | `v=spf1 include:amazonses.com ~all`    |

Exact Resend records appear in your Resend dashboard → Domains → Add `playwise.guru`. They give you a DKIM TXT, an MX, and SPF TXT — copy them as-is.

Verify DNS is live:
```bash
dig +short api.playwise.guru        # should return your VPS IP
dig +short TXT _resend.playwise.guru
```

## 2. Provision the VPS

SSH into the box as root:

```bash
ssh root@<VPS_IP>
```

Copy the provisioning script onto the box and run it:

```bash
# Option A: paste the file content into nano
nano /root/setup-vps.sh    # paste contents of backend-go/deploy/setup-vps.sh
bash /root/setup-vps.sh

# Option B: scp from your machine
# (from your local machine, in casino-offers-demo/)
scp backend-go/deploy/setup-vps.sh root@<VPS_IP>:/root/
ssh root@<VPS_IP> 'bash /root/setup-vps.sh'
```

This installs: Go 1.23, Postgres 16, Caddy, goose, fail2ban, ufw firewall, and creates the `playwise` user + DB + DB password (saved at `/root/.pg_password`).

**Save the DB password from `/root/.pg_password` somewhere safe.**

## 3. Copy source code to the VPS

From your local machine:

```bash
# In the casino-offers-demo/ folder
rsync -av --exclude='bin' --exclude='.env' --exclude='.git' \
    backend-go/ root@<VPS_IP>:/opt/playwise/backend-go/

ssh root@<VPS_IP> 'chown -R playwise:playwise /opt/playwise'
```

## 4. Configure environment

On the VPS:

```bash
ssh root@<VPS_IP>
cp /opt/playwise/backend-go/.env.example /opt/playwise/.env
nano /opt/playwise/.env
```

Fill in:

```env
PORT=8080
ENVIRONMENT=production
APP_NAME=Playwise Guru
FRONTEND_URL=https://playwise.guru
CORS_ORIGINS=https://playwise.guru,https://www.playwise.guru

# Use the password from /root/.pg_password
DATABASE_URL=postgres://playwise:PASTE_PG_PASSWORD@localhost:5432/playwise_guru?sslmode=disable

# Generate with: openssl rand -hex 32
JWT_SECRET=...
JWT_REFRESH_SECRET=...
JWT_EXPIRES=15m
JWT_REFRESH_EXPIRES=168h

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@playwise.guru
SUPPORT_EMAIL=support@playwise.guru

NEWS_API_KEY=
```

Lock it down:

```bash
chown root:playwise /opt/playwise/.env
chmod 640 /opt/playwise/.env
```

## 5. Build, migrate, run

```bash
cd /opt/playwise/backend-go
export PATH=$PATH:/usr/local/go/bin

# Build
CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /opt/playwise/api ./cmd/api
chown playwise:playwise /opt/playwise/api
chmod 750 /opt/playwise/api

# Apply schema
set -a; . /opt/playwise/.env; set +a
goose -dir migrations postgres "$DATABASE_URL" up
```

## 6. Install systemd unit + Caddy config

```bash
# Systemd
cp /opt/playwise/backend-go/deploy/playwise-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now playwise-api
systemctl status playwise-api      # should be "active (running)"

# Caddy
cp /opt/playwise/backend-go/deploy/Caddyfile /etc/caddy/Caddyfile
systemctl reload caddy
journalctl -u caddy -n 30          # check for cert acquisition
```

Caddy will obtain a Let's Encrypt cert automatically the first time it sees a request. Verify:

```bash
curl https://api.playwise.guru/health
# → {"status":"ok","db":"up","time":"..."}
```

## 7. Migrate data from Mongo

On the VPS (or anywhere with network access to both DBs):

```bash
cd /opt/playwise/backend-go
export MONGO_URI='mongodb://USER:PASS@eebad1d0-0f4f-4830-bcc9-fce11519f885.nam5.firestore.goog:443/casino-offers-dev?loadBalanced=true&tls=true&authMechanism=SCRAM-SHA-256&retryWrites=false'
export MONGO_DB_NAME='casino-offers-dev'
export DATABASE_URL='postgres://playwise:PASTE_PG_PASSWORD@localhost:5432/playwise_guru?sslmode=disable'

/usr/local/go/bin/go run ./cmd/migrate-mongo
```

Verify:

```bash
sudo -u postgres psql -d playwise_guru -c "
SELECT
  (SELECT COUNT(*) FROM users)     AS users,
  (SELECT COUNT(*) FROM casinos)   AS casinos,
  (SELECT COUNT(*) FROM bonuses)   AS bonuses,
  (SELECT COUNT(*) FROM games)     AS games,
  (SELECT COUNT(*) FROM guides)    AS guides,
  (SELECT COUNT(*) FROM campaigns) AS campaigns;"
```

## 8. Point the frontend at the new API

In your Next.js `.env.production` (or Vercel env vars):

```env
NEXT_PUBLIC_API_URL=https://api.playwise.guru/api/v1
```

Redeploy Next.js. Done.

## 9. Updates / redeploys

After making code changes locally:

```bash
# From your local machine
rsync -av --exclude='bin' --exclude='.env' --exclude='.git' \
    backend-go/ root@<VPS_IP>:/opt/playwise/backend-go/

# On the VPS
ssh playwise@<VPS_IP> 'bash /opt/playwise/backend-go/deploy/build-and-deploy.sh'
```

The script builds the new binary, runs migrations, swaps it in, and restarts the service. Caddy keeps running.

## Operational

```bash
# Tail API logs
journalctl -u playwise-api -f

# Tail Caddy access logs
tail -f /var/log/caddy/api.access.log

# Restart manually
sudo systemctl restart playwise-api

# Postgres CLI
sudo -u postgres psql -d playwise_guru
```

## Backups (recommended)

Add a daily cron on the VPS:

```bash
# /etc/cron.daily/playwise-db-backup
#!/bin/bash
mkdir -p /var/backups/postgres
sudo -u postgres pg_dump playwise_guru | gzip > /var/backups/postgres/playwise_guru-$(date +%F).sql.gz
find /var/backups/postgres -type f -mtime +14 -delete
```

Then `chmod +x /etc/cron.daily/playwise-db-backup`. For off-site, rclone to S3/Backblaze.

## Troubleshooting

| Symptom                                | Fix                                                                                          |
|----------------------------------------|----------------------------------------------------------------------------------------------|
| Caddy can't get cert                   | Check DNS A record points to VPS IP. Port 80 reachable. `journalctl -u caddy -n 100`         |
| API exits with "JWT_SECRET required"   | Missing env var. Check `/opt/playwise/.env` and permissions.                                  |
| 502 from Caddy                         | API not running. `systemctl status playwise-api` + journal.                                   |
| DB connection refused                  | Postgres not listening on localhost — check `/etc/postgresql/16/main/postgresql.conf`         |
| Emails not arriving                    | Domain not verified in Resend. Check Resend → Domains → status.                              |
