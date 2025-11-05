import { IsEmail, IsString, IsNotEmpty, IsEnum, MinLength } from 'class-validator';

export enum ContactCategory {
  GENERAL = 'general',
  TECHNICAL = 'technical',
  BILLING = 'billing',
  ACCOUNT = 'account',
  FEEDBACK = 'feedback',
  OTHER = 'other',
}

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  subject: string;

  @IsEnum(ContactCategory)
  @IsNotEmpty()
  category: ContactCategory;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  message: string;
}

