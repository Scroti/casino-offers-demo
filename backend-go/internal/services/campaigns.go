package services

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/repository"
)

type CampaignService struct{ repo *repository.CampaignRepo }

func NewCampaignService(repo *repository.CampaignRepo) *CampaignService {
	return &CampaignService{repo: repo}
}

func (s *CampaignService) List(ctx context.Context) ([]models.Campaign, error) {
	return s.repo.List(ctx)
}

func (s *CampaignService) Get(ctx context.Context, id uuid.UUID) (*models.Campaign, error) {
	c, err := s.repo.Get(ctx, id)
	return c, mapNotFound(err)
}

func (s *CampaignService) Create(ctx context.Context, c *models.Campaign) (*models.Campaign, error) {
	return s.repo.Create(ctx, c)
}

func (s *CampaignService) Update(ctx context.Context, c *models.Campaign) (*models.Campaign, error) {
	updated, err := s.repo.Update(ctx, c)
	return updated, mapNotFound(err)
}

func (s *CampaignService) Delete(ctx context.Context, id uuid.UUID) error {
	return mapNotFound(s.repo.Delete(ctx, id))
}

type ValidateResult struct {
	Valid    bool             `json:"valid"`
	Message  string           `json:"message,omitempty"`
	Campaign *models.Campaign `json:"campaign,omitempty"`
}

func (s *CampaignService) ValidateToken(ctx context.Context, token string) (*ValidateResult, error) {
	c, err := s.repo.GetByToken(ctx, token)
	if err != nil {
		return &ValidateResult{Valid: false, Message: "campaign not found"}, nil
	}
	if !c.IsActive {
		return &ValidateResult{Valid: false, Message: "campaign is not active"}, nil
	}
	now := time.Now()
	if c.StartsAt != nil && c.StartsAt.After(now) {
		return &ValidateResult{Valid: false, Message: "campaign has not started"}, nil
	}
	if c.ExpiresAt != nil && c.ExpiresAt.Before(now) {
		return &ValidateResult{Valid: false, Message: "campaign expired"}, nil
	}

	_ = s.repo.IncrementClickCount(ctx, c.ID)
	return &ValidateResult{Valid: true, Campaign: c}, nil
}
