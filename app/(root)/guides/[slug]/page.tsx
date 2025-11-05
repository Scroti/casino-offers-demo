'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetGuideBySlugQuery, useIncrementViewsMutation } from '@/app/lib/data-access/configs/guides.config';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Eye, User, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Guide } from '@/app/lib/data-access/configs/guides.config';

export default function GuideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data: guide, isLoading, error } = useGetGuideBySlugQuery(slug, {
    skip: !slug,
  });
  const [incrementViews] = useIncrementViewsMutation();

  // Increment views when guide is loaded
  React.useEffect(() => {
    if (guide?._id) {
      incrementViews(guide._id);
    }
  }, [guide?._id, incrementViews]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Guide Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The guide you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/guides')} asChild>
              <Link href="/guides">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Guides
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.push('/guides')}
        className="mb-6"
        asChild
      >
        <Link href="/guides">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Guides
        </Link>
      </Button>

      <article className="space-y-6">
        {guide.featuredImage && (
          <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
            <Image
              src={guide.featuredImage}
              alt={guide.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <header className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            {guide.isFeatured && (
              <Badge variant="default">Featured</Badge>
            )}
            {guide.categories?.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">{guide.title}</h1>

          {guide.excerpt && (
            <p className="text-xl text-muted-foreground">{guide.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
            {guide.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{guide.author}</span>
              </div>
            )}
            {guide.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(guide.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{guide.views || 0} views</span>
            </div>
          </div>

          {guide.tags && guide.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {guide.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <Card>
          <CardContent className="prose prose-lg max-w-none py-8">
            <div
              dangerouslySetInnerHTML={{ __html: guide.content }}
              className="guide-content"
            />
          </CardContent>
        </Card>

        {guide.relatedGuides && guide.relatedGuides.length > 0 && (
          <Card>
            <CardContent className="py-6">
              <h2 className="text-2xl font-bold mb-4">Related Guides</h2>
              <p className="text-muted-foreground">
                Related guides functionality will be implemented when we fetch related guides by ID.
              </p>
            </CardContent>
          </Card>
        )}
      </article>
    </div>
  );
}

