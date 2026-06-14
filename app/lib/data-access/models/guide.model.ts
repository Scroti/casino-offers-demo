export interface Guide {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  tags?: string[];
  categories?: string[];
  featuredImage?: string;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  author?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedGuides?: string[];
  createdAt?: string;
  updatedAt?: string;
}
