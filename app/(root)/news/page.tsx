"use client";

import { useState, useMemo, Suspense } from "react";
import { useGetNewsQuery } from "@/app/lib/data-access/configs/news.config";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCountryDetection } from "@/hooks/use-country-detection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Newspaper, 
  Calendar, 
  ExternalLink, 
  Clock,
  Filter,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { value: "all", label: "All News" },
  { value: "casino", label: "Casino" },
  { value: "sports", label: "Sports Betting" },
  { value: "poker", label: "Poker" },
  { value: "slots", label: "Slots" },
  { value: "bonuses", label: "Bonuses" },
];

function NewsPageContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [limit, setLimit] = useState(20);
  const { userCountry, isDetecting } = useCountryDetection();

  const { data: news = [], isLoading, error } = useGetNewsQuery({
    limit,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    country: userCountry || undefined, // Pass user's country if available
  }, {
    skip: isDetecting, // Skip query while detecting country
  });

  const filteredNews = useMemo(() => {
    if (selectedCategory === "all") {
      return news;
    }
    return news;
  }, [news, selectedCategory]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else if (diffInHours < 48) {
        return "Yesterday";
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
          return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else {
          return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        }
      }
    } catch {
      return "Unknown date";
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className="container py-5 px-5 mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="Gambling & Betting News" />
        {userCountry && !isDetecting && (
          <Badge variant="outline" className="ml-4">
            📍 {userCountry} News
          </Badge>
        )}
      </div>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mt-6 mb-8">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.value)}
            className="flex items-center gap-2"
          >
            {selectedCategory === category.value && (
              <X className="h-3 w-3" />
            )}
            {category.label}
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-6">
          <div className="text-center">
            <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load News</h3>
            <p className="text-muted-foreground">
              Unable to fetch news articles. Please try again later.
            </p>
          </div>
        </Card>
      )}

      {/* News Grid */}
      {!isLoading && !error && filteredNews.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((article, index) => (
            <Card key={`${article.link}-${index}`} className="flex flex-col hover:shadow-lg transition-shadow">
              {/* Article Image */}
              {article.image && (
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg line-clamp-2 flex-1">
                    {article.title}
                  </CardTitle>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(article.pubDate)}
                  </div>
                  {article.source && (
                    <Badge variant="outline" className="text-xs">
                      {article.source}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                  {truncateText(article.description || article.content || "")}
                </p>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Read More
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredNews.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No News Found</h3>
            <p className="text-muted-foreground">
              {selectedCategory === "all" 
                ? "No news articles available at the moment."
                : `No ${categories.find(c => c.value === selectedCategory)?.label.toLowerCase()} news found.`}
            </p>
          </div>
        </Card>
      )}

      {/* Load More Button */}
      {!isLoading && !error && filteredNews.length >= limit && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => setLimit(limit + 20)}
          >
            Load More News
          </Button>
        </div>
      )}
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading news...</p>
      </div>
    }>
      <NewsPageContent />
    </Suspense>
  );
}

