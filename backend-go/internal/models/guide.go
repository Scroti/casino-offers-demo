package models

import (
	"time"

	"github.com/google/uuid"
)

type Guide struct {
	ID             uuid.UUID  `json:"id"`
	Title          string     `json:"title"`
	Slug           string     `json:"slug"`
	Excerpt        *string    `json:"excerpt,omitempty"`
	Content        string     `json:"content"`
	Tags           []string   `json:"tags"`
	Categories     []string   `json:"categories"`
	FeaturedImage  *string    `json:"featuredImage,omitempty"`
	IsPublished    bool       `json:"isPublished"`
	IsFeatured     bool       `json:"isFeatured"`
	Views          int64      `json:"views"`
	Author         *string    `json:"author,omitempty"`
	PublishedAt    *time.Time `json:"publishedAt,omitempty"`
	SEOTitle       *string    `json:"seoTitle,omitempty"`
	SEODescription *string    `json:"seoDescription,omitempty"`
	RelatedGuides  []string   `json:"relatedGuides"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
}
