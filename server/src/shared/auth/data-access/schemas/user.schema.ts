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
}

export const UserSchema = SchemaFactory.createForClass(User);
