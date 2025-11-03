import { IsEmail, IsString, IsOptional, IsEnum, IsArray, MinLength } from 'class-validator';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;

  @IsOptional()
  @IsString()
  country?: string; // Country code (e.g., 'US', 'ES', 'RO')

  @IsOptional()
  @IsString()
  language?: string; // Language code (e.g., 'en', 'es', 'ro')
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  language?: string;
}

export class ChangeUserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;
}

export class ChangeUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

export class SendEmailDto {
  @IsString()
  @MinLength(1)
  subject: string;

  @IsString()
  @MinLength(1)
  message: string;
}

export class BulkDeleteUsersDto {
  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}

export class BulkChangeStatusDto {
  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @IsEnum(UserStatus)
  status: UserStatus;
}


