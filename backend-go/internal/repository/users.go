package repository

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/playwise-guru/backend/internal/models"
)

type UserRepo struct{ db *pgxpool.Pool }

func NewUserRepo(db *pgxpool.Pool) *UserRepo { return &UserRepo{db: db} }

const userCols = `id, name, email, password_hash, role, status, profile_image_url,
    is_verified, last_login, total_bonuses, total_spent, country, language,
    gender, age_range, created_at, updated_at`

func scanUser(row pgx.Row) (*models.User, error) {
	var u models.User
	err := row.Scan(
		&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.Status, &u.ProfileImageURL,
		&u.IsVerified, &u.LastLogin, &u.TotalBonuses, &u.TotalSpent, &u.Country, &u.Language,
		&u.Gender, &u.AgeRange, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

type CreateUserParams struct {
	Name            *string
	Email           string
	PasswordHash    string
	Role            models.Role
	Country         *string
	Language        *string
	ProfileImageURL *string
}

func (r *UserRepo) Create(ctx context.Context, p CreateUserParams) (*models.User, error) {
	const q = `INSERT INTO users (name, email, password_hash, role, country, language, profile_image_url)
	           VALUES ($1,$2,$3,$4,$5,$6,$7)
	           RETURNING ` + userCols
	return scanUser(r.db.QueryRow(ctx, q, p.Name, p.Email, p.PasswordHash, p.Role, p.Country, p.Language, p.ProfileImageURL))
}

func (r *UserRepo) GetByID(ctx context.Context, id uuid.UUID) (*models.User, error) {
	return scanUser(r.db.QueryRow(ctx, `SELECT `+userCols+` FROM users WHERE id=$1`, id))
}

func (r *UserRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	return scanUser(r.db.QueryRow(ctx, `SELECT `+userCols+` FROM users WHERE lower(email)=lower($1)`, email))
}

func (r *UserRepo) List(ctx context.Context, limit, offset int) ([]models.User, error) {
	rows, err := r.db.Query(ctx, `SELECT `+userCols+` FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.User, 0)
	for rows.Next() {
		u, err := scanUser(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *u)
	}
	return out, rows.Err()
}

func (r *UserRepo) Delete(ctx context.Context, id uuid.UUID) error {
	tag, err := r.db.Exec(ctx, `DELETE FROM users WHERE id=$1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

type UpdateProfileParams struct {
	Name            *string
	ProfileImageURL *string
	Gender          *models.Gender
	AgeRange        *string
}

func (r *UserRepo) UpdateProfile(ctx context.Context, id uuid.UUID, p UpdateProfileParams) (*models.User, error) {
	const q = `UPDATE users
	           SET name = COALESCE($2, name),
	               profile_image_url = COALESCE($3, profile_image_url),
	               gender = COALESCE($4, gender),
	               age_range = COALESCE($5, age_range),
	               updated_at = NOW()
	           WHERE id = $1
	           RETURNING ` + userCols
	return scanUser(r.db.QueryRow(ctx, q, id, p.Name, p.ProfileImageURL, p.Gender, p.AgeRange))
}

func (r *UserRepo) SetStatus(ctx context.Context, id uuid.UUID, status models.Status) error {
	_, err := r.db.Exec(ctx, `UPDATE users SET status=$2, updated_at=NOW() WHERE id=$1`, id, status)
	return err
}

func (r *UserRepo) SetRole(ctx context.Context, id uuid.UUID, role models.Role) error {
	_, err := r.db.Exec(ctx, `UPDATE users SET role=$2, updated_at=NOW() WHERE id=$1`, id, role)
	return err
}

func (r *UserRepo) SetVerified(ctx context.Context, id uuid.UUID, verified bool) error {
	_, err := r.db.Exec(ctx, `UPDATE users SET is_verified=$2, updated_at=NOW() WHERE id=$1`, id, verified)
	return err
}

func (r *UserRepo) TouchLogin(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `UPDATE users SET last_login=NOW(), updated_at=NOW() WHERE id=$1`, id)
	return err
}

func (r *UserRepo) SetRefreshTokenHash(ctx context.Context, id uuid.UUID, hash *string) error {
	_, err := r.db.Exec(ctx, `UPDATE users SET refresh_token_hash=$2, updated_at=NOW() WHERE id=$1`, id, hash)
	return err
}

// GetRefreshTokenHash returns the stored hash, or an empty string when none.
func (r *UserRepo) GetRefreshTokenHash(ctx context.Context, id uuid.UUID) (string, error) {
	var hash *string
	err := r.db.QueryRow(ctx, `SELECT refresh_token_hash FROM users WHERE id=$1`, id).Scan(&hash)
	if err != nil {
		return "", err
	}
	if hash == nil {
		return "", nil
	}
	return *hash, nil
}

// SetVerificationToken stores hashed verification credentials and clears them on success.
func (r *UserRepo) SetVerificationToken(ctx context.Context, id uuid.UUID, token, code string, tokenExp, codeExp time.Time) error {
	_, err := r.db.Exec(ctx, `
		UPDATE users
		SET email_verification_token=$2,
		    email_verification_token_expires=$3,
		    email_verification_code=$4,
		    email_verification_code_expires=$5,
		    updated_at=NOW()
		WHERE id=$1`, id, token, tokenExp, code, codeExp)
	return err
}

func (r *UserRepo) FindByVerificationToken(ctx context.Context, token string) (*models.User, error) {
	return scanUser(r.db.QueryRow(ctx,
		`SELECT `+userCols+` FROM users
		 WHERE email_verification_token=$1 AND email_verification_token_expires > NOW()`, token))
}

func (r *UserRepo) FindByVerificationCode(ctx context.Context, code string) (*models.User, error) {
	return scanUser(r.db.QueryRow(ctx,
		`SELECT `+userCols+` FROM users
		 WHERE email_verification_code=$1 AND email_verification_code_expires > NOW()`, code))
}

func (r *UserRepo) ClearVerification(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `
		UPDATE users
		SET is_verified=TRUE,
		    email_verification_token=NULL,
		    email_verification_token_expires=NULL,
		    email_verification_code=NULL,
		    email_verification_code_expires=NULL,
		    updated_at=NOW()
		WHERE id=$1`, id)
	return err
}

func (r *UserRepo) SetPasswordResetToken(ctx context.Context, id uuid.UUID, token string, exp time.Time) error {
	_, err := r.db.Exec(ctx, `
		UPDATE users SET password_reset_token=$2, password_reset_token_expires=$3, updated_at=NOW()
		WHERE id=$1`, id, token, exp)
	return err
}

func (r *UserRepo) FindByResetToken(ctx context.Context, token string) (*models.User, error) {
	return scanUser(r.db.QueryRow(ctx,
		`SELECT `+userCols+` FROM users
		 WHERE password_reset_token=$1 AND password_reset_token_expires > NOW()`, token))
}

func (r *UserRepo) ResetPassword(ctx context.Context, id uuid.UUID, newHash string) error {
	_, err := r.db.Exec(ctx, `
		UPDATE users
		SET password_hash=$2,
		    password_reset_token=NULL,
		    password_reset_token_expires=NULL,
		    updated_at=NOW()
		WHERE id=$1`, id, newHash)
	return err
}

// IsNotFound is the canonical "no rows" check for callers.
func IsNotFound(err error) bool {
	return errors.Is(err, pgx.ErrNoRows)
}
