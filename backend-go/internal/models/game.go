package models

import (
	"time"

	"github.com/google/uuid"
)

type Game struct {
	ID                    uuid.UUID `json:"id"`
	GameID                string    `json:"gameId"`
	CasinoGuruIdentifier  *string   `json:"casinoGuruIdentifier,omitempty"`
	Title                 string    `json:"title"`
	EmbedURL              *string   `json:"embedUrl,omitempty"`
	Thumbnail             *string   `json:"thumbnail,omitempty"`
	Category              string    `json:"category"`
	Description           *string   `json:"description,omitempty"`
	Provider              string    `json:"provider"`
	IsActive              bool      `json:"isActive"`
	Views                 int64     `json:"views"`
	Plays                 int64     `json:"plays"`
	CreatedAt             time.Time `json:"createdAt"`
	UpdatedAt             time.Time `json:"updatedAt"`
}
