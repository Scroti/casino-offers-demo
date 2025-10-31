import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BonusDocument = Bonus & Document;

@Schema({ timestamps: true })
export class Bonus {
  @Prop({ required: true })
  title: string;

  // Change description type
  @Prop({
    type: {
      title: { type: String },
      subtitle: { type: String },
      content: { type: String },
    },
    _id: false,
    required: false
  })
  description?: {
    title?: string;
    subtitle?: string;
    content?: string;
  };

  @Prop({ required: true })
  price: string;

  @Prop({ default: 0 }) // Default rating if not provided
  rating: number;

  @Prop({ required: true })
  type: string; // e.g. "deposit", "no deposit", etc.

  @Prop({ required: true })
  image: string;

  @Prop()
  href: string;

  // Card display controls from backend
  @Prop({ default: false })
  isExclusive?: boolean;

  @Prop()
  casinoName?: string;

  @Prop()
  casinoLogo?: string;

  @Prop()
  casinoImage?: string;

  @Prop()
  safetyIndex?: number;

  @Prop()
  countryFlag?: string;

  @Prop()
  countryCode?: string;

  @Prop()
  promoCode?: string;

  @Prop()
  bonusInstructions?: string;

  @Prop()
  reviewLink?: string;

  // Mandatory accordion sections
  @Prop({
    type: {
      value: { type: String },
      subtitle: { type: String },
      content: { type: String },
    },
    _id: false,
  })
  wageringRequirement?: { value?: string; subtitle?: string; content?: string };

  @Prop({
    type: {
      value: { type: String },
      subtitle: { type: String },
      content: { type: String },
    },
    _id: false,
  })
  bonusValue?: { value?: string; subtitle?: string; content?: string };

  @Prop({
    type: {
      value: { type: String },
      subtitle: { type: String },
      content: { type: String },
    },
    _id: false,
  })
  maxBet?: { value?: string; subtitle?: string; content?: string };

  @Prop({
    type: {
      value: { type: String },
      subtitle: { type: String },
      content: { type: String },
    },
    _id: false,
  })
  expiration?: { value?: string; subtitle?: string; content?: string };

  @Prop({
    type: {
      value: { type: String },
      subtitle: { type: String },
      content: { type: String },
    },
    _id: false,
  })
  claimSpeed?: { value?: string; subtitle?: string; content?: string };

  @Prop({
    type: {
      value: { type: String },
      subtitle: { type: String },
      content: { type: String },
    },
    _id: false,
  })
  termsConditions?: { value?: string; subtitle?: string; content?: string };

  @Prop({
    type: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        subtitle: { type: String, required: false },
        icon: { type: String, required: false }
      }
    ],
    default: []
  })
  customSections?: Array<{ title: string; content: string; subtitle?: string; icon?: string }>;

  // For future extensibility just add more @Prop fields here
}

export const BonusSchema = SchemaFactory.createForClass(Bonus);
