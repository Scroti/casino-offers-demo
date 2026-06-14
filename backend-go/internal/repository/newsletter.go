package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/playwise-guru/backend/internal/models"
)

type NewsletterRepo struct{ db *pgxpool.Pool }

func NewNewsletterRepo(db *pgxpool.Pool) *NewsletterRepo { return &NewsletterRepo{db: db} }

const subCols = `id, email, status, created_at, updated_at`

func scanSub(row pgx.Row) (*models.NewsletterSubscription, error) {
	var s models.NewsletterSubscription
	err := row.Scan(&s.ID, &s.Email, &s.Status, &s.CreatedAt, &s.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *NewsletterRepo) GetByEmail(ctx context.Context, email string) (*models.NewsletterSubscription, error) {
	return scanSub(r.db.QueryRow(ctx, `SELECT `+subCols+` FROM newsletter_subscriptions WHERE lower(email)=lower($1)`, email))
}

// Subscribe upserts: creates new active sub or flips an unsubscribed one back to active.
func (r *NewsletterRepo) Subscribe(ctx context.Context, email string) (*models.NewsletterSubscription, error) {
	const q = `INSERT INTO newsletter_subscriptions (email, status) VALUES ($1, 'active')
	           ON CONFLICT (email) DO UPDATE SET status='active', updated_at=NOW()
	           RETURNING ` + subCols
	return scanSub(r.db.QueryRow(ctx, q, email))
}

func (r *NewsletterRepo) Unsubscribe(ctx context.Context, email string) (*models.NewsletterSubscription, error) {
	const q = `UPDATE newsletter_subscriptions SET status='unsubscribed', updated_at=NOW()
	           WHERE lower(email)=lower($1) RETURNING ` + subCols
	return scanSub(r.db.QueryRow(ctx, q, email))
}
