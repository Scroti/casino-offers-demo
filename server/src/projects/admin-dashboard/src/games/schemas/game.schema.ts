import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({ timestamps: true })
export class Game {
  @Prop({ required: true, unique: true })
  gameId: string; // Unique identifier (e.g., 'juicy-fruits')

  @Prop()
  casinoGuruIdentifier?: string; // Casino Guru identifier for embedding

  @Prop({ required: true })
  title: string;

  @Prop()
  embedUrl?: string; // Pre-generated embed URL

  @Prop()
  thumbnail?: string;

  @Prop({ required: true })
  category: string; // e.g., 'Slots', 'Table Games', etc.

  @Prop()
  description?: string;

  @Prop({ required: true })
  provider: string; // e.g., 'Pragmatic Play'

  @Prop({ default: true })
  isActive?: boolean; // Whether the game is available for users

  @Prop({ default: 0 })
  views?: number; // Number of times the game has been viewed

  @Prop({ default: 0 })
  plays?: number; // Number of times the game has been played
}

export const GameSchema = SchemaFactory.createForClass(Game);

