import {
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Token can only contain lowercase letters, numbers, and hyphens',
  })
  token: string; // e.g., "summer2024", "winter-bonus"

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string; // e.g., "Summer Bonus Campaign"

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsDateString()
  expiresAt?: string; // ISO date string

  @IsOptional()
  @IsDateString()
  startsAt?: string; // ISO date string

  @IsOptional()
  @IsString()
  createdBy?: string; // Admin user ID
}

