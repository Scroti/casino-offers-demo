package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Casino struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
	Slug *string   `json:"slug,omitempty"`

	// General info
	Founded            *string  `json:"founded,omitempty"`
	URL                *string  `json:"url,omitempty"`
	Facebook           *string  `json:"facebook,omitempty"`
	Advantages         []string `json:"advantages"`
	AffiliateSoftware  *string  `json:"affiliateSoftware,omitempty"`
	License            *string  `json:"license,omitempty"`
	Owner              *string  `json:"owner,omitempty"`
	CompanyAddress     *string  `json:"companyAddress,omitempty"`
	Accessibility      []string `json:"accessibility"`
	MobileApplication  bool     `json:"mobileApplication"`
	SiteLanguages      []string `json:"siteLanguages"`
	Currencies         []string `json:"currencies"`
	RestrictedCountries []string `json:"restrictedCountries"`
	AvailableCountries  []string `json:"availableCountries"`
	Wagering           *string  `json:"wagering,omitempty"`
	Partners           *string  `json:"partners,omitempty"`
	Version            *string  `json:"version,omitempty"`

	// Display
	Logo        *string  `json:"logo,omitempty"`
	Image       *string  `json:"image,omitempty"`
	SafetyIndex *float64 `json:"safetyIndex,omitempty"`
	CountryFlag *string  `json:"countryFlag,omitempty"`
	CountryCode *string  `json:"countryCode,omitempty"`

	// Heterogeneous JSON
	Features       json.RawMessage `json:"features"`
	AvailableGames json.RawMessage `json:"availableGames"`
	PaymentMethods json.RawMessage `json:"paymentMethods"`

	// Games
	GameProviders         []string `json:"gameProviders"`
	GamesAmount           *string  `json:"gamesAmount,omitempty"`
	SlotGames             *string  `json:"slotGames,omitempty"`
	JackpotGames          *string  `json:"jackpotGames,omitempty"`
	VideoPokerGames       *string  `json:"videoPokerGames,omitempty"`
	ScratchGames          *string  `json:"scratchGames,omitempty"`
	BingoGames            *string  `json:"bingoGames,omitempty"`
	LiveGamesAmount       *string  `json:"liveGamesAmount,omitempty"`
	SportsBetting         bool     `json:"sportsBetting"`
	LiveBetting           bool     `json:"liveBetting"`
	VirtualSportsBetting  bool     `json:"virtualSportsBetting"`

	// Payment
	DepositMethods             []string `json:"depositMethods"`
	WithdrawalMethods          []string `json:"withdrawalMethods"`
	MinimalDeposit             *string  `json:"minimalDeposit,omitempty"`
	MinimalPayout              *string  `json:"minimalPayout,omitempty"`
	MaxWithdrawalLimitPerMonth *string  `json:"maxWithdrawalLimitPerMonth,omitempty"`
	WithdrawalTime             *string  `json:"withdrawalTime,omitempty"`
	WithdrawFees               *string  `json:"withdrawFees,omitempty"`
	WithdrawWithActiveBonus    bool     `json:"withdrawWithActiveBonus"`

	// Support
	WorkingHours              *string  `json:"workingHours,omitempty"`
	ContactInfo               *string  `json:"contactInfo,omitempty"`
	LiveChatLanguages         []string `json:"liveChatLanguages"`
	PhoneLanguages            []string `json:"phoneLanguages"`
	EmailLanguages            []string `json:"emailLanguages"`
	AverageContactTime        *string  `json:"averageContactTime,omitempty"`
	WebsiteLanguages          []string `json:"websiteLanguages"`
	CustomerSupportLanguages  []string `json:"customerSupportLanguages"`

	// Bonus display
	BonusText    *string `json:"bonusText,omitempty"`
	BonusSubtext *string `json:"bonusSubtext,omitempty"`
	IsExclusive  bool    `json:"isExclusive"`

	// Actions
	VisitURL  *string `json:"visitUrl,omitempty"`
	ReviewURL *string `json:"reviewUrl,omitempty"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
