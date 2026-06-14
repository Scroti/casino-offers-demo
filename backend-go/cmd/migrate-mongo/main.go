// Mongo → Postgres one-shot data migration.
//
//   MONGO_URI=mongodb://... MONGO_DB_NAME=casino-offers-dev \
//   DATABASE_URL=postgres://... \
//   go run ./cmd/migrate-mongo
//
// Idempotent: re-running upserts by stable keys (email, slug, game_id).
// ObjectID → UUID is deterministic (sha1 of the 12-byte ObjectID), so cross-
// collection references survive a re-run.
package main

import (
	"context"
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kelseyhightower/envconfig"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type cfg struct {
	MongoURI    string `envconfig:"MONGO_URI" required:"true"`
	MongoDBName string `envconfig:"MONGO_DB_NAME" default:"casino-offers-dev"`
	DatabaseURL string `envconfig:"DATABASE_URL" required:"true"`
}

func main() {
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, nil)))

	var c cfg
	if err := envconfig.Process("", &c); err != nil {
		fatal("config", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Minute)
	defer cancel()

	mongoClient, err := mongo.Connect(ctx, options.Client().ApplyURI(c.MongoURI))
	if err != nil {
		fatal("mongo connect", err)
	}
	defer mongoClient.Disconnect(ctx)

	pg, err := pgxpool.New(ctx, c.DatabaseURL)
	if err != nil {
		fatal("postgres connect", err)
	}
	defer pg.Close()

	db := mongoClient.Database(c.MongoDBName)

	// Print which collections actually exist + their counts. Helps debug
	// when migration runs find non-empty collections that we didn't expect
	// (Mongoose pluralization sometimes produces singular collection names).
	if names, err := db.ListCollectionNames(ctx, bson.M{}); err == nil {
		for _, n := range names {
			count, _ := db.Collection(n).CountDocuments(ctx, bson.M{})
			slog.Info("mongo collection", "name", n, "count", count)
		}
	}

	slog.Info("starting migration", "mongoDb", c.MongoDBName)

	migrateUsers(ctx, db, pg)
	migrateCasinos(ctx, db, pg)
	migrateBonuses(ctx, db, pg)
	migrateGames(ctx, db, pg)
	migrateGuides(ctx, db, pg)
	migrateCampaigns(ctx, db, pg)
	migrateContacts(ctx, db, pg)
	migrateNewsletter(ctx, db, pg)

	slog.Info("migration complete")
}

// pickCollection returns a cursor over the first collection (in order) that
// exists and has documents. Handles Mongoose pluralization quirks where some
// collections end up singular (e.g. "bonus" instead of "bonuses").
func pickCollection(ctx context.Context, db *mongo.Database, candidates ...string) (*mongo.Cursor, string, error) {
	for _, name := range candidates {
		count, err := db.Collection(name).CountDocuments(ctx, bson.M{})
		if err != nil || count == 0 {
			continue
		}
		cur, err := db.Collection(name).Find(ctx, bson.M{})
		if err != nil {
			continue
		}
		return cur, name, nil
	}
	// Fall back to the first candidate even if empty so callers don't crash.
	cur, err := db.Collection(candidates[0]).Find(ctx, bson.M{})
	return cur, candidates[0], err
}

// objectIDToUUID derives a deterministic UUID from a Mongo ObjectID so we can
// re-run the migration and have foreign-key references stay consistent.
func objectIDToUUID(oid primitive.ObjectID) uuid.UUID {
	sum := sha1.Sum(oid[:])
	var u uuid.UUID
	copy(u[:], sum[:16])
	u[6] = (u[6] & 0x0f) | 0x40 // version 4
	u[8] = (u[8] & 0x3f) | 0x80 // variant RFC4122
	return u
}

func anyToUUID(v any) (uuid.UUID, bool) {
	switch x := v.(type) {
	case primitive.ObjectID:
		return objectIDToUUID(x), true
	case string:
		if oid, err := primitive.ObjectIDFromHex(x); err == nil {
			return objectIDToUUID(oid), true
		}
		if u, err := uuid.Parse(x); err == nil {
			return u, true
		}
	}
	return uuid.Nil, false
}

// ── USERS ────────────────────────────────────────────────────────────────────

func migrateUsers(ctx context.Context, db *mongo.Database, pg *pgxpool.Pool) {
	cur, name, err := pickCollection(ctx, db, "users", "user")
	if err != nil {
		slog.Warn("users collection", "err", err)
		return
	}
	defer cur.Close(ctx)
	slog.Info("users source", "collection", name)

	count := 0
	for cur.Next(ctx) {
		var d bson.M
		if err := cur.Decode(&d); err != nil {
			continue
		}
		oid, _ := d["_id"].(primitive.ObjectID)
		id := objectIDToUUID(oid)

		_, err := pg.Exec(ctx, `
INSERT INTO users (id, name, email, password_hash, role, status, profile_image_url,
    is_verified, last_login, country, language, created_at, updated_at)
VALUES ($1,$2,$3,$4,COALESCE($5,'user'),COALESCE($6,'active'),$7,COALESCE($8,FALSE),$9,$10,$11,COALESCE($12,NOW()),COALESCE($13,NOW()))
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    is_verified = EXCLUDED.is_verified,
    updated_at = NOW()`,
			id, getStr(d, "name"), getStr(d, "email"), getStr(d, "passwordHash"),
			getStr(d, "role"), getStr(d, "status"), getStr(d, "profileImageUrl"),
			getBool(d, "isVerified"), getTime(d, "lastLogin"),
			getStr(d, "country"), getStr(d, "language"),
			getTime(d, "createdAt"), getTime(d, "updatedAt"),
		)
		if err != nil {
			slog.Warn("user insert", "email", d["email"], "err", err)
			continue
		}
		count++
	}
	slog.Info("users migrated", "count", count)
}

// ── CASINOS ──────────────────────────────────────────────────────────────────

func migrateCasinos(ctx context.Context, db *mongo.Database, pg *pgxpool.Pool) {
	cur, name, err := pickCollection(ctx, db, "casinos", "casino")
	if err != nil {
		slog.Warn("casinos collection", "err", err)
		return
	}
	defer cur.Close(ctx)
	slog.Info("casinos source", "collection", name)

	count := 0
	for cur.Next(ctx) {
		var d bson.M
		if err := cur.Decode(&d); err != nil {
			continue
		}
		oid, _ := d["_id"].(primitive.ObjectID)
		id := objectIDToUUID(oid)

		features := jsonOrEmptyArray(d["features"])
		availableGames := jsonOrEmptyArray(d["availableGames"])
		paymentMethods := jsonOrEmptyArray(d["paymentMethods"])

		_, err := pg.Exec(ctx, `
INSERT INTO casinos (
    id, name, founded, url, facebook, advantages, affiliate_software, license, owner,
    company_address, accessibility, mobile_application, site_languages, currencies,
    restricted_countries, available_countries, wagering, partners, version,
    logo, image, safety_index, country_flag, country_code,
    features, available_games, payment_methods,
    game_providers, games_amount, slot_games, jackpot_games, video_poker_games,
    scratch_games, bingo_games, live_games_amount, sports_betting, live_betting,
    virtual_sports_betting, deposit_methods, withdrawal_methods, minimal_deposit,
    minimal_payout, max_withdrawal_limit_per_month, withdrawal_time, withdraw_fees,
    withdraw_with_active_bonus, working_hours, contact_info, live_chat_languages,
    phone_languages, email_languages, average_contact_time, website_languages,
    customer_support_languages, bonus_text, bonus_subtext, is_exclusive,
    visit_url, review_url, created_at, updated_at
) VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,COALESCE($12,FALSE),$13,$14,$15,$16,$17,$18,$19,
    $20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,COALESCE($36,FALSE),
    COALESCE($37,FALSE),COALESCE($38,FALSE),$39,$40,$41,$42,$43,$44,$45,COALESCE($46,FALSE),
    $47,$48,$49,$50,$51,$52,$53,$54,$55,$56,COALESCE($57,FALSE),$58,$59,COALESCE($60,NOW()),COALESCE($61,NOW())
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()`,
			id, getStr(d, "name"), getStr(d, "founded"), getStr(d, "url"), getStr(d, "facebook"),
			getStrArray(d, "advantages"), getStr(d, "affiliateSoftware"), getStr(d, "license"), getStr(d, "owner"),
			getStr(d, "companyAddress"), getStrArray(d, "accessibility"), getBool(d, "mobileApplication"),
			getStrArray(d, "siteLanguages"), getStrArray(d, "currencies"), getStrArray(d, "restrictedCountries"),
			getStrArray(d, "availableCountries"), getStr(d, "wagering"), getStr(d, "partners"), getStr(d, "version"),
			getStr(d, "logo"), getStr(d, "image"), getFloat(d, "safetyIndex"), getStr(d, "countryFlag"), getStr(d, "countryCode"),
			features, availableGames, paymentMethods,
			getStrArray(d, "gameProviders"), getStr(d, "gamesAmount"), getStr(d, "slotGames"), getStr(d, "jackpotGames"),
			getStr(d, "videoPokerGames"), getStr(d, "scratchGames"), getStr(d, "bingoGames"), getStr(d, "liveGamesAmount"),
			getBool(d, "sportsBetting"), getBool(d, "liveBetting"), getBool(d, "virtualSportsBetting"),
			getStrArray(d, "depositMethods"), getStrArray(d, "withdrawalMethods"), getStr(d, "minimalDeposit"),
			getStr(d, "minimalPayout"), getStr(d, "maxWithdrawalLimitPerMonth"), getStr(d, "withdrawalTime"),
			getStr(d, "withdrawFees"), getBool(d, "withdrawWithActiveBonus"),
			getStr(d, "workingHours"), getStr(d, "contactInfo"), getStrArray(d, "liveChatLanguages"),
			getStrArray(d, "phoneLanguages"), getStrArray(d, "emailLanguages"), getStr(d, "averageContactTime"),
			getStrArray(d, "websiteLanguages"), getStrArray(d, "customerSupportLanguages"),
			getStr(d, "bonusText"), getStr(d, "bonusSubtext"), getBool(d, "isExclusive"),
			getStr(d, "visitUrl"), getStr(d, "reviewUrl"),
			getTime(d, "createdAt"), getTime(d, "updatedAt"),
		)
		if err != nil {
			slog.Warn("casino insert", "name", d["name"], "err", err)
			continue
		}
		count++
	}
	slog.Info("casinos migrated", "count", count)
}

// ── BONUSES ──────────────────────────────────────────────────────────────────

func migrateBonuses(ctx context.Context, db *mongo.Database, pg *pgxpool.Pool) {
	cur, name, err := pickCollection(ctx, db, "bonuses", "bonus")
	if err != nil {
		slog.Warn("bonuses collection", "err", err)
		return
	}
	defer cur.Close(ctx)
	slog.Info("bonuses source", "collection", name)

	count := 0
	for cur.Next(ctx) {
		var d bson.M
		if err := cur.Decode(&d); err != nil {
			continue
		}
		oid, _ := d["_id"].(primitive.ObjectID)
		id := objectIDToUUID(oid)

		var casinoID any
		if cid, ok := anyToUUID(d["casino"]); ok {
			casinoID = cid
		}

		_, err := pg.Exec(ctx, `
INSERT INTO bonuses (id, casino_id, title, description, price, rating, type, image, href, is_exclusive,
    casino_name, casino_logo, casino_image, safety_index, country_flag, country_code,
    promo_code, bonus_instructions, review_link,
    wagering_requirement, bonus_value, max_bet, expiration, claim_speed, terms_conditions,
    custom_sections, created_at, updated_at)
VALUES ($1,$2,$3,$4,$5,COALESCE($6,0),$7,$8,$9,COALESCE($10,FALSE),
    $11,$12,$13,$14,$15,$16,$17,$18,$19,
    $20,$21,$22,$23,$24,$25,$26,COALESCE($27,NOW()),COALESCE($28,NOW()))
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, updated_at = NOW()`,
			id, casinoID, getStr(d, "title"), jsonOrEmptyObject(d["description"]),
			getStr(d, "price"), getFloat(d, "rating"), getStr(d, "type"), getStr(d, "image"), getStr(d, "href"),
			getBool(d, "isExclusive"),
			getStr(d, "casinoName"), getStr(d, "casinoLogo"), getStr(d, "casinoImage"),
			getFloat(d, "safetyIndex"), getStr(d, "countryFlag"), getStr(d, "countryCode"),
			getStr(d, "promoCode"), getStr(d, "bonusInstructions"), getStr(d, "reviewLink"),
			jsonOrEmptyObject(d["wageringRequirement"]), jsonOrEmptyObject(d["bonusValue"]),
			jsonOrEmptyObject(d["maxBet"]), jsonOrEmptyObject(d["expiration"]),
			jsonOrEmptyObject(d["claimSpeed"]), jsonOrEmptyObject(d["termsConditions"]),
			jsonOrEmptyArray(d["customSections"]),
			getTime(d, "createdAt"), getTime(d, "updatedAt"),
		)
		if err != nil {
			slog.Warn("bonus insert", "title", d["title"], "err", err)
			continue
		}
		count++
	}
	slog.Info("bonuses migrated", "count", count)
}

// ── GAMES / GUIDES / CAMPAIGNS / CONTACT / NEWSLETTER ────────────────────────

func migrateGames(ctx context.Context, db *mongo.Database, pg *pgxpool.Pool) {
	cur, name, err := pickCollection(ctx, db, "games", "game")
	if err != nil {
		slog.Warn("games collection", "err", err)
		return
	}
	defer cur.Close(ctx)
	slog.Info("games source", "collection", name)
	count := 0
	for cur.Next(ctx) {
		var d bson.M
		if err := cur.Decode(&d); err != nil {
			continue
		}
		oid, _ := d["_id"].(primitive.ObjectID)
		id := objectIDToUUID(oid)
		_, err := pg.Exec(ctx, `
INSERT INTO games (id, game_id, casino_guru_identifier, title, embed_url, thumbnail,
    category, description, provider, is_active, views, plays, created_at, updated_at)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,COALESCE($10,TRUE),COALESCE($11,0),COALESCE($12,0),COALESCE($13,NOW()),COALESCE($14,NOW()))
ON CONFLICT (game_id) DO UPDATE SET title = EXCLUDED.title, updated_at = NOW()`,
			id, getStr(d, "gameId"), getStr(d, "casinoGuruIdentifier"), getStr(d, "title"),
			getStr(d, "embedUrl"), getStr(d, "thumbnail"), getStr(d, "category"),
			getStr(d, "description"), getStr(d, "provider"), getBool(d, "isActive"),
			getInt(d, "views"), getInt(d, "plays"),
			getTime(d, "createdAt"), getTime(d, "updatedAt"),
		)
		if err != nil {
			slog.Warn("game insert", "title", d["title"], "err", err)
			continue
		}
		count++
	}
	slog.Info("games migrated", "count", count)
}

func migrateGuides(ctx context.Context, db *mongo.Database, pg *pgxpool.Pool) {
	cur, name, err := pickCollection(ctx, db, "guides", "guide")
	if err != nil {
		slog.Warn("guides collection", "err", err)
		return
	}
	defer cur.Close(ctx)
	slog.Info("guides source", "collection", name)
	count := 0
	for cur.Next(ctx) {
		var d bson.M
		if err := cur.Decode(&d); err != nil {
			continue
		}
		oid, _ := d["_id"].(primitive.ObjectID)
		id := objectIDToUUID(oid)
		_, err := pg.Exec(ctx, `
INSERT INTO guides (id, title, slug, excerpt, content, tags, categories, featured_image,
    is_published, is_featured, views, author, published_at, seo_title, seo_description,
    related_guides, created_at, updated_at)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9,FALSE),COALESCE($10,FALSE),COALESCE($11,0),$12,$13,$14,$15,$16,COALESCE($17,NOW()),COALESCE($18,NOW()))
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()`,
			id, getStr(d, "title"), getStr(d, "slug"), getStr(d, "excerpt"), getStr(d, "content"),
			getStrArray(d, "tags"), getStrArray(d, "categories"), getStr(d, "featuredImage"),
			getBool(d, "isPublished"), getBool(d, "isFeatured"), getInt(d, "views"),
			getStr(d, "author"), getTime(d, "publishedAt"),
			getStr(d, "seoTitle"), getStr(d, "seoDescription"),
			getStrArray(d, "relatedGuides"),
			getTime(d, "createdAt"), getTime(d, "updatedAt"),
		)
		if err != nil {
			slog.Warn("guide insert", "slug", d["slug"], "err", err)
			continue
		}
		count++
	}
	slog.Info("guides migrated", "count", count)
}

func migrateCampaigns(ctx context.Context, db *mongo.Database, pg *pgxpool.Pool) {
	cur, name, err := pickCollection(ctx, db, "campaigns", "campaign")
	if err != nil {
		slog.Warn("campaigns collection", "err", err)
		return
	}
	defer cur.Close(ctx)
	slog.Info("campaigns source", "collection", name)
	count := 0
	for cur.Next(ctx) {
		var d bson.M
		if err := cur.Decode(&d); err != nil {
			continue
		}
		oid, _ := d["_id"].(primitive.ObjectID)
		id := objectIDToUUID(oid)
		_, err := pg.Exec(ctx, `
INSERT INTO campaigns (id, token, name, description, is_active, expires_at, starts_at,
    click_count, bonus_access_count, created_by, created_at, updated_at)
VALUES ($1,$2,$3,$4,COALESCE($5,TRUE),$6,$7,COALESCE($8,0),COALESCE($9,0),$10,COALESCE($11,NOW()),COALESCE($12,NOW()))
ON CONFLICT (token) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()`,
			id, getStr(d, "token"), getStr(d, "name"), getStr(d, "description"),
			getBool(d, "isActive"), getTime(d, "expiresAt"), getTime(d, "startsAt"),
			getInt(d, "clickCount"), getInt(d, "bonusAccessCount"),
			getStr(d, "createdBy"),
			getTime(d, "createdAt"), getTime(d, "updatedAt"),
		)
		if err != nil {
			slog.Warn("campaign insert", "token", d["token"], "err", err)
			continue
		}
		count++
	}
	slog.Info("campaigns migrated", "count", count)
}

func migrateContacts(ctx context.Context, db *mongo.Database, pg *pgxpool.Pool) {
	cur, name, err := pickCollection(ctx, db, "contacts", "contact", "contactmessages")
	if err != nil {
		slog.Warn("contacts collection", "err", err)
		return
	}
	defer cur.Close(ctx)
	slog.Info("contacts source", "collection", name)
	count := 0
	for cur.Next(ctx) {
		var d bson.M
		if err := cur.Decode(&d); err != nil {
			continue
		}
		oid, _ := d["_id"].(primitive.ObjectID)
		id := objectIDToUUID(oid)
		var userID any
		if uid, ok := anyToUUID(d["userId"]); ok {
			userID = uid
		}
		_, err := pg.Exec(ctx, `
INSERT INTO contact_messages (id, name, email, subject, category, message,
    is_read, is_resolved, response, responded_at, user_id, created_at, updated_at)
VALUES ($1,$2,$3,$4,COALESCE($5,'general'),$6,COALESCE($7,FALSE),COALESCE($8,FALSE),$9,$10,$11,COALESCE($12,NOW()),COALESCE($13,NOW()))
ON CONFLICT (id) DO NOTHING`,
			id, getStr(d, "name"), getStr(d, "email"), getStr(d, "subject"), getStr(d, "category"),
			getStr(d, "message"), getBool(d, "isRead"), getBool(d, "isResolved"),
			getStr(d, "response"), getTime(d, "respondedAt"), userID,
			getTime(d, "createdAt"), getTime(d, "updatedAt"),
		)
		if err != nil {
			slog.Warn("contact insert", "email", d["email"], "err", err)
			continue
		}
		count++
	}
	slog.Info("contacts migrated", "count", count)
}

func migrateNewsletter(ctx context.Context, db *mongo.Database, pg *pgxpool.Pool) {
	cur, name, err := pickCollection(ctx, db, "newslettersubscriptions", "newsletter_subscriptions", "newsletters", "newsletter")
	if err != nil {
		slog.Warn("newsletter collection", "err", err)
		return
	}
	defer cur.Close(ctx)
	slog.Info("newsletter source", "collection", name)
	count := 0
	for cur.Next(ctx) {
		var d bson.M
		if err := cur.Decode(&d); err != nil {
			continue
		}
		_, err := pg.Exec(ctx, `
INSERT INTO newsletter_subscriptions (email, status, created_at, updated_at)
VALUES ($1, COALESCE($2,'active'), COALESCE($3,NOW()), COALESCE($4,NOW()))
ON CONFLICT (email) DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()`,
			getStr(d, "email"), getStr(d, "status"), getTime(d, "createdAt"), getTime(d, "updatedAt"),
		)
		if err != nil {
			slog.Warn("newsletter insert", "email", d["email"], "err", err)
			continue
		}
		count++
	}
	slog.Info("newsletter migrated", "count", count)
}

// ── BSON helpers ─────────────────────────────────────────────────────────────

func getStr(d bson.M, k string) any {
	v, ok := d[k]
	if !ok || v == nil {
		return nil
	}
	s, _ := v.(string)
	if s == "" {
		return nil
	}
	return s
}

func getBool(d bson.M, k string) any {
	v, ok := d[k]
	if !ok || v == nil {
		return nil
	}
	b, _ := v.(bool)
	return b
}

func getInt(d bson.M, k string) any {
	v, ok := d[k]
	if !ok || v == nil {
		return nil
	}
	switch x := v.(type) {
	case int32:
		return int64(x)
	case int64:
		return x
	case int:
		return int64(x)
	case float64:
		return int64(x)
	}
	return nil
}

func getFloat(d bson.M, k string) any {
	v, ok := d[k]
	if !ok || v == nil {
		return nil
	}
	switch x := v.(type) {
	case float64:
		return x
	case int32:
		return float64(x)
	case int64:
		return float64(x)
	}
	return nil
}

func getTime(d bson.M, k string) any {
	v, ok := d[k]
	if !ok || v == nil {
		return nil
	}
	switch x := v.(type) {
	case primitive.DateTime:
		return x.Time()
	case time.Time:
		return x
	}
	return nil
}

func getStrArray(d bson.M, k string) []string {
	v, ok := d[k]
	if !ok || v == nil {
		return []string{}
	}
	arr, ok := v.(bson.A)
	if !ok {
		return []string{}
	}
	out := make([]string, 0, len(arr))
	for _, x := range arr {
		if s, ok := x.(string); ok && s != "" {
			out = append(out, s)
		}
	}
	return out
}

func jsonOrEmptyObject(v any) string {
	if v == nil {
		return "{}"
	}
	b, err := json.Marshal(v)
	if err != nil || len(b) == 0 {
		return "{}"
	}
	return string(b)
}

func jsonOrEmptyArray(v any) string {
	if v == nil {
		return "[]"
	}
	b, err := json.Marshal(v)
	if err != nil || len(b) == 0 {
		return "[]"
	}
	return string(b)
}

func fatal(stage string, err error) {
	fmt.Fprintf(os.Stderr, "FATAL %s: %v\n", stage, err)
	os.Exit(1)
}
