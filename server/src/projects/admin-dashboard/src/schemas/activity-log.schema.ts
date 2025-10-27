// src/schemas/activity-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  action: string; // e.g., 'user.login', 'game.play', 'casino.view'

  @Prop({ required: true })
  category: string; // 'auth', 'user', 'admin', 'system'

  @Prop({ type: Object })
  metadata?: Record<string, any>; // Additional context data

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  path?: string; // URL path

  @Prop()
  method?: string; // HTTP method

  @Prop()
  statusCode?: number;

  @Prop()
  duration?: number; // Request duration in ms

  @Prop({ type: Object })
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

// Add indexes for better query performance
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ category: 1, createdAt: -1 });
ActivityLogSchema.index({ createdAt: -1 });
