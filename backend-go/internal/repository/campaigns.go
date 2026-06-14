package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/playwise-guru/backend/internal/models"
)

type CampaignRepo struct{ db *pgxpool.Pool }

func NewCampaignRepo(db *pgxpool.Pool) *CampaignRepo { return &CampaignRepo{db: db} }

const campaignCols = `id, token, name, description, is_active, expires_at, starts_at,
    click_count, bonus_access_count, created_by, created_at, updated_at`

func scanCampaign(row pgx.Row) (*models.Campaign, error) {
	var c models.Campaign
	err := row.Scan(
		&c.ID, &c.Token, &c.Name, &c.Description, &c.IsActive, &c.ExpiresAt, &c.StartsAt,
		&c.ClickCount, &c.BonusAccessCount, &c.CreatedBy, &c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *CampaignRepo) List(ctx context.Context) ([]models.Campaign, error) {
	rows, err := r.db.Query(ctx,
		`SELECT `+campaignCols+` FROM campaigns ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Campaign, 0)
	for rows.Next() {
		c, err := scanCampaign(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *c)
	}
	return out, rows.Err()
}

func (r *CampaignRepo) Get(ctx context.Context, id uuid.UUID) (*models.Campaign, error) {
	return scanCampaign(r.db.QueryRow(ctx, `SELECT `+campaignCols+` FROM campaigns WHERE id=$1`, id))
}

func (r *CampaignRepo) GetByToken(ctx context.Context, token string) (*models.Campaign, error) {
	return scanCampaign(r.db.QueryRow(ctx, `SELECT `+campaignCols+` FROM campaigns WHERE token=$1`, token))
}

func (r *CampaignRepo) Create(ctx context.Context, c *models.Campaign) (*models.Campaign, error) {
	const q = `INSERT INTO campaigns (token, name, description, is_active, expires_at, starts_at, created_by)
	           VALUES ($1,$2,$3,COALESCE($4, TRUE),$5,$6,$7)
	           RETURNING ` + campaignCols
	return scanCampaign(r.db.QueryRow(ctx, q,
		c.Token, c.Name, c.Description, c.IsActive, c.ExpiresAt, c.StartsAt, c.CreatedBy))
}

func (r *CampaignRepo) Update(ctx context.Context, c *models.Campaign) (*models.Campaign, error) {
	const q = `UPDATE campaigns SET
        token=$2, name=$3, description=$4, is_active=$5, expires_at=$6, starts_at=$7,
        updated_at=NOW() WHERE id=$1 RETURNING ` + campaignCols
	return scanCampaign(r.db.QueryRow(ctx, q,
		c.ID, c.Token, c.Name, c.Description, c.IsActive, c.ExpiresAt, c.StartsAt))
}

func (r *CampaignRepo) Delete(ctx context.Context, id uuid.UUID) error {
	tag, err := r.db.Exec(ctx, `DELETE FROM campaigns WHERE id=$1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *CampaignRepo) IncrementClickCount(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `UPDATE campaigns SET click_count=click_count+1 WHERE id=$1`, id)
	return err
}
