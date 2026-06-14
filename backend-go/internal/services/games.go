package services

import (
	"context"

	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/repository"
)

type GameService struct{ repo *repository.GameRepo }

func NewGameService(repo *repository.GameRepo) *GameService { return &GameService{repo: repo} }

func (s *GameService) List(ctx context.Context, activeOnly bool, limit, offset int) ([]models.Game, error) {
	return s.repo.List(ctx, activeOnly, limit, offset)
}

func (s *GameService) Get(ctx context.Context, id uuid.UUID) (*models.Game, error) {
	g, err := s.repo.Get(ctx, id)
	return g, mapNotFound(err)
}

func (s *GameService) GetByGameID(ctx context.Context, gameID string) (*models.Game, error) {
	g, err := s.repo.GetByGameID(ctx, gameID)
	return g, mapNotFound(err)
}

func (s *GameService) Create(ctx context.Context, g *models.Game) (*models.Game, error) {
	return s.repo.Create(ctx, g)
}

func (s *GameService) BulkCreate(ctx context.Context, games []models.Game) ([]models.Game, error) {
	out := make([]models.Game, 0, len(games))
	for i := range games {
		created, err := s.repo.Create(ctx, &games[i])
		if err != nil {
			continue // skip duplicates (unique constraint) — keep going
		}
		out = append(out, *created)
	}
	return out, nil
}

func (s *GameService) Update(ctx context.Context, g *models.Game) (*models.Game, error) {
	updated, err := s.repo.Update(ctx, g)
	return updated, mapNotFound(err)
}

func (s *GameService) Delete(ctx context.Context, id uuid.UUID) error {
	return mapNotFound(s.repo.Delete(ctx, id))
}

func (s *GameService) IncrementViews(ctx context.Context, id uuid.UUID) error {
	return s.repo.IncrementViews(ctx, id)
}

func (s *GameService) IncrementPlays(ctx context.Context, id uuid.UUID) error {
	return s.repo.IncrementPlays(ctx, id)
}
