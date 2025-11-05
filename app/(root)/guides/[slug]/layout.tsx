import { generateMetadata as genMeta } from '@/lib/utils/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<ReturnType<typeof genMeta>> {
  const { slug } = await params;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';
  
  try {
    const res = await fetch(`${apiUrl}/guides/slug/${slug}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const guide = await res.json();
      if (guide.isPublished) {
        return genMeta({
          title: guide.seoTitle || guide.title,
          description: guide.seoDescription || guide.excerpt || guide.description || `Read our guide: ${guide.title}`,
          keywords: guide.tags || ['casino guide', 'gambling guide'],
          url: `/guides/${slug}`,
          image: guide.featuredImage,
          type: 'article',
          publishedTime: guide.publishedAt,
          modifiedTime: guide.updatedAt,
          author: guide.author,
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch guide for metadata:', error);
  }

  return genMeta({
    title: 'Guide Not Found',
    description: 'The guide you are looking for does not exist.',
    url: `/guides/${slug}`,
    noIndex: true,
  });
}

export default function GuideDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

