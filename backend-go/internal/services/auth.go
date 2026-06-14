package services

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/playwise-guru/backend/internal/auth"
	"github.com/playwise-guru/backend/internal/email"
	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/repository"
)

type AuthService struct {
	users       *repository.UserRepo
	jwt         *auth.JWTService
	mailer      *email.Resend
	frontendURL string
}

func NewAuthService(users *repository.UserRepo, jwtSvc *auth.JWTService, mailer *email.Resend, frontendURL string) *AuthService {
	return &AuthService{users: users, jwt: jwtSvc, mailer: mailer, frontendURL: frontendURL}
}

type RegisterInput struct {
	Name     string
	Email    string
	Password string
	Country  *string
	Language *string
}

type RegisterResult struct {
	UserID              uuid.UUID
	RequiresVerification bool
}

func (s *AuthService) Register(ctx context.Context, in RegisterInput) (*RegisterResult, error) {
	emailNormalized := strings.ToLower(strings.TrimSpace(in.Email))

	if _, err := s.users.GetByEmail(ctx, emailNormalized); err == nil {
		return nil, ErrAlreadyExists
	} else if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
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

	u, err := s.users.Create(ctx, repository.CreateUserParams{
		Name:         namePtr,
		Email:        emailNormalized,
		PasswordHash: hash,
		Role:         models.RoleUser,
		Country:      in.Country,
		Language:     in.Language,
	})
	if err != nil {
		return nil, err
	}

	// Generate verification token (24h) + 6-digit code (15 min).
	token, _ := auth.RandomHex(32)
	code, _ := auth.RandomDigits(6)
	if err := s.users.SetVerificationToken(ctx, u.ID, token, code,
		time.Now().Add(24*time.Hour), time.Now().Add(15*time.Minute)); err != nil {
		return nil, err
	}

	link := fmt.Sprintf("%s/verify-email?token=%s", s.frontendURL, token)
	s.mailer.SendVerification(ctx, u.Email, derefStr(u.Name), link, code)

	return &RegisterResult{UserID: u.ID, RequiresVerification: true}, nil
}

type LoginResult struct {
	AccessToken  string
	RefreshToken string
	User         models.PublicProfile
}

func (s *AuthService) Login(ctx context.Context, emailAddr, password string) (*LoginResult, error) {
	u, err := s.users.GetByEmail(ctx, strings.ToLower(strings.TrimSpace(emailAddr)))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if !auth.VerifyPassword(u.PasswordHash, password) {
		return nil, ErrInvalidCredentials
	}
	if !u.IsVerified {
		return nil, ErrNotVerified
	}

	access, err := s.jwt.SignAccess(u.ID, u.Email, u.Role)
	if err != nil {
		return nil, err
	}
	refresh, err := s.jwt.SignRefresh(u.ID, u.Email, u.Role)
	if err != nil {
		return nil, err
	}

	hash := auth.Hash(refresh)
	if err := s.users.SetRefreshTokenHash(ctx, u.ID, &hash); err != nil {
		return nil, err
	}
	_ = s.users.TouchLogin(ctx, u.ID)

	return &LoginResult{AccessToken: access, RefreshToken: refresh, User: u.ToPublicProfile()}, nil
}

func (s *AuthService) Refresh(ctx context.Context, refreshToken string) (*LoginResult, error) {
	claims, err := s.jwt.ParseRefresh(refreshToken)
	if err != nil {
		return nil, ErrInvalidToken
	}

	storedHash, err := s.users.GetRefreshTokenHash(ctx, claims.UserID)
	if err != nil {
		return nil, ErrInvalidToken
	}
	if storedHash == "" || storedHash != auth.Hash(refreshToken) {
		return nil, ErrInvalidToken
	}

	u, err := s.users.GetByID(ctx, claims.UserID)
	if err != nil {
		return nil, ErrInvalidToken
	}

	newAccess, err := s.jwt.SignAccess(u.ID, u.Email, u.Role)
	if err != nil {
		return nil, err
	}
	newRefresh, err := s.jwt.SignRefresh(u.ID, u.Email, u.Role)
	if err != nil {
		return nil, err
	}
	newHash := auth.Hash(newRefresh)
	if err := s.users.SetRefreshTokenHash(ctx, u.ID, &newHash); err != nil {
		return nil, err
	}

	return &LoginResult{AccessToken: newAccess, RefreshToken: newRefresh, User: u.ToPublicProfile()}, nil
}

func (s *AuthService) Logout(ctx context.Context, userID uuid.UUID) error {
	return s.users.SetRefreshTokenHash(ctx, userID, nil)
}

func (s *AuthService) Me(ctx context.Context, userID uuid.UUID) (*models.PublicProfile, error) {
	u, err := s.users.GetByID(ctx, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	p := u.ToPublicProfile()
	return &p, nil
}

func (s *AuthService) UpdateProfile(ctx context.Context, userID uuid.UUID, p repository.UpdateProfileParams) (*models.User, error) {
	return s.users.UpdateProfile(ctx, userID, p)
}

func (s *AuthService) ForgotPassword(ctx context.Context, emailAddr string) error {
	u, err := s.users.GetByEmail(ctx, strings.ToLower(strings.TrimSpace(emailAddr)))
	if err != nil {
		// Don't leak account existence: return success either way.
		if errors.Is(err, pgx.ErrNoRows) {
			return nil
		}
		return err
	}

	token, _ := auth.RandomHex(32)
	if err := s.users.SetPasswordResetToken(ctx, u.ID, token, time.Now().Add(time.Hour)); err != nil {
		return err
	}
	link := fmt.Sprintf("%s/reset-password?token=%s", s.frontendURL, token)
	s.mailer.SendPasswordReset(ctx, u.Email, derefStr(u.Name), link)
	return nil
}

func (s *AuthService) ResetPassword(ctx context.Context, token, newPassword string) error {
	u, err := s.users.FindByResetToken(ctx, token)
	if err != nil {
		return ErrInvalidToken
	}
	hash, err := auth.HashPassword(newPassword)
	if err != nil {
		return err
	}
	return s.users.ResetPassword(ctx, u.ID, hash)
}

func (s *AuthService) VerifyEmail(ctx context.Context, token, code string) error {
	var u *models.User
	var err error
	if token != "" {
		u, err = s.users.FindByVerificationToken(ctx, token)
	} else if code != "" {
		u, err = s.users.FindByVerificationCode(ctx, code)
	} else {
		return ErrInvalidToken
	}
	if err != nil {
		return ErrInvalidToken
	}
	return s.users.ClearVerification(ctx, u.ID)
}

func (s *AuthService) ResendVerification(ctx context.Context, emailAddr string) error {
	u, err := s.users.GetByEmail(ctx, strings.ToLower(strings.TrimSpace(emailAddr)))
	if err != nil {
		// Same anti-enumeration behavior.
		if errors.Is(err, pgx.ErrNoRows) {
			return nil
		}
		return err
	}
	if u.IsVerified {
		return nil
	}

	token, _ := auth.RandomHex(32)
	code, _ := auth.RandomDigits(6)
	if err := s.users.SetVerificationToken(ctx, u.ID, token, code,
		time.Now().Add(24*time.Hour), time.Now().Add(15*time.Minute)); err != nil {
		return err
	}
	link := fmt.Sprintf("%s/verify-email?token=%s", s.frontendURL, token)
	s.mailer.SendVerification(ctx, u.Email, derefStr(u.Name), link, code)
	return nil
}

func derefStr(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
