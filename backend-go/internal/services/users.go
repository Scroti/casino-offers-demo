package services

import (
	"context"
	"errors"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/playwise-guru/backend/internal/auth"
	"github.com/playwise-guru/backend/internal/email"
	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/repository"
)

type UserService struct {
	users  *repository.UserRepo
	mailer *email.Resend
}

func NewUserService(users *repository.UserRepo, mailer *email.Resend) *UserService {
	return &UserService{users: users, mailer: mailer}
}

func (s *UserService) List(ctx context.Context, limit, offset int) ([]models.User, error) {
	return s.users.List(ctx, limit, offset)
}

func (s *UserService) Get(ctx context.Context, id uuid.UUID) (*models.User, error) {
	u, err := s.users.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return u, nil
}

type AdminCreateUserInput struct {
	Name     string
	Email    string
	Password string
	Role     models.Role
}

func (s *UserService) AdminCreate(ctx context.Context, in AdminCreateUserInput) (*models.User, error) {
	emailNormalized := strings.ToLower(strings.TrimSpace(in.Email))
	if _, err := s.users.GetByEmail(ctx, emailNormalized); err == nil {
		return nil, ErrAlreadyExists
	}
	hash, err := auth.HashPassword(in.Password)
	if err != nil {
		return nil, err
	}
	name := strings.TrimSpace(in.Name)
	var namePtr *string
	if name != "" {
		namePtr = &name
	}
	role := in.Role
	if role == "" {
		role = models.RoleUser
	}
	return s.users.Create(ctx, repository.CreateUserParams{
		Name:         namePtr,
		Email:        emailNormalized,
		PasswordHash: hash,
		Role:         role,
	})
}

func (s *UserService) Delete(ctx context.Context, id uuid.UUID, callerID uuid.UUID) error {
	if id == callerID {
		return ErrForbidden
	}
	return s.users.Delete(ctx, id)
}

func (s *UserService) SetStatus(ctx context.Context, id uuid.UUID, callerID uuid.UUID, status models.Status) error {
	if id == callerID {
		return ErrForbidden
	}
	return s.users.SetStatus(ctx, id, status)
}

func (s *UserService) SetRole(ctx context.Context, id uuid.UUID, callerID uuid.UUID, role models.Role) error {
	if id == callerID {
		return ErrForbidden
	}
	return s.users.SetRole(ctx, id, role)
}

func (s *UserService) Verify(ctx context.Context, id uuid.UUID) error {
	return s.users.SetVerified(ctx, id, true)
}

func (s *UserService) SendCustomEmail(ctx context.Context, id uuid.UUID, subject, message string) error {
	u, err := s.users.GetByID(ctx, id)
	if err != nil {
		return ErrNotFound
	}
	s.mailer.SendCustom(ctx, u.Email, derefStr(u.Name), subject, message)
	return nil
}

func (s *UserService) BulkDelete(ctx context.Context, ids []uuid.UUID, callerID uuid.UUID) (int, error) {
	deleted := 0
	for _, id := range ids {
		if id == callerID {
			continue
		}
		if err := s.users.Delete(ctx, id); err == nil {
			deleted++
		}
	}
	return deleted, nil
}

func (s *UserService) BulkSetStatus(ctx context.Context, ids []uuid.UUID, callerID uuid.UUID, status models.Status) (int, error) {
	changed := 0
	for _, id := range ids {
		if id == callerID {
			continue
		}
		if err := s.users.SetStatus(ctx, id, status); err == nil {
			changed++
		}
	}
	return changed, nil
}
