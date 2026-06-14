package services

import (
	"context"

	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/repository"
)

type ContactService struct{ repo *repository.ContactRepo }

func NewContactService(repo *repository.ContactRepo) *ContactService {
	return &ContactService{repo: repo}
}

func (s *ContactService) Create(ctx context.Context, c *models.ContactMessage) (*models.ContactMessage, error) {
	return s.repo.Create(ctx, c)
}

func (s *ContactService) List(ctx context.Context, limit, offset int) ([]models.ContactMessage, error) {
	return s.repo.List(ctx, limit, offset)
}

func (s *ContactService) Get(ctx context.Context, id uuid.UUID) (*models.ContactMessage, error) {
	c, err := s.repo.Get(ctx, id)
	return c, mapNotFound(err)
}

func (s *ContactService) MarkRead(ctx context.Context, id uuid.UUID) error {
	return s.repo.MarkRead(ctx, id)
}

func (s *ContactService) Resolve(ctx context.Context, id uuid.UUID, response *string) error {
	return s.repo.Resolve(ctx, id, response)
}
