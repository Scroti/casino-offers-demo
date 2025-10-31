import { IsString, IsOptional, IsNumber, ValidateNested, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class BonusAccordionContentDto {
  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  content?: string; // HTML/Markdown allowed
}

class CustomSectionDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  icon?: string; // lucide icon name
}

export class BonusDescriptionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  content?: string;
}

export class CreateBonusDto {
  @IsString()
  title: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BonusDescriptionDto)
  description?: BonusDescriptionDto;

  @IsString()
  price: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsString()
  type: string;

  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  href?: string;

  // Card display controls
  @IsOptional()
  @IsBoolean()
  isExclusive?: boolean;

  @IsOptional()
  @IsString()
  casinoName?: string;

  @IsOptional()
  @IsString()
  casinoLogo?: string;

  @IsOptional()
  @IsString()
  casinoImage?: string;

  @IsOptional()
  @IsNumber()
  safetyIndex?: number;

  @IsOptional()
  @IsString()
  countryFlag?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsString()
  promoCode?: string;

  @IsOptional()
  @IsString()
  bonusInstructions?: string;

  @IsOptional()
  @IsString()
  reviewLink?: string;

  // Mandatory sections
  @IsOptional()
  @ValidateNested()
  @Type(() => BonusAccordionContentDto)
  wageringRequirement?: BonusAccordionContentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BonusAccordionContentDto)
  bonusValue?: BonusAccordionContentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BonusAccordionContentDto)
  maxBet?: BonusAccordionContentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BonusAccordionContentDto)
  expiration?: BonusAccordionContentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BonusAccordionContentDto)
  claimSpeed?: BonusAccordionContentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BonusAccordionContentDto)
  termsConditions?: BonusAccordionContentDto;

  // Custom sections
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomSectionDto)
  customSections?: CustomSectionDto[];
}
