package config

import (
	"time"

	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	Port        string `default:"8080"`
	Environment string `default:"development"`
	AppName     string `envconfig:"APP_NAME" default:"Playwise Guru"`

	DatabaseURL string `envconfig:"DATABASE_URL" required:"true"`

	JWTSecret        string        `envconfig:"JWT_SECRET" required:"true"`
	JWTRefreshSecret string        `envconfig:"JWT_REFRESH_SECRET" required:"true"`
	AccessTokenTTL   time.Duration `envconfig:"JWT_EXPIRES" default:"15m"`
	RefreshTokenTTL  time.Duration `envconfig:"JWT_REFRESH_EXPIRES" default:"168h"`

	CORSOrigins []string `envconfig:"CORS_ORIGINS" default:"http://localhost:3000"`
	FrontendURL string   `envconfig:"FRONTEND_URL" default:"http://localhost:3000"`

	ResendAPIKey string `envconfig:"RESEND_API_KEY" required:"true"`
	EmailFrom    string `envconfig:"EMAIL_FROM" required:"true"`
	EmailLogoURL string `envconfig:"EMAIL_LOGO_URL"`
	SupportEmail string `envconfig:"SUPPORT_EMAIL"`

	NewsAPIKey string `envconfig:"NEWS_API_KEY"`

	// Used by the mongo→postgres migration tool only.
	MongoURI    string `envconfig:"MONGO_URI"`
	MongoDBName string `envconfig:"MONGO_DB_NAME" default:"casino-offers-dev"`
}

func Load() (*Config, error) {
	var c Config
	if err := envconfig.Process("", &c); err != nil {
		return nil, err
	}
	return &c, nil
}
