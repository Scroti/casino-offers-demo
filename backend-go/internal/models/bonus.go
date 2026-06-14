package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Bonus struct {
	ID                 uuid.UUID       `json:"id"`
	CasinoID           *uuid.UUID      `json:"casinoId,omitempty"`
	Title              string          `json:"title"`
	Description        json.RawMessage `json:"description"`
	Price              string          `json:"price"`
	Rating             float64         `json:"rating"`
	Type               string          `json:"type"`
	Image              string          `json:"image"`
	Href               *string         `json:"href,omitempty"`
	IsExclusive        bool            `json:"isExclusive"`
	CasinoName         *string         `json:"casinoName,omitempty"`
	CasinoLogo         *string         `json:"casinoLogo,omitempty"`
	CasinoImage        *string         `json:"casinoImage,omitempty"`
	SafetyIndex        *float64        `json:"safetyIndex,omitempty"`
	CountryFlag        *string         `json:"countryFlag,omitempty"`
	CountryCode        *string         `json:"countryCode,omitempty"`
	PromoCode          *string         `json:"promoCode,omitempty"`
	BonusInstructions  *string         `json:"bonusInstructions,omitempty"`
	ReviewLink         *string         `json:"reviewLink,omitempty"`
	WageringRequirement json.RawMessage `json:"wageringRequirement"`
	BonusValue         json.RawMessage `json:"bonusValue"`
	MaxBet             json.RawMessage `json:"maxBet"`
	Expiration         json.RawMessage `json:"expiration"`
	ClaimSpeed         json.RawMessage `json:"claimSpeed"`
	TermsConditions    json.RawMessage `json:"termsConditions"`
	CustomSections     json.RawMessage `json:"customSections"`
	CreatedAt          time.Time       `json:"createdAt"`
	UpdatedAt          time.Time       `json:"updatedAt"`
}
