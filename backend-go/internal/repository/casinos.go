package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/playwise-guru/backend/internal/models"
)

type CasinoRepo struct{ db *pgxpool.Pool }

func NewCasinoRepo(db *pgxpool.Pool) *CasinoRepo { return &CasinoRepo{db: db} }

const casinoCols = `id, name, slug, founded, url, facebook, advantages, affiliate_software,
    license, owner, company_address, accessibility, mobile_application, site_languages,
    currencies, restricted_countries, available_countries, wagering, partners, version,
    logo, image, safety_index, country_flag, country_code,
    features, available_games, payment_methods,
    game_providers, games_amount, slot_games, jackpot_games, video_poker_games,
    scratch_games, bingo_games, live_games_amount, sports_betting, live_betting,
    virtual_sports_betting, deposit_methods, withdrawal_methods, minimal_deposit,
    minimal_payout, max_withdrawal_limit_per_month, withdrawal_time, withdraw_fees,
    withdraw_with_active_bonus, working_hours, contact_info, live_chat_languages,
    phone_languages, email_languages, average_contact_time, website_languages,
    customer_support_languages, bonus_text, bonus_subtext, is_exclusive,
    visit_url, review_url, created_at, updated_at`

func scanCasino(row pgx.Row) (*models.Casino, error) {
	var c models.Casino
	err := row.Scan(
		&c.ID, &c.Name, &c.Slug, &c.Founded, &c.URL, &c.Facebook, &c.Advantages, &c.AffiliateSoftware,
		&c.License, &c.Owner, &c.CompanyAddress, &c.Accessibility, &c.MobileApplication, &c.SiteLanguages,
		&c.Currencies, &c.RestrictedCountries, &c.AvailableCountries, &c.Wagering, &c.Partners, &c.Version,
		&c.Logo, &c.Image, &c.SafetyIndex, &c.CountryFlag, &c.CountryCode,
		&c.Features, &c.AvailableGames, &c.PaymentMethods,
		&c.GameProviders, &c.GamesAmount, &c.SlotGames, &c.JackpotGames, &c.VideoPokerGames,
		&c.ScratchGames, &c.BingoGames, &c.LiveGamesAmount, &c.SportsBetting, &c.LiveBetting,
		&c.VirtualSportsBetting, &c.DepositMethods, &c.WithdrawalMethods, &c.MinimalDeposit,
		&c.MinimalPayout, &c.MaxWithdrawalLimitPerMonth, &c.WithdrawalTime, &c.WithdrawFees,
		&c.WithdrawWithActiveBonus, &c.WorkingHours, &c.ContactInfo, &c.LiveChatLanguages,
		&c.PhoneLanguages, &c.EmailLanguages, &c.AverageContactTime, &c.WebsiteLanguages,
		&c.CustomerSupportLanguages, &c.BonusText, &c.BonusSubtext, &c.IsExclusive,
		&c.VisitURL, &c.ReviewURL, &c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *CasinoRepo) List(ctx context.Context, limit, offset int) ([]models.Casino, error) {
	rows, err := r.db.Query(ctx, `SELECT `+casinoCols+` FROM casinos ORDER BY created_at DESC LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Casino, 0)
	for rows.Next() {
		c, err := scanCasino(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *c)
	}
	return out, rows.Err()
}

func (r *CasinoRepo) Get(ctx context.Context, id uuid.UUID) (*models.Casino, error) {
	return scanCasino(r.db.QueryRow(ctx, `SELECT `+casinoCols+` FROM casinos WHERE id=$1`, id))
}

// Create inserts a casino. We accept the full model so admin clients can
// post any subset of fields — defaults handle the rest.
func (r *CasinoRepo) Create(ctx context.Context, c *models.Casino) (*models.Casino, error) {
	const q = `
INSERT INTO casinos (
    name, slug, founded, url, facebook, advantages, affiliate_software, license, owner,
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
    visit_url, review_url
) VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,
    $28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,$52,$53,$54,$55,$56,$57,$58,$59
)
RETURNING ` + casinoCols
	return scanCasino(r.db.QueryRow(ctx, q,
		c.Name, c.Slug, c.Founded, c.URL, c.Facebook, c.Advantages, c.AffiliateSoftware, c.License, c.Owner,
		c.CompanyAddress, c.Accessibility, c.MobileApplication, c.SiteLanguages, c.Currencies,
		c.RestrictedCountries, c.AvailableCountries, c.Wagering, c.Partners, c.Version,
		c.Logo, c.Image, c.SafetyIndex, c.CountryFlag, c.CountryCode,
		nonNullJSON(c.Features, "[]"), nonNullJSON(c.AvailableGames, "[]"), nonNullJSON(c.PaymentMethods, "[]"),
		c.GameProviders, c.GamesAmount, c.SlotGames, c.JackpotGames, c.VideoPokerGames,
		c.ScratchGames, c.BingoGames, c.LiveGamesAmount, c.SportsBetting, c.LiveBetting,
		c.VirtualSportsBetting, c.DepositMethods, c.WithdrawalMethods, c.MinimalDeposit,
		c.MinimalPayout, c.MaxWithdrawalLimitPerMonth, c.WithdrawalTime, c.WithdrawFees,
		c.WithdrawWithActiveBonus, c.WorkingHours, c.ContactInfo, c.LiveChatLanguages,
		c.PhoneLanguages, c.EmailLanguages, c.AverageContactTime, c.WebsiteLanguages,
		c.CustomerSupportLanguages, c.BonusText, c.BonusSubtext, c.IsExclusive,
		c.VisitURL, c.ReviewURL,
	))
}

func (r *CasinoRepo) Update(ctx context.Context, c *models.Casino) (*models.Casino, error) {
	const q = `
UPDATE casinos SET
    name=$2, slug=$3, founded=$4, url=$5, facebook=$6, advantages=$7,
    affiliate_software=$8, license=$9, owner=$10, company_address=$11, accessibility=$12,
    mobile_application=$13, site_languages=$14, currencies=$15, restricted_countries=$16,
    available_countries=$17, wagering=$18, partners=$19, version=$20,
    logo=$21, image=$22, safety_index=$23, country_flag=$24, country_code=$25,
    features=$26, available_games=$27, payment_methods=$28,
    game_providers=$29, games_amount=$30, slot_games=$31, jackpot_games=$32,
    video_poker_games=$33, scratch_games=$34, bingo_games=$35, live_games_amount=$36,
    sports_betting=$37, live_betting=$38, virtual_sports_betting=$39,
    deposit_methods=$40, withdrawal_methods=$41, minimal_deposit=$42, minimal_payout=$43,
    max_withdrawal_limit_per_month=$44, withdrawal_time=$45, withdraw_fees=$46,
    withdraw_with_active_bonus=$47, working_hours=$48, contact_info=$49,
    live_chat_languages=$50, phone_languages=$51, email_languages=$52,
    average_contact_time=$53, website_languages=$54, customer_support_languages=$55,
    bonus_text=$56, bonus_subtext=$57, is_exclusive=$58, visit_url=$59, review_url=$60,
    updated_at=NOW()
WHERE id=$1
RETURNING ` + casinoCols
	return scanCasino(r.db.QueryRow(ctx, q,
		c.ID,
		c.Name, c.Slug, c.Founded, c.URL, c.Facebook, c.Advantages,
		c.AffiliateSoftware, c.License, c.Owner, c.CompanyAddress, c.Accessibility,
		c.MobileApplication, c.SiteLanguages, c.Currencies, c.RestrictedCountries,
		c.AvailableCountries, c.Wagering, c.Partners, c.Version,
		c.Logo, c.Image, c.SafetyIndex, c.CountryFlag, c.CountryCode,
		nonNullJSON(c.Features, "[]"), nonNullJSON(c.AvailableGames, "[]"), nonNullJSON(c.PaymentMethods, "[]"),
		c.GameProviders, c.GamesAmount, c.SlotGames, c.JackpotGames,
		c.VideoPokerGames, c.ScratchGames, c.BingoGames, c.LiveGamesAmount,
		c.SportsBetting, c.LiveBetting, c.VirtualSportsBetting,
		c.DepositMethods, c.WithdrawalMethods, c.MinimalDeposit, c.MinimalPayout,
		c.MaxWithdrawalLimitPerMonth, c.WithdrawalTime, c.WithdrawFees,
		c.WithdrawWithActiveBonus, c.WorkingHours, c.ContactInfo,
		c.LiveChatLanguages, c.PhoneLanguages, c.EmailLanguages,
		c.AverageContactTime, c.WebsiteLanguages, c.CustomerSupportLanguages,
		c.BonusText, c.BonusSubtext, c.IsExclusive, c.VisitURL, c.ReviewURL,
	))
}

func (r *CasinoRepo) Delete(ctx context.Context, id uuid.UUID) error {
	tag, err := r.db.Exec(ctx, `DELETE FROM casinos WHERE id=$1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}
