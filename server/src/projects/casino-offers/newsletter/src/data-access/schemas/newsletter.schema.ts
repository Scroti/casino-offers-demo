import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsletterSubscriptionDocument = NewsletterSubscription & Document;

@Schema({ timestamps: true })
export class NewsletterSubscription {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ 
    type: String, 
    enum: ['active', 'unsubscribed'], 
    default: 'active' 
  })
  status: 'active' | 'unsubscribed';
}

export const NewsletterSubscriptionSchema = SchemaFactory.createForClass(NewsletterSubscription);
