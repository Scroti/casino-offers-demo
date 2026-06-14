package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/mmcdole/gofeed"

	"github.com/playwise-guru/backend/internal/models"
)

var rssFeeds = []string{
	"https://www.casino.org/news/feed/",
	"https://www.casino.org/blog/feed/",
	"https://www.onlinecasinoreports.com/news/feed/",
}

const cacheTTL = 15 * time.Minute

type NewsService struct {
	apiKey string
	parser *gofeed.Parser
	http   *http.Client

	mu    sync.RWMutex
	cache map[string]cacheEntry
}

type cacheEntry struct {
	items     []models.NewsArticle
	expiresAt time.Time
}

func NewNewsService(apiKey string) *NewsService {
	return &NewsService{
		apiKey: apiKey,
		parser: gofeed.NewParser(),
		http:   &http.Client{Timeout: 10 * time.Second},
		cache:  map[string]cacheEntry{},
	}
}

func (s *NewsService) Fetch(ctx context.Context, country string, limit int) ([]models.NewsArticle, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	key := fmt.Sprintf("%s|%d", country, limit)

	s.mu.RLock()
	if entry, ok := s.cache[key]; ok && time.Now().Before(entry.expiresAt) {
		s.mu.RUnlock()
		return entry.items, nil
	}
	s.mu.RUnlock()

	items := s.fetchFromAllSources(ctx, country, limit)

	s.mu.Lock()
	s.cache[key] = cacheEntry{items: items, expiresAt: time.Now().Add(cacheTTL)}
	s.mu.Unlock()

	return items, nil
}

func (s *NewsService) fetchFromAllSources(ctx context.Context, country string, limit int) []models.NewsArticle {
	seen := map[string]bool{}
	out := make([]models.NewsArticle, 0, limit*2)

	for _, feedURL := range rssFeeds {
		articles, err := s.fetchRSS(ctx, feedURL, limit)
		if err != nil {
			slog.Warn("RSS fetch failed", "feed", feedURL, "err", err)
			continue
		}
		for _, a := range articles {
			dedupKey := strings.ToLower(a.Title + "|" + a.Link)
			if seen[dedupKey] {
				continue
			}
			seen[dedupKey] = true
			out = append(out, a)
		}
	}

	if s.apiKey != "" {
		articles, err := s.fetchNewsAPI(ctx, country, limit)
		if err == nil {
			for _, a := range articles {
				dedupKey := strings.ToLower(a.Title + "|" + a.Link)
				if seen[dedupKey] {
					continue
				}
				seen[dedupKey] = true
				out = append(out, a)
			}
		}
	}

	if len(out) > limit {
		out = out[:limit]
	}
	return out
}

func (s *NewsService) fetchRSS(ctx context.Context, feedURL string, limit int) ([]models.NewsArticle, error) {
	feed, err := s.parser.ParseURLWithContext(feedURL, ctx)
	if err != nil {
		return nil, err
	}
	out := make([]models.NewsArticle, 0, len(feed.Items))
	for _, item := range feed.Items {
		if len(out) >= limit {
			break
		}
		out = append(out, models.NewsArticle{
			Title:       item.Title,
			Link:        item.Link,
			PubDate:     item.Published,
			Description: item.Description,
			Content:     item.Content,
			Image:       extractRSSImage(item),
			Author:      authorName(item),
			Source:      feed.Title,
		})
	}
	return out, nil
}

func extractRSSImage(item *gofeed.Item) string {
	if item.Image != nil && item.Image.URL != "" {
		return item.Image.URL
	}
	if encs := item.Enclosures; len(encs) > 0 {
		return encs[0].URL
	}
	return ""
}

func authorName(item *gofeed.Item) string {
	if item.Author != nil {
		return item.Author.Name
	}
	return ""
}

type newsAPIResponse struct {
	Articles []struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Content     string `json:"content"`
		URL         string `json:"url"`
		URLToImage  string `json:"urlToImage"`
		PublishedAt string `json:"publishedAt"`
		Author      string `json:"author"`
		Source      struct {
			Name string `json:"name"`
		} `json:"source"`
	} `json:"articles"`
}

func (s *NewsService) fetchNewsAPI(ctx context.Context, country string, limit int) ([]models.NewsArticle, error) {
	q := url.Values{}
	q.Set("q", "gambling")
	q.Set("sortBy", "publishedAt")
	q.Set("pageSize", fmt.Sprintf("%d", limit))
	q.Set("apiKey", s.apiKey)
	if country != "" {
		q.Set("country", country)
	}

	endpoint := "https://newsapi.org/v2/everything?" + q.Encode()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}
	resp, err := s.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var parsed newsAPIResponse
	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, err
	}

	out := make([]models.NewsArticle, 0, len(parsed.Articles))
	for _, a := range parsed.Articles {
		out = append(out, models.NewsArticle{
			Title:       a.Title,
			Link:        a.URL,
			PubDate:     a.PublishedAt,
			Description: a.Description,
			Content:     a.Content,
			Image:       a.URLToImage,
			Author:      a.Author,
			Source:      a.Source.Name,
		})
	}
	return out, nil
}
