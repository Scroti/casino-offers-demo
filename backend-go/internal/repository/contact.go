package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/playwise-guru/backend/internal/models"
)

type ContactRepo struct{ db *pgxpool.Pool }

func NewContactRepo(db *pgxpool.Pool) *ContactRepo { return &ContactRepo{db: db} }

const contactCols = `id, name, email, subject, category, message, is_read, is_resolved,
    response, responded_at, user_id, created_at, updated_at`

func scanContact(row pgx.Row) (*models.ContactMessage, error) {
	var c models.ContactMessage
	err := row.Scan(
		&c.ID, &c.Name, &c.Email, &c.Subject, &c.Category, &c.Message, &c.IsRead, &c.IsResolved,
		&c.Response, &c.RespondedAt, &c.UserID, &c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *ContactRepo) Create(ctx context.Context, c *models.ContactMessage) (*models.ContactMessage, error) {
	const q = `INSERT INTO contact_messages (name, email, subject, category, message, user_id)
	           VALUES ($1,$2,$3,$4,$5,$6) RETURNING ` + contactCols
	return scanContact(r.db.QueryRow(ctx, q, c.Name, c.Email, c.Subject, c.Category, c.Message, c.UserID))
}

func (r *ContactRepo) List(ctx context.Context, limit, offset int) ([]models.ContactMessage, error) {
	rows, err := r.db.Query(ctx,
		`SELECT `+contactCols+` FROM contact_messages ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
		limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.ContactMessage, 0)
	for rows.Next() {
		c, err := scanContact(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *c)
	}
	return out, rows.Err()
}

func (r *ContactRepo) Get(ctx context.Context, id uuid.UUID) (*models.ContactMessage, error) {
	return scanContact(r.db.QueryRow(ctx, `SELECT `+contactCols+` FROM contact_messages WHERE id=$1`, id))
}

func (r *ContactRepo) MarkRead(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `UPDATE contact_messages SET is_read=TRUE, updated_at=NOW() WHERE id=$1`, id)
	return err
}

func (r *ContactRepo) Resolve(ctx context.Context, id uuid.UUID, response *string) error {
	_, err := r.db.Exec(ctx, `
		UPDATE contact_messages
		SET is_resolved=TRUE, response=COALESCE($2, response), responded_at=NOW(), updated_at=NOW()
		WHERE id=$1`, id, response)
	return err
}
