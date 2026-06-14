package services

import (
	"context"

	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/repository"
)

type BonusService struct{ repo *repository.BonusRepo }

func NewBonusService(repo *repository.BonusRepo) *BonusService { return &BonusService{repo: repo} }

func (s *BonusService) List(ctx context.Context, limit, offset int) ([]models.Bonus, error) {
	return s.repo.List(ctx, limit, offset)
}

func (s *BonusService) Get(ctx context.Context, id uuid.UUID) (*models.Bonus, error) {
	b, err := s.repo.Get(ctx, id)
	return b, mapNotFound(err)
}

func (s *BonusService) ListByCasino(ctx context.Context, casinoID uuid.UUID) ([]models.Bonus, error) {
	return s.repo.ListByCasino(ctx, casinoID)
}

func (s *BonusService) Create(ctx context.Context, b *models.Bonus) (*models.Bonus, error) {
	return s.repo.Create(ctx, b)
}

func (s *BonusService) Update(ctx context.Context, b *models.Bonus) (*models.Bonus, error) {
	updated, err := s.repo.Update(ctx, b)
	return updated, mapNotFound(err)
}

func (s *BonusService) Delete(ctx context.Context, id uuid.UUID) error {
	return mapNotFound(s.repo.Delete(ctx, id))
}
