-- +goose Up
-- +goose StatementBegin

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
    id                                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                                TEXT,
    email                               TEXT NOT NULL UNIQUE,
    password_hash                       TEXT NOT NULL,
    role                                TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    status                              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned', 'pending')),
    profile_image_url                   TEXT,
    refresh_token_hash                  TEXT,
    is_verified                         BOOLEAN NOT NULL DEFAULT FALSE,
    last_login                          TIMESTAMPTZ,
    total_bonuses                       INTEGER NOT NULL DEFAULT 0,
    total_spent                         NUMERIC(12,2) NOT NULL DEFAULT 0,
    country                             TEXT,
    language                            TEXT,
    gender                              TEXT CHECK (gender IN ('male', 'female', 'prefer-not-to-say')),
    age_range                           TEXT,
    password_reset_token                TEXT,
    password_reset_token_expires        TIMESTAMPTZ,
    email_verification_token            TEXT,
    email_verification_token_expires    TIMESTAMPTZ,
    email_verification_code             TEXT,
    email_verification_code_expires     TIMESTAMPTZ,
    created_at                          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX users_email_idx ON users (lower(email));
CREATE INDEX users_role_idx ON users (role);
CREATE INDEX users_password_reset_token_idx ON users (password_reset_token) WHERE password_reset_token IS NOT NULL;
CREATE INDEX users_email_verification_token_idx ON users (email_verification_token) WHERE email_verification_token IS NOT NULL;

-- ── CASINOS ──────────────────────────────────────────────────────────────────
CREATE TABLE casinos (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                            TEXT NOT NULL,
    slug                            TEXT UNIQUE,
    -- General
    founded                         TEXT,
    url                             TEXT,
    facebook                        TEXT,
    advantages                      TEXT[] NOT NULL DEFAULT '{}',
    affiliate_software              TEXT,
    license                         TEXT,
    owner                           TEXT,
    company_address                 TEXT,
    accessibility                   TEXT[] NOT NULL DEFAULT '{}',
    mobile_application              BOOLEAN NOT NULL DEFAULT FALSE,
    site_languages                  TEXT[] NOT NULL DEFAULT '{}',
    currencies                      TEXT[] NOT NULL DEFAULT '{}',
    restricted_countries            TEXT[] NOT NULL DEFAULT '{}',
    available_countries             TEXT[] NOT NULL DEFAULT '{}',
    wagering                        TEXT,
    partners                        TEXT,
    version                         TEXT,
    -- Display
    logo                            TEXT,
    image                           TEXT,
    safety_index                    NUMERIC(4,2),
    country_flag                    TEXT,
    country_code                    TEXT,
    -- Heterogeneous arrays as JSONB (features, available games, payment methods)
    features                        JSONB NOT NULL DEFAULT '[]'::jsonb,
    available_games                 JSONB NOT NULL DEFAULT '[]'::jsonb,
    payment_methods                 JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Games
    game_providers                  TEXT[] NOT NULL DEFAULT '{}',
    games_amount                    TEXT,
    slot_games                      TEXT,
    jackpot_games                   TEXT,
    video_poker_games               TEXT,
    scratch_games                   TEXT,
    bingo_games                     TEXT,
    live_games_amount               TEXT,
    sports_betting                  BOOLEAN NOT NULL DEFAULT FALSE,
    live_betting                    BOOLEAN NOT NULL DEFAULT FALSE,
    virtual_sports_betting          BOOLEAN NOT NULL DEFAULT FALSE,
    -- Payment
    deposit_methods                 TEXT[] NOT NULL DEFAULT '{}',
    withdrawal_methods              TEXT[] NOT NULL DEFAULT '{}',
    minimal_deposit                 TEXT,
    minimal_payout                  TEXT,
    max_withdrawal_limit_per_month  TEXT,
    withdrawal_time                 TEXT,
    withdraw_fees                   TEXT,
    withdraw_with_active_bonus      BOOLEAN NOT NULL DEFAULT FALSE,
    -- Support
    working_hours                   TEXT,
    contact_info                    TEXT,
    live_chat_languages             TEXT[] NOT NULL DEFAULT '{}',
    phone_languages                 TEXT[] NOT NULL DEFAULT '{}',
    email_languages                 TEXT[] NOT NULL DEFAULT '{}',
    average_contact_time            TEXT,
    website_languages               TEXT[] NOT NULL DEFAULT '{}',
    customer_support_languages      TEXT[] NOT NULL DEFAULT '{}',
    -- Bonus display
    bonus_text                      TEXT,
    bonus_subtext                   TEXT,
    is_exclusive                    BOOLEAN NOT NULL DEFAULT FALSE,
    -- Actions
    visit_url                       TEXT,
    review_url                      TEXT,
    created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX casinos_slug_idx ON casinos (slug) WHERE slug IS NOT NULL;
CREATE INDEX casinos_name_idx ON casinos (name);

-- ── BONUSES ──────────────────────────────────────────────────────────────────
CREATE TABLE bonuses (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    casino_id               UUID REFERENCES casinos(id) ON DELETE SET NULL,
    title                   TEXT NOT NULL,
    description             JSONB NOT NULL DEFAULT '{}'::jsonb,
    price                   TEXT NOT NULL,
    rating                  NUMERIC(3,2) NOT NULL DEFAULT 0,
    type                    TEXT NOT NULL,
    image                   TEXT NOT NULL,
    href                    TEXT,
    is_exclusive            BOOLEAN NOT NULL DEFAULT FALSE,
    casino_name             TEXT,
    casino_logo             TEXT,
    casino_image            TEXT,
    safety_index            NUMERIC(4,2),
    country_flag            TEXT,
    country_code            TEXT,
    promo_code              TEXT,
    bonus_instructions      TEXT,
    review_link             TEXT,
    -- Accordion sections (each is {value?, subtitle?, content?})
    wagering_requirement    JSONB NOT NULL DEFAULT '{}'::jsonb,
    bonus_value             JSONB NOT NULL DEFAULT '{}'::jsonb,
    max_bet                 JSONB NOT NULL DEFAULT '{}'::jsonb,
    expiration              JSONB NOT NULL DEFAULT '{}'::jsonb,
    claim_speed             JSONB NOT NULL DEFAULT '{}'::jsonb,
    terms_conditions        JSONB NOT NULL DEFAULT '{}'::jsonb,
    custom_sections         JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX bonuses_casino_id_idx ON bonuses (casino_id);
CREATE INDEX bonuses_type_idx ON bonuses (type);

-- ── GAMES ────────────────────────────────────────────────────────────────────
CREATE TABLE games (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id                     TEXT NOT NULL UNIQUE,
    casino_guru_identifier      TEXT,
    title                       TEXT NOT NULL,
    embed_url                   TEXT,
    thumbnail                   TEXT,
    category                    TEXT NOT NULL,
    description                 TEXT,
    provider                    TEXT NOT NULL,
    is_active                   BOOLEAN NOT NULL DEFAULT TRUE,
    views                       BIGINT NOT NULL DEFAULT 0,
    plays                       BIGINT NOT NULL DEFAULT 0,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX games_category_idx ON games (category);
CREATE INDEX games_provider_idx ON games (provider);
CREATE INDEX games_active_idx ON games (is_active);

-- ── GUIDES ───────────────────────────────────────────────────────────────────
CREATE TABLE guides (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    excerpt             TEXT,
    content             TEXT NOT NULL,
    tags                TEXT[] NOT NULL DEFAULT '{}',
    categories          TEXT[] NOT NULL DEFAULT '{}',
    featured_image      TEXT,
    is_published        BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
    views               BIGINT NOT NULL DEFAULT 0,
    author              TEXT,
    published_at        TIMESTAMPTZ,
    seo_title           TEXT,
    seo_description     TEXT,
    related_guides      TEXT[] NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX guides_slug_idx ON guides (slug);
CREATE INDEX guides_published_idx ON guides (is_published);
CREATE INDEX guides_featured_idx ON guides (is_featured);
CREATE INDEX guides_categories_idx ON guides USING GIN (categories);
CREATE INDEX guides_tags_idx ON guides USING GIN (tags);

-- ── CAMPAIGNS ────────────────────────────────────────────────────────────────
CREATE TABLE campaigns (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token                   TEXT NOT NULL UNIQUE,
    name                    TEXT NOT NULL,
    description             TEXT,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at              TIMESTAMPTZ,
    starts_at               TIMESTAMPTZ,
    click_count             BIGINT NOT NULL DEFAULT 0,
    bonus_access_count      BIGINT NOT NULL DEFAULT 0,
    created_by              TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX campaigns_token_idx ON campaigns (token);
CREATE INDEX campaigns_active_idx ON campaigns (is_active);

-- ── CONTACT MESSAGES ─────────────────────────────────────────────────────────
CREATE TABLE contact_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    email           TEXT NOT NULL,
    subject         TEXT NOT NULL,
    category        TEXT NOT NULL CHECK (category IN ('general', 'technical', 'billing', 'account', 'feedback', 'other')),
    message         TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    is_resolved     BOOLEAN NOT NULL DEFAULT FALSE,
    response        TEXT,
    responded_at    TIMESTAMPTZ,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX contact_messages_read_idx ON contact_messages (is_read);
CREATE INDEX contact_messages_resolved_idx ON contact_messages (is_resolved);
CREATE INDEX contact_messages_created_idx ON contact_messages (created_at DESC);

-- ── NEWSLETTER ───────────────────────────────────────────────────────────────
CREATE TABLE newsletter_subscriptions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT NOT NULL UNIQUE,
    status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX newsletter_status_idx ON newsletter_subscriptions (status);

-- ── ACTIVITY LOG ─────────────────────────────────────────────────────────────
CREATE TABLE activity_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          TEXT NOT NULL,
    category        TEXT NOT NULL,
    metadata        JSONB,
    ip_address      INET,
    user_agent      TEXT,
    path            TEXT,
    method          TEXT,
    status_code     INTEGER,
    duration_ms     INTEGER,
    error           JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX activity_logs_user_created_idx ON activity_logs (user_id, created_at DESC);
CREATE INDEX activity_logs_action_created_idx ON activity_logs (action, created_at DESC);
CREATE INDEX activity_logs_category_created_idx ON activity_logs (category, created_at DESC);
CREATE INDEX activity_logs_created_idx ON activity_logs (created_at DESC);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS newsletter_subscriptions;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS guides;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS bonuses;
DROP TABLE IF EXISTS casinos;
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
