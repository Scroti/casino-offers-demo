package services

import (
	"context"

	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/repository"
)

type GuideService struct{ repo *repository.GuideRepo }

func NewGuideService(repo *repository.GuideRepo) *GuideService { return &GuideService{repo: repo} }

func (s *GuideService) List(ctx context.Context, publishedOnly bool, limit, offset int) ([]models.Guide, error) {
	return s.repo.List(ctx, publishedOnly, limit, offset)
}

func (s *GuideService) Featured(ctx context.Context, limit int) ([]models.Guide, error) {
	return s.repo.Featured(ctx, limit)
}

func (s *GuideService) ByCategory(ctx context.Context, category string) ([]models.Guide, error) {
	return s.repo.ByCategory(ctx, category)
}

func (s *GuideService) Get(ctx context.Context, id uuid.UUID) (*models.Guide, error) {
	g, err := s.repo.Get(ctx, id)
	return g, mapNotFound(err)
}

func (s *GuideService) GetBySlug(ctx context.Context, slug string) (*models.Guide, error) {
	g, err := s.repo.GetBySlug(ctx, slug)
	return g, mapNotFound(err)
}

func (s *GuideService) Create(ctx context.Context, g *models.Guide) (*models.Guide, error) {
	return s.repo.Create(ctx, g)
}

func (s *GuideService) Update(ctx context.Context, g *models.Guide) (*models.Guide, error) {
	updated, err := s.repo.Update(ctx, g)
	return updated, mapNotFound(err)
}

func (s *GuideService) Delete(ctx context.Context, id uuid.UUID) error {
	return mapNotFound(s.repo.Delete(ctx, id))
}

func (s *GuideService) IncrementViews(ctx context.Context, id uuid.UUID) error {
	return s.repo.IncrementViews(ctx, id)
}
