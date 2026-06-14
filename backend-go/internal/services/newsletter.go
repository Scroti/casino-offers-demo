package services

import (
	"context"
	"errors"
	"strings"

	"github.com/jackc/pgx/v5"

	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/repository"
)

type NewsletterService struct{ repo *repository.NewsletterRepo }

func NewNewsletterService(repo *repository.NewsletterRepo) *NewsletterService {
	return &NewsletterService{repo: repo}
}

func (s *NewsletterService) Subscribe(ctx context.Context, emailAddr string) (*models.NewsletterSubscription, error) {
	return s.repo.Subscribe(ctx, strings.ToLower(strings.TrimSpace(emailAddr)))
}

func (s *NewsletterService) Unsubscribe(ctx context.Context, emailAddr string) (*models.NewsletterSubscription, error) {
	sub, err := s.repo.Unsubscribe(ctx, strings.ToLower(strings.TrimSpace(emailAddr)))
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrNotFound
	}
	return sub, err
}

func (s *NewsletterService) IsSubscribed(ctx context.Context, emailAddr string) (bool, error) {
	sub, err := s.repo.GetByEmail(ctx, strings.ToLower(strings.TrimSpace(emailAddr)))
	if errors.Is(err, pgx.ErrNoRows) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return sub.Status == "active", nil
}
