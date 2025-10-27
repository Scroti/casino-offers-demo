import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BonusDocument = Bonus & Document;

@Schema({ timestamps: true })
export class Bonus {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

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

  // For future extensibility just add more @Prop fields here
}

export const BonusSchema = SchemaFactory.createForClass(Bonus);
