import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true, enum: ['general', 'technical', 'billing', 'account', 'feedback', 'other'] })
  category: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead?: boolean;

  @Prop({ default: false })
  isResolved?: boolean;

  @Prop()
  response?: string;

  @Prop()
  respondedAt?: Date;

  @Prop()
  userId?: string; // Optional reference to user if logged in
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

