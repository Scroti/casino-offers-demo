package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/playwise-guru/backend/internal/models"
)

type GameRepo struct{ db *pgxpool.Pool }

func NewGameRepo(db *pgxpool.Pool) *GameRepo { return &GameRepo{db: db} }

const gameCols = `id, game_id, casino_guru_identifier, title, embed_url, thumbnail,
    category, description, provider, is_active, views, plays, created_at, updated_at`

func scanGame(row pgx.Row) (*models.Game, error) {
	var g models.Game
	err := row.Scan(
		&g.ID, &g.GameID, &g.CasinoGuruIdentifier, &g.Title, &g.EmbedURL, &g.Thumbnail,
		&g.Category, &g.Description, &g.Provider, &g.IsActive, &g.Views, &g.Plays,
		&g.CreatedAt, &g.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &g, nil
}

func (r *GameRepo) List(ctx context.Context, activeOnly bool, limit, offset int) ([]models.Game, error) {
	q := `SELECT ` + gameCols + ` FROM games`
	if activeOnly {
		q += ` WHERE is_active = TRUE`
	}
	q += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`

	rows, err := r.db.Query(ctx, q, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Game, 0)
	for rows.Next() {
		g, err := scanGame(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *g)
	}
	return out, rows.Err()
}

func (r *GameRepo) Get(ctx context.Context, id uuid.UUID) (*models.Game, error) {
	return scanGame(r.db.QueryRow(ctx, `SELECT `+gameCols+` FROM games WHERE id=$1`, id))
}

func (r *GameRepo) GetByGameID(ctx context.Context, gameID string) (*models.Game, error) {
	return scanGame(r.db.QueryRow(ctx, `SELECT `+gameCols+` FROM games WHERE game_id=$1`, gameID))
}

func (r *GameRepo) Create(ctx context.Context, g *models.Game) (*models.Game, error) {
	const q = `INSERT INTO games (
        game_id, casino_guru_identifier, title, embed_url, thumbnail, category, description, provider, is_active
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9, TRUE))
    RETURNING ` + gameCols
	return scanGame(r.db.QueryRow(ctx, q,
		g.GameID, g.CasinoGuruIdentifier, g.Title, g.EmbedURL, g.Thumbnail,
		g.Category, g.Description, g.Provider, g.IsActive,
	))
}

func (r *GameRepo) Update(ctx context.Context, g *models.Game) (*models.Game, error) {
	const q = `UPDATE games SET
        game_id=$2, casino_guru_identifier=$3, title=$4, embed_url=$5, thumbnail=$6,
        category=$7, description=$8, provider=$9, is_active=$10, updated_at=NOW()
        WHERE id=$1 RETURNING ` + gameCols
	return scanGame(r.db.QueryRow(ctx, q,
		g.ID, g.GameID, g.CasinoGuruIdentifier, g.Title, g.EmbedURL, g.Thumbnail,
		g.Category, g.Description, g.Provider, g.IsActive,
	))
}

func (r *GameRepo) Delete(ctx context.Context, id uuid.UUID) error {
	tag, err := r.db.Exec(ctx, `DELETE FROM games WHERE id=$1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *GameRepo) IncrementViews(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `UPDATE games SET views=views+1, updated_at=NOW() WHERE id=$1`, id)
	return err
}

func (r *GameRepo) IncrementPlays(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `UPDATE games SET plays=plays+1, updated_at=NOW() WHERE id=$1`, id)
	return err
}
