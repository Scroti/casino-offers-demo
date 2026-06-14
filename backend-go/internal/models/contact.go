package models

import (
	"time"

	"github.com/google/uuid"
)

type ContactMessage struct {
	ID          uuid.UUID  `json:"id"`
	Name        string     `json:"name"`
	Email       string     `json:"email"`
	Subject     string     `json:"subject"`
	Category    string     `json:"category"`
	Message     string     `json:"message"`
	IsRead      bool       `json:"isRead"`
	IsResolved  bool       `json:"isResolved"`
	Response    *string    `json:"response,omitempty"`
	RespondedAt *time.Time `json:"respondedAt,omitempty"`
	UserID      *uuid.UUID `json:"userId,omitempty"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}
