package auth

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/models"
)

type Claims struct {
	UserID uuid.UUID   `json:"sub"`
	Email  string      `json:"email"`
	Role   models.Role `json:"role"`
	jwt.RegisteredClaims
}

type JWTService struct {
	accessSecret  []byte
	refreshSecret []byte
	accessTTL     time.Duration
	refreshTTL    time.Duration
}

func NewJWTService(accessSecret, refreshSecret string, accessTTL, refreshTTL time.Duration) *JWTService {
	return &JWTService{
		accessSecret:  []byte(accessSecret),
		refreshSecret: []byte(refreshSecret),
		accessTTL:     accessTTL,
		refreshTTL:    refreshTTL,
	}
}

func (s *JWTService) SignAccess(userID uuid.UUID, email string, role models.Role) (string, error) {
	return s.sign(s.accessSecret, s.accessTTL, userID, email, role)
}

func (s *JWTService) SignRefresh(userID uuid.UUID, email string, role models.Role) (string, error) {
	return s.sign(s.refreshSecret, s.refreshTTL, userID, email, role)
}

func (s *JWTService) sign(secret []byte, ttl time.Duration, userID uuid.UUID, email string, role models.Role) (string, error) {
	now := time.Now()
	claims := Claims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(ttl)),
		},
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(secret)
}

func (s *JWTService) ParseAccess(token string) (*Claims, error) {
	return s.parse(token, s.accessSecret)
}

func (s *JWTService) ParseRefresh(token string) (*Claims, error) {
	return s.parse(token, s.refreshSecret)
}

func (s *JWTService) parse(tokenStr string, secret []byte) (*Claims, error) {
	var claims Claims
	_, err := jwt.ParseWithClaims(tokenStr, &claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return secret, nil
	})
	if err != nil {
		return nil, err
	}
	return &claims, nil
}

// AuthMiddleware enforces a valid Bearer access token. Subsequent handlers
// can read the claims via ClaimsFromContext.
func (s *JWTService) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := bearerToken(r)
		if token == "" {
			writeUnauthorized(w, "missing token")
			return
		}
		claims, err := s.ParseAccess(token)
		if err != nil {
			writeUnauthorized(w, "invalid token")
			return
		}
		ctx := context.WithValue(r.Context(), claimsKey{}, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// OptionalAuth attaches claims when a valid token is present, but does not
// reject anonymous requests. Useful for endpoints that behave differently
// when a user is logged in (e.g. attaching user_id to a contact form).
func (s *JWTService) OptionalAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := bearerToken(r)
		if token != "" {
			if claims, err := s.ParseAccess(token); err == nil {
				ctx := context.WithValue(r.Context(), claimsKey{}, claims)
				r = r.WithContext(ctx)
			}
		}
		next.ServeHTTP(w, r)
	})
}

// RequireRole returns a middleware that enforces one of the given roles.
// Must be chained AFTER AuthMiddleware.
func RequireRole(roles ...models.Role) func(http.Handler) http.Handler {
	allowed := make(map[models.Role]struct{}, len(roles))
	for _, r := range roles {
		allowed[r] = struct{}{}
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := ClaimsFromContext(r.Context())
			if !ok {
				writeUnauthorized(w, "unauthenticated")
				return
			}
			if _, ok := allowed[claims.Role]; !ok {
				writeForbidden(w, "insufficient role")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

type claimsKey struct{}

func ClaimsFromContext(ctx context.Context) (*Claims, bool) {
	c, ok := ctx.Value(claimsKey{}).(*Claims)
	return c, ok
}

func bearerToken(r *http.Request) string {
	h := r.Header.Get("Authorization")
	if h == "" {
		return ""
	}
	parts := strings.SplitN(h, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return ""
	}
	return strings.TrimSpace(parts[1])
}

func writeUnauthorized(w http.ResponseWriter, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	_, _ = w.Write([]byte(`{"error":"` + msg + `"}`))
}

func writeForbidden(w http.ResponseWriter, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusForbidden)
	_, _ = w.Write([]byte(`{"error":"` + msg + `"}`))
}
