import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Parser from 'rss-parser';

export interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content?: string;
  image?: string;
  author?: string;
  source?: string;
}

interface CacheEntry {
  data: NewsArticle[];
  expiresAt: number;
}

@Injectable()
export class NewsService {
  private readonly parser: InstanceType<typeof Parser.default>;
  private readonly rssFeeds: string[];
  private readonly newsApiKey: string;
  private readonly cache = new Map<string, CacheEntry>();
  private static readonly CACHE_TTL_MS = 15 * 60 * 1000;

  constructor(private configService: ConfigService) {
    this.parser = new Parser.default({
      customFields: {
        item: [
          ['media:content', 'media:thumbnail', 'enclosure'],
        ],
      },
    });

    this.newsApiKey = this.configService.get<string>('NEWS_API_KEY') || '';

    // RSS feeds for gambling and betting news
    // You can add more feeds or make them configurable via environment variables
    this.rssFeeds = [
      'https://www.casino.org/news/feed/',
      'https://www.casino.org/blog/feed/',
      'https://www.onlinecasinoreports.com/news/feed/',
      'https://www.casino.guru/news/',
      // Add more RSS feeds as needed
    ];
  }

  async fetchNewsFromNewsAPI(country?: string, limit: number = 20): Promise<NewsArticle[]> {
    if (!this.newsApiKey) {
      return [];
    }

    try {
      // Use top-headlines endpoint for country-specific news, or everything for general gambling news
      let url: string;
      
      // Build comprehensive query with all gambling/betting keywords
      const query = 'gambling';
      
      if (country) {
        // Use top-headlines with country parameter for country-specific news
        url = `https://newsapi.org/v2/top-headlines?country=${country.toLowerCase()}&q=${encodeURIComponent(query)}&pageSize=${limit}&apiKey=${this.newsApiKey}`;
      } else {
        // Use everything endpoint for general gambling news
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=${limit}&apiKey=${this.newsApiKey}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok' && data.articles) {
        return data.articles
          .filter((article: any) => article.title && article.url)
          .map((article: any) => ({
            title: article.title || 'Untitled',
            link: article.url || '',
            pubDate: article.publishedAt || new Date().toISOString(),
            description: article.description || '',
            content: article.content || article.description || '',
            image: article.urlToImage || undefined,
            author: article.author || undefined,
            source: article.source?.name || 'News API',
          }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching news from News API:', error);
      return [];
    }
  }

  async fetchNews(limit: number = 20, country?: string): Promise<NewsArticle[]> {
    const cacheKey = `${country ?? 'global'}_${limit}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const allArticles: NewsArticle[] = [];

    try {
      // Fetch from News API first (if API key is available)
      const newsApiArticles = await this.fetchNewsFromNewsAPI(country, limit);
      allArticles.push(...newsApiArticles);

      // Fetch from all RSS feeds in parallel
      const feedPromises = this.rssFeeds.map(async (feedUrl) => {
        try {
          const feed = await this.parser.parseURL(feedUrl);
          return feed.items.map((item) => {
            // Extract image from various sources
            let image: string | undefined;
            
            // Try to get image from enclosure
            if (item.enclosure && item.enclosure.type?.startsWith('image/')) {
              image = item.enclosure.url;
            }
            
            // Try to get image from media:content or media:thumbnail
            const mediaContent = (item as any)['media:content'];
            const mediaThumbnail = (item as any)['media:thumbnail'];
            
            if (mediaContent && mediaContent.$.url) {
              image = mediaContent.$.url;
            } else if (mediaThumbnail && mediaThumbnail.$.url) {
              image = mediaThumbnail.$.url;
            }
            
            // Try to extract image from content HTML
            if (!image && item.contentSnippet) {
              const imgMatch = item.contentSnippet.match(/<img[^>]+src="([^"]+)"/i);
              if (imgMatch) {
                image = imgMatch[1];
              }
            }

            return {
              title: item.title || 'Untitled',
              link: item.link || '',
              pubDate: item.pubDate || new Date().toISOString(),
              description: item.contentSnippet || item.content || '',
              content: item.content || item.contentSnippet || '',
              image,
              author: item.creator || (item as any).author || undefined,
              source: feed.title || feedUrl,
            };
          });
        } catch (error) {
          console.error(`Failed to fetch RSS feed from ${feedUrl}:`, error);
          return [];
        }
      });

      const feedResults = await Promise.all(feedPromises);
      
      // Flatten all articles from all feeds
      feedResults.forEach((articles) => {
        allArticles.push(...articles);
      });

      // Sort by publication date (newest first)
      allArticles.sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA;
      });

      // Remove duplicates based on title and link
      const uniqueArticles = this.removeDuplicates(allArticles);

      const result = uniqueArticles.slice(0, limit);
      this.cache.set(cacheKey, { data: result, expiresAt: Date.now() + NewsService.CACHE_TTL_MS });
      return result;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  private removeDuplicates(articles: NewsArticle[]): NewsArticle[] {
    const seen = new Set<string>();
    return articles.filter((article) => {
      const key = `${article.title}-${article.link}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async getNewsByCategory(category: string, limit: number = 20, country?: string): Promise<NewsArticle[]> {
    const allNews = await this.fetchNews(limit * 2, country); // Fetch more to filter
    
    // Filter by category (simple keyword matching)
    const categoryKeywords: Record<string, string[]> = {
      casino: ['casino', 'gambling', 'slot', 'poker', 'blackjack'],
      sports: ['sports', 'betting', 'odds', 'sportsbook', 'nfl', 'nba', 'mlb'],
      poker: ['poker', 'tournament', 'wsop', 'poker room'],
      slots: ['slot', 'slots', 'jackpot', 'reels', 'spins'],
      bonuses: ['bonus', 'promotion', 'offer', 'deal', 'free'],
    };

    const keywords = categoryKeywords[category.toLowerCase()] || [];
    
    if (keywords.length === 0) {
      return allNews.slice(0, limit);
    }

    const filtered = allNews.filter((article) => {
      const searchText = `${article.title} ${article.description}`.toLowerCase();
      return keywords.some((keyword) => searchText.includes(keyword));
    });

    return filtered.slice(0, limit);
  }
}

