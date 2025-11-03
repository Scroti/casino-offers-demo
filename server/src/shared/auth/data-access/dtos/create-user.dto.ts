import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsUrl({}, { message: 'Invalid URL format' })
  @IsOptional()
  profileImageUrl?: string;

  @IsString()
  @IsOptional()
  country?: string; // Country code (e.g., 'US', 'ES', 'RO')

  @IsString()
  @IsOptional()
  language?: string; // Language code (e.g., 'en', 'es', 'ro')
}
