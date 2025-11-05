'use client';

import * as React from 'react';
import { Suspense } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { useGetAllGuidesQuery, useGetFeaturedGuidesQuery } from '@/app/lib/data-access/configs/guides.config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/PageHeader';
import { BookOpen, Calendar, Eye, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Guide } from '@/app/lib/data-access/configs/guides.config';

interface GuideCardProps {
  guide: Guide;
}

function GuideCard({ guide }: GuideCardProps) {
  return (
    <Link href={`/guides/${guide.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        {guide.featuredImage && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <Image
              src={guide.featuredImage}
              alt={guide.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="line-clamp-2">{guide.title}</CardTitle>
            {guide.isFeatured && (
              <Badge variant="default">Featured</Badge>
            )}
          </div>
          {guide.excerpt && (
            <CardDescription className="line-clamp-3">
              {guide.excerpt}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            {guide.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{guide.author}</span>
              </div>
            )}
            {guide.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(guide.publishedAt).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{guide.views || 0} views</span>
            </div>
          </div>
          {guide.categories && guide.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {guide.categories.slice(0, 3).map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
              {guide.categories.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{guide.categories.length - 3}
                </Badge>
              )}
            </div>
          )}
          {guide.tags && guide.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {guide.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function GuidesPageContent() {
  const { data: publishedGuides = [], isLoading } = useGetAllGuidesQuery({ published: true });
  const { data: featuredGuides = [] } = useGetFeaturedGuidesQuery();

  const featuredIds = React.useMemo(
    () => new Set(featuredGuides.map((g) => g._id)),
    [featuredGuides]
  );

  const regularGuides = React.useMemo(
    () => publishedGuides.filter((g) => !featuredIds.has(g._id)),
    [publishedGuides, featuredIds]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Guides"
        description="Learn everything about online casinos, bonuses, games, and strategies"
      />

      {featuredGuides.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Featured Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGuides.map((guide) => (
              <GuideCard key={guide._id} guide={guide} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">All Guides</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-6 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : regularGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularGuides.map((guide) => (
              <GuideCard key={guide._id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No guides available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GuidesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading guides...</p>
      </div>
    }>
      <GuidesPageContent />
    </Suspense>
  );
}

