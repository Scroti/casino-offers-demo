package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/playwise-guru/backend/internal/models"
)

type BonusRepo struct{ db *pgxpool.Pool }

func NewBonusRepo(db *pgxpool.Pool) *BonusRepo { return &BonusRepo{db: db} }

const bonusCols = `id, casino_id, title, description, price, rating, type, image, href,
    is_exclusive, casino_name, casino_logo, casino_image, safety_index, country_flag,
    country_code, promo_code, bonus_instructions, review_link, wagering_requirement,
    bonus_value, max_bet, expiration, claim_speed, terms_conditions, custom_sections,
    created_at, updated_at`

func scanBonus(row pgx.Row) (*models.Bonus, error) {
	var b models.Bonus
	err := row.Scan(
		&b.ID, &b.CasinoID, &b.Title, &b.Description, &b.Price, &b.Rating, &b.Type, &b.Image, &b.Href,
		&b.IsExclusive, &b.CasinoName, &b.CasinoLogo, &b.CasinoImage, &b.SafetyIndex, &b.CountryFlag,
		&b.CountryCode, &b.PromoCode, &b.BonusInstructions, &b.ReviewLink, &b.WageringRequirement,
		&b.BonusValue, &b.MaxBet, &b.Expiration, &b.ClaimSpeed, &b.TermsConditions, &b.CustomSections,
		&b.CreatedAt, &b.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &b, nil
}

func (r *BonusRepo) List(ctx context.Context, limit, offset int) ([]models.Bonus, error) {
	rows, err := r.db.Query(ctx,
		`SELECT `+bonusCols+` FROM bonuses ORDER BY created_at DESC LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Bonus, 0)
	for rows.Next() {
		b, err := scanBonus(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *b)
	}
	return out, rows.Err()
}

func (r *BonusRepo) Get(ctx context.Context, id uuid.UUID) (*models.Bonus, error) {
	return scanBonus(r.db.QueryRow(ctx, `SELECT `+bonusCols+` FROM bonuses WHERE id=$1`, id))
}

func (r *BonusRepo) ListByCasino(ctx context.Context, casinoID uuid.UUID) ([]models.Bonus, error) {
	rows, err := r.db.Query(ctx,
		`SELECT `+bonusCols+` FROM bonuses WHERE casino_id=$1 ORDER BY created_at DESC`, casinoID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Bonus, 0)
	for rows.Next() {
		b, err := scanBonus(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *b)
	}
	return out, rows.Err()
}

func (r *BonusRepo) Create(ctx context.Context, b *models.Bonus) (*models.Bonus, error) {
	const q = `INSERT INTO bonuses (
        casino_id, title, description, price, rating, type, image, href, is_exclusive,
        casino_name, casino_logo, casino_image, safety_index, country_flag, country_code,
        promo_code, bonus_instructions, review_link,
        wagering_requirement, bonus_value, max_bet, expiration, claim_speed, terms_conditions,
        custom_sections
    ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25
    ) RETURNING ` + bonusCols
	return scanBonus(r.db.QueryRow(ctx, q,
		b.CasinoID, b.Title, nonNullJSON(b.Description, "{}"), b.Price, b.Rating, b.Type, b.Image, b.Href, b.IsExclusive,
		b.CasinoName, b.CasinoLogo, b.CasinoImage, b.SafetyIndex, b.CountryFlag, b.CountryCode,
		b.PromoCode, b.BonusInstructions, b.ReviewLink,
		nonNullJSON(b.WageringRequirement, "{}"), nonNullJSON(b.BonusValue, "{}"),
		nonNullJSON(b.MaxBet, "{}"), nonNullJSON(b.Expiration, "{}"),
		nonNullJSON(b.ClaimSpeed, "{}"), nonNullJSON(b.TermsConditions, "{}"),
		nonNullJSON(b.CustomSections, "[]"),
	))
}

func (r *BonusRepo) Update(ctx context.Context, b *models.Bonus) (*models.Bonus, error) {
	const q = `UPDATE bonuses SET
        casino_id=$2, title=$3, description=$4, price=$5, rating=$6, type=$7, image=$8, href=$9,
        is_exclusive=$10, casino_name=$11, casino_logo=$12, casino_image=$13, safety_index=$14,
        country_flag=$15, country_code=$16, promo_code=$17, bonus_instructions=$18, review_link=$19,
        wagering_requirement=$20, bonus_value=$21, max_bet=$22, expiration=$23, claim_speed=$24,
        terms_conditions=$25, custom_sections=$26, updated_at=NOW()
        WHERE id=$1 RETURNING ` + bonusCols
	return scanBonus(r.db.QueryRow(ctx, q,
		b.ID,
		b.CasinoID, b.Title, nonNullJSON(b.Description, "{}"), b.Price, b.Rating, b.Type, b.Image, b.Href,
		b.IsExclusive, b.CasinoName, b.CasinoLogo, b.CasinoImage, b.SafetyIndex,
		b.CountryFlag, b.CountryCode, b.PromoCode, b.BonusInstructions, b.ReviewLink,
		nonNullJSON(b.WageringRequirement, "{}"), nonNullJSON(b.BonusValue, "{}"),
		nonNullJSON(b.MaxBet, "{}"), nonNullJSON(b.Expiration, "{}"),
		nonNullJSON(b.ClaimSpeed, "{}"), nonNullJSON(b.TermsConditions, "{}"),
		nonNullJSON(b.CustomSections, "[]"),
	))
}

func (r *BonusRepo) Delete(ctx context.Context, id uuid.UUID) error {
	tag, err := r.db.Exec(ctx, `DELETE FROM bonuses WHERE id=$1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}
