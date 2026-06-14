package models

import (
	"time"

	"github.com/google/uuid"
)

type Role string
type Status string
type Gender string

const (
	RoleUser      Role = "user"
	RoleAdmin     Role = "admin"
	RoleModerator Role = "moderator"

	StatusActive   Status = "active"
	StatusInactive Status = "inactive"
	StatusBanned   Status = "banned"
	StatusPending  Status = "pending"

	GenderMale   Gender = "male"
	GenderFemale Gender = "female"
	GenderNone   Gender = "prefer-not-to-say"
)

type User struct {
	ID              uuid.UUID  `json:"id"`
	Name            *string    `json:"name,omitempty"`
	Email           string     `json:"email"`
	PasswordHash    string     `json:"-"`
	Role            Role       `json:"role"`
	Status          Status     `json:"status"`
	ProfileImageURL *string    `json:"profileImageUrl,omitempty"`
	IsVerified      bool       `json:"isVerified"`
	LastLogin       *time.Time `json:"lastLogin,omitempty"`
	TotalBonuses    int        `json:"totalBonuses"`
	TotalSpent      float64    `json:"totalSpent"`
	Country         *string    `json:"country,omitempty"`
	Language        *string    `json:"language,omitempty"`
	Gender          *Gender    `json:"gender,omitempty"`
	AgeRange        *string    `json:"ageRange,omitempty"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

// PublicProfile is the safe subset returned by GET /auth/me.
type PublicProfile struct {
	ID              uuid.UUID `json:"id"`
	Name            *string   `json:"name,omitempty"`
	Email           string    `json:"email"`
	ProfileImageURL *string   `json:"profileImageUrl,omitempty"`
	Role            Role      `json:"role"`
}

func (u *User) ToPublicProfile() PublicProfile {
	return PublicProfile{
		ID:              u.ID,
		Name:            u.Name,
		Email:           u.Email,
		ProfileImageURL: u.ProfileImageURL,
		Role:            u.Role,
	}
}
