import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class VerifyEmailDto {
  @IsOptional()
  @IsString()
  readonly token?: string; // Email verification token from URL

  @IsOptional()
  @IsString()
  @Length(6, 6, { message: 'Verification code must be 6 digits' })
  @Matches(/^\d+$/, { message: 'Verification code must contain only digits' })
  readonly code?: string; // 6-digit verification code
}

