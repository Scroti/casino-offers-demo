package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/playwise-guru/backend/internal/models"
)

type GuideRepo struct{ db *pgxpool.Pool }

func NewGuideRepo(db *pgxpool.Pool) *GuideRepo { return &GuideRepo{db: db} }

const guideCols = `id, title, slug, excerpt, content, tags, categories, featured_image,
    is_published, is_featured, views, author, published_at, seo_title, seo_description,
    related_guides, created_at, updated_at`

func scanGuide(row pgx.Row) (*models.Guide, error) {
	var g models.Guide
	err := row.Scan(
		&g.ID, &g.Title, &g.Slug, &g.Excerpt, &g.Content, &g.Tags, &g.Categories, &g.FeaturedImage,
		&g.IsPublished, &g.IsFeatured, &g.Views, &g.Author, &g.PublishedAt, &g.SEOTitle, &g.SEODescription,
		&g.RelatedGuides, &g.CreatedAt, &g.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &g, nil
}

func (r *GuideRepo) List(ctx context.Context, publishedOnly bool, limit, offset int) ([]models.Guide, error) {
	q := `SELECT ` + guideCols + ` FROM guides`
	if publishedOnly {
		q += ` WHERE is_published = TRUE`
	}
	q += ` ORDER BY published_at DESC NULLS LAST, created_at DESC LIMIT $1 OFFSET $2`

	rows, err := r.db.Query(ctx, q, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Guide, 0)
	for rows.Next() {
		g, err := scanGuide(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *g)
	}
	return out, rows.Err()
}

func (r *GuideRepo) Featured(ctx context.Context, limit int) ([]models.Guide, error) {
	rows, err := r.db.Query(ctx,
		`SELECT `+guideCols+` FROM guides WHERE is_featured = TRUE AND is_published = TRUE
         ORDER BY published_at DESC NULLS LAST LIMIT $1`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Guide, 0)
	for rows.Next() {
		g, err := scanGuide(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *g)
	}
	return out, rows.Err()
}

func (r *GuideRepo) ByCategory(ctx context.Context, category string) ([]models.Guide, error) {
	rows, err := r.db.Query(ctx,
		`SELECT `+guideCols+` FROM guides WHERE $1 = ANY(categories) AND is_published = TRUE
         ORDER BY published_at DESC NULLS LAST`, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Guide, 0)
	for rows.Next() {
		g, err := scanGuide(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *g)
	}
	return out, rows.Err()
}

func (r *GuideRepo) Get(ctx context.Context, id uuid.UUID) (*models.Guide, error) {
	return scanGuide(r.db.QueryRow(ctx, `SELECT `+guideCols+` FROM guides WHERE id=$1`, id))
}

func (r *GuideRepo) GetBySlug(ctx context.Context, slug string) (*models.Guide, error) {
	return scanGuide(r.db.QueryRow(ctx, `SELECT `+guideCols+` FROM guides WHERE slug=$1`, slug))
}

func (r *GuideRepo) Create(ctx context.Context, g *models.Guide) (*models.Guide, error) {
	const q = `INSERT INTO guides (
        title, slug, excerpt, content, tags, categories, featured_image, is_published, is_featured,
        author, published_at, seo_title, seo_description, related_guides
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,COALESCE($11, NOW()),$12,$13,$14)
    RETURNING ` + guideCols
	return scanGuide(r.db.QueryRow(ctx, q,
		g.Title, g.Slug, g.Excerpt, g.Content, g.Tags, g.Categories, g.FeaturedImage,
		g.IsPublished, g.IsFeatured, g.Author, g.PublishedAt, g.SEOTitle, g.SEODescription, g.RelatedGuides,
	))
}

func (r *GuideRepo) Update(ctx context.Context, g *models.Guide) (*models.Guide, error) {
	const q = `UPDATE guides SET
        title=$2, slug=$3, excerpt=$4, content=$5, tags=$6, categories=$7, featured_image=$8,
        is_published=$9, is_featured=$10, author=$11, published_at=$12,
        seo_title=$13, seo_description=$14, related_guides=$15, updated_at=NOW()
        WHERE id=$1 RETURNING ` + guideCols
	return scanGuide(r.db.QueryRow(ctx, q,
		g.ID, g.Title, g.Slug, g.Excerpt, g.Content, g.Tags, g.Categories, g.FeaturedImage,
		g.IsPublished, g.IsFeatured, g.Author, g.PublishedAt, g.SEOTitle, g.SEODescription, g.RelatedGuides,
	))
}

func (r *GuideRepo) Delete(ctx context.Context, id uuid.UUID) error {
	tag, err := r.db.Exec(ctx, `DELETE FROM guides WHERE id=$1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *GuideRepo) IncrementViews(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `UPDATE guides SET views=views+1, updated_at=NOW() WHERE id=$1`, id)
	return err
}
