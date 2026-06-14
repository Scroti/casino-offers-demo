package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/repository"
)

type CasinoService struct{ repo *repository.CasinoRepo }

func NewCasinoService(repo *repository.CasinoRepo) *CasinoService { return &CasinoService{repo: repo} }

func (s *CasinoService) List(ctx context.Context, limit, offset int) ([]models.Casino, error) {
	return s.repo.List(ctx, limit, offset)
}

func (s *CasinoService) Get(ctx context.Context, id uuid.UUID) (*models.Casino, error) {
	c, err := s.repo.Get(ctx, id)
	return c, mapNotFound(err)
}

func (s *CasinoService) Create(ctx context.Context, c *models.Casino) (*models.Casino, error) {
	return s.repo.Create(ctx, c)
}

func (s *CasinoService) Update(ctx context.Context, c *models.Casino) (*models.Casino, error) {
	updated, err := s.repo.Update(ctx, c)
	return updated, mapNotFound(err)
}

func (s *CasinoService) Delete(ctx context.Context, id uuid.UUID) error {
	return mapNotFound(s.repo.Delete(ctx, id))
}

func mapNotFound(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	return err
}
