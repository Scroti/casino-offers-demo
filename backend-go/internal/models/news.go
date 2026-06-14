package models

type NewsArticle struct {
	Title       string `json:"title"`
	Link        string `json:"link"`
	PubDate     string `json:"pubDate"`
	Description string `json:"description,omitempty"`
	Content     string `json:"content,omitempty"`
	Image       string `json:"image,omitempty"`
	Author      string `json:"author,omitempty"`
	Source      string `json:"source,omitempty"`
}
