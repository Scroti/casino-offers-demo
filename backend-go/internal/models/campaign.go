package models

import (
	"time"

	"github.com/google/uuid"
)

type Campaign struct {
	ID               uuid.UUID  `json:"id"`
	Token            string     `json:"token"`
	Name             string     `json:"name"`
	Description      *string    `json:"description,omitempty"`
	IsActive         bool       `json:"isActive"`
	ExpiresAt        *time.Time `json:"expiresAt,omitempty"`
	StartsAt         *time.Time `json:"startsAt,omitempty"`
	ClickCount       int64      `json:"clickCount"`
	BonusAccessCount int64      `json:"bonusAccessCount"`
	CreatedBy        *string    `json:"createdBy,omitempty"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        time.Time  `json:"updatedAt"`
}
