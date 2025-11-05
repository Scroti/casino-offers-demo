import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

export type UserDocument = User & Document;

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ enum: Role, default: Role.USER })
  role: Role;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ default: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png' })
  profileImageUrl?: string;

  @Prop()
  refreshTokenHash?: string; // Store hashed refresh token for revocation

  @Prop({ default: false })
  isVerified?: boolean;

  @Prop()
  lastLogin?: Date;

  @Prop({ default: 0 })
  totalBonuses?: number;

  @Prop({ default: 0 })
  totalSpent?: number;

  @Prop()
  country?: string; // Country code (e.g., 'US', 'ES', 'RO')

  @Prop()
  language?: string; // Language code (e.g., 'en', 'es', 'ro')

  @Prop({ enum: ['male', 'female', 'prefer-not-to-say'], default: null })
  gender?: 'male' | 'female' | 'prefer-not-to-say';

  @Prop({ enum: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+', 'prefer-not-to-say'], default: null })
  ageRange?: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+' | 'prefer-not-to-say';

  @Prop()
  passwordResetToken?: string; // Token for password reset

  @Prop()
  passwordResetTokenExpires?: Date; // Expiration date for password reset token

  @Prop()
  emailVerificationToken?: string; // Token for email verification

  @Prop()
  emailVerificationTokenExpires?: Date; // Expiration date for email verification token

  @Prop()
  emailVerificationCode?: string; // 6-digit code for email verification (alternative to token)

  @Prop()
  emailVerificationCodeExpires?: Date; // Expiration date for email verification code
}

export const UserSchema = SchemaFactory.createForClass(User);
