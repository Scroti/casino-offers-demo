import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GuideDocument = Guide & Document;

@Schema({ timestamps: true })
export class Guide {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string; // URL-friendly version of title (unique)

  @Prop()
  excerpt?: string; // Short description for preview

  @Prop({ required: true })
  content: string; // Main content (HTML or Markdown)

  @Prop({ type: [String], default: [] })
  tags?: string[]; // Tags for categorization

  @Prop({ type: [String], default: [] })
  categories?: string[]; // Categories (e.g., "Casino Basics", "Bonus Guides", "Game Strategies")

  @Prop()
  featuredImage?: string; // Featured image URL

  @Prop({ default: false })
  isPublished: boolean; // Whether the guide is published

  @Prop({ default: false })
  isFeatured: boolean; // Whether to feature on homepage

  @Prop({ default: 0 })
  views: number; // View count

  @Prop()
  author?: string; // Author name

  @Prop({ default: new Date() })
  publishedAt?: Date; // Publication date

  @Prop()
  seoTitle?: string; // SEO meta title

  @Prop()
  seoDescription?: string; // SEO meta description

  @Prop({ type: [String], default: [] })
  relatedGuides?: string[]; // IDs of related guides
}

export const GuideSchema = SchemaFactory.createForClass(Guide);

// Create index for slug (must be unique)
GuideSchema.index({ slug: 1 }, { unique: true });

