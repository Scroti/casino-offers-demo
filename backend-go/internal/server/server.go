package server

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/playwise-guru/backend/internal/auth"
	"github.com/playwise-guru/backend/internal/config"
	"github.com/playwise-guru/backend/internal/email"
	"github.com/playwise-guru/backend/internal/handlers"
	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/repository"
	"github.com/playwise-guru/backend/internal/services"
)

type Server struct {
	cfg  *config.Config
	jwt  *auth.JWTService

	health     *handlers.HealthHandler
	authH      *handlers.AuthHandler
	users      *handlers.UserHandler
	casinos    *handlers.CasinoHandler
	bonuses    *handlers.BonusHandler
	games      *handlers.GameHandler
	guides     *handlers.GuideHandler
	campaigns  *handlers.CampaignHandler
	contact    *handlers.ContactHandler
	newsletter *handlers.NewsletterHandler
	news       *handlers.NewsHandler
}

func New(cfg *config.Config, pool *pgxpool.Pool, mailer *email.Resend) *Server {
	jwtSvc := auth.NewJWTService(cfg.JWTSecret, cfg.JWTRefreshSecret, cfg.AccessTokenTTL, cfg.RefreshTokenTTL)

	// Repos
	userRepo := repository.NewUserRepo(pool)
	casinoRepo := repository.NewCasinoRepo(pool)
	bonusRepo := repository.NewBonusRepo(pool)
	gameRepo := repository.NewGameRepo(pool)
	guideRepo := repository.NewGuideRepo(pool)
	campaignRepo := repository.NewCampaignRepo(pool)
	contactRepo := repository.NewContactRepo(pool)
	newsletterRepo := repository.NewNewsletterRepo(pool)

	// Services
	authSvc := services.NewAuthService(userRepo, jwtSvc, mailer, cfg.FrontendURL)
	userSvc := services.NewUserService(userRepo, mailer)
	casinoSvc := services.NewCasinoService(casinoRepo)
	bonusSvc := services.NewBonusService(bonusRepo)
	gameSvc := services.NewGameService(gameRepo)
	guideSvc := services.NewGuideService(guideRepo)
	campaignSvc := services.NewCampaignService(campaignRepo)
	contactSvc := services.NewContactService(contactRepo)
	newsletterSvc := services.NewNewsletterService(newsletterRepo)
	newsSvc := services.NewNewsService(cfg.NewsAPIKey)

	return &Server{
		cfg: cfg, jwt: jwtSvc,
		health:     handlers.NewHealthHandler(pool),
		authH:      handlers.NewAuthHandler(authSvc),
		users:      handlers.NewUserHandler(userSvc),
		casinos:    handlers.NewCasinoHandler(casinoSvc),
		bonuses:    handlers.NewBonusHandler(bonusSvc),
		games:      handlers.NewGameHandler(gameSvc),
		guides:     handlers.NewGuideHandler(guideSvc),
		campaigns:  handlers.NewCampaignHandler(campaignSvc),
		contact:    handlers.NewContactHandler(contactSvc),
		newsletter: handlers.NewNewsletterHandler(newsletterSvc),
		news:       handlers.NewNewsHandler(newsSvc),
	}
}

func (s *Server) Router() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RealIP)
	r.Use(middleware.RequestID)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(30 * time.Second))
	r.Use(requestLogger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   s.cfg.CORSOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/health", s.health.Check)

	r.Route("/api/v1", func(r chi.Router) {
		s.mountAuth(r)
		s.mountUsers(r)
		s.mountCasinos(r)
		s.mountBonuses(r)
		s.mountGames(r)
		s.mountGuides(r)
		s.mountCampaigns(r)
		s.mountContact(r)
		s.mountNewsletter(r)
		s.mountNews(r)
	})

	return r
}

func (s *Server) mountAuth(r chi.Router) {
	r.Route("/auth", func(r chi.Router) {
		r.Post("/signup", s.authH.Register)
		r.Post("/login", s.authH.Login)
		r.Post("/refresh", s.authH.Refresh)
		r.Post("/forgot-password", s.authH.ForgotPassword)
		r.Post("/reset-password", s.authH.ResetPassword)
		r.Post("/verify-email", s.authH.VerifyEmail)
		r.Post("/resend-verification", s.authH.ResendVerification)

		r.Group(func(r chi.Router) {
			r.Use(s.jwt.AuthMiddleware)
			r.Get("/me", s.authH.Me)
			r.Post("/logout", s.authH.Logout)
			r.Patch("/profile", s.authH.UpdateProfile)
		})
	})
}

func (s *Server) mountUsers(r chi.Router) {
	r.Route("/users", func(r chi.Router) {
		r.Use(s.jwt.AuthMiddleware)

		// admin + moderator
		r.Group(func(r chi.Router) {
			r.Use(auth.RequireRole(models.RoleAdmin, models.RoleModerator))
			r.Get("/", s.users.List)
			r.Get("/{id}", s.users.Get)
			r.Patch("/{id}/status", s.users.SetStatus)
			r.Patch("/{id}/verify", s.users.Verify)
			r.Post("/bulk-status", s.users.BulkSetStatus)
		})

		// admin only
		r.Group(func(r chi.Router) {
			r.Use(auth.RequireRole(models.RoleAdmin))
			r.Post("/", s.users.Create)
			r.Delete("/{id}", s.users.Delete)
			r.Patch("/{id}/role", s.users.SetRole)
			r.Post("/{id}/email", s.users.SendEmail)
			r.Post("/bulk-delete", s.users.BulkDelete)
		})
	})
}

func (s *Server) mountCasinos(r chi.Router) {
	r.Route("/casinos", func(r chi.Router) {
		r.Get("/", s.casinos.List)
		r.Get("/{id}", s.casinos.Get)

		r.Group(func(r chi.Router) {
			r.Use(s.jwt.AuthMiddleware, auth.RequireRole(models.RoleAdmin))
			r.Post("/", s.casinos.Create)
			r.Patch("/{id}", s.casinos.Update)
			r.Delete("/{id}", s.casinos.Delete)
		})
	})
}

func (s *Server) mountBonuses(r chi.Router) {
	r.Route("/bonuses", func(r chi.Router) {
		r.Get("/", s.bonuses.List)
		r.Get("/casino/{casinoId}", s.bonuses.ListByCasino)
		r.Get("/{id}", s.bonuses.Get)

		r.Group(func(r chi.Router) {
			r.Use(s.jwt.AuthMiddleware, auth.RequireRole(models.RoleAdmin))
			r.Post("/", s.bonuses.Create)
			r.Patch("/{id}", s.bonuses.Update)
			r.Delete("/{id}", s.bonuses.Delete)
		})
	})
}

func (s *Server) mountGames(r chi.Router) {
	r.Route("/games", func(r chi.Router) {
		r.Get("/", s.games.List)
		r.Get("/active", s.games.ListActive)
		r.Get("/gameId/{gameId}", s.games.GetByGameID)
		r.Get("/{id}", s.games.Get)
		r.Post("/{id}/increment-views", s.games.IncrementViews)
		r.Post("/{id}/increment-plays", s.games.IncrementPlays)

		r.Group(func(r chi.Router) {
			r.Use(s.jwt.AuthMiddleware, auth.RequireRole(models.RoleAdmin))
			r.Post("/", s.games.Create)
			r.Post("/seed", s.games.Seed)
			r.Patch("/{id}", s.games.Update)
			r.Delete("/{id}", s.games.Delete)
		})
	})
}

func (s *Server) mountGuides(r chi.Router) {
	r.Route("/guides", func(r chi.Router) {
		r.Get("/", s.guides.List)
		r.Get("/featured", s.guides.Featured)
		r.Get("/category/{category}", s.guides.ByCategory)
		r.Get("/slug/{slug}", s.guides.GetBySlug)
		r.Get("/{id}", s.guides.Get)
		r.Post("/{id}/view", s.guides.IncrementViews)

		r.Group(func(r chi.Router) {
			r.Use(s.jwt.AuthMiddleware, auth.RequireRole(models.RoleAdmin))
			r.Post("/", s.guides.Create)
			r.Patch("/{id}", s.guides.Update)
			r.Delete("/{id}", s.guides.Delete)
		})
	})
}

func (s *Server) mountCampaigns(r chi.Router) {
	r.Route("/campaigns", func(r chi.Router) {
		r.Get("/validate", s.campaigns.Validate) // public

		r.Group(func(r chi.Router) {
			r.Use(s.jwt.AuthMiddleware, auth.RequireRole(models.RoleAdmin))
			r.Get("/", s.campaigns.List)
			r.Get("/{id}", s.campaigns.Get)
			r.Post("/", s.campaigns.Create)
			r.Patch("/{id}", s.campaigns.Update)
			r.Delete("/{id}", s.campaigns.Delete)
		})
	})
}

func (s *Server) mountContact(r chi.Router) {
	r.Route("/contact", func(r chi.Router) {
		// Public creation with OPTIONAL auth so user_id attaches when present.
		r.With(s.jwt.OptionalAuth).Post("/", s.contact.Create)

		r.Group(func(r chi.Router) {
			r.Use(s.jwt.AuthMiddleware, auth.RequireRole(models.RoleAdmin))
			r.Get("/", s.contact.List)
			r.Get("/{id}", s.contact.Get)
			r.Patch("/{id}/read", s.contact.MarkRead)
			r.Patch("/{id}/resolve", s.contact.Resolve)
		})
	})
}

func (s *Server) mountNewsletter(r chi.Router) {
	r.Route("/newsletter", func(r chi.Router) {
		r.Post("/subscribe", s.newsletter.Subscribe)
		r.Post("/unsubscribe", s.newsletter.Unsubscribe)
		r.Post("/check", s.newsletter.Check)
	})
}

func (s *Server) mountNews(r chi.Router) {
	r.Get("/news", s.news.Fetch)
}
