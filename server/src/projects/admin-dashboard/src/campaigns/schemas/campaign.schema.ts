import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true, unique: true })
  token: string; // Unique token for the campaign (e.g., "summer2024")

  @Prop({ required: true })
  name: string; // Campaign name (e.g., "Summer Bonus Campaign")

  @Prop()
  description?: string; // Optional description

  @Prop({ default: true })
  isActive: boolean; // Whether the campaign is currently active

  @Prop({ type: Date })
  expiresAt?: Date; // Optional expiration date

  @Prop({ type: Date })
  startsAt?: Date; // Optional start date

  @Prop({ default: 0 })
  clickCount: number; // Track how many times the campaign link was clicked

  @Prop({ default: 0 })
  bonusAccessCount: number; // Track how many times bonuses were accessed via this campaign

  @Prop()
  createdBy?: string; // Admin user ID who created the campaign
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

