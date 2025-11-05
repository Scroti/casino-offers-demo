import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

class FeatureDto {
  @IsEnum(['positive', 'negative', 'neutral'])
  type: 'positive' | 'negative' | 'neutral';

  @IsString()
  text: string;
}

class AvailableGameDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}

class PaymentMethodDto {
  @IsString()
  name: string;
}


export class CreateCasinoDto {
  // General Information
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  founded?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  advantages?: string[];

  @IsOptional()
  @IsString()
  affiliateSoftware?: string;

  @IsOptional()
  @IsString()
  license?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  companyAddress?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accessibility?: string[];

  @IsOptional()
  @IsBoolean()
  mobileApplication?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  siteLanguages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  currencies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  restrictedCountries?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableCountries?: string[];

  @IsOptional()
  @IsString()
  wagering?: string;

  @IsOptional()
  @IsString()
  partners?: string;

  @IsOptional()
  @IsString()
  version?: string;

  // Display/UI fields
  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  safetyIndex?: number;

  @IsOptional()
  @IsString()
  countryFlag?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  // Features/Pros & Cons
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features?: FeatureDto[];

  // Games Information
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gameProviders?: string[];

  @IsOptional()
  @IsString()
  gamesAmount?: string;

  @IsOptional()
  @IsString()
  slotGames?: string;

  @IsOptional()
  @IsString()
  jackpotGames?: string;

  @IsOptional()
  @IsString()
  videoPokerGames?: string;

  @IsOptional()
  @IsString()
  scratchGames?: string;

  @IsOptional()
  @IsString()
  bingoGames?: string;

  @IsOptional()
  @IsString()
  liveGamesAmount?: string;

  @IsOptional()
  @IsBoolean()
  sportsBetting?: boolean;

  @IsOptional()
  @IsBoolean()
  liveBetting?: boolean;

  @IsOptional()
  @IsBoolean()
  virtualSportsBetting?: boolean;

  // Available games (for display)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableGameDto)
  availableGames?: AvailableGameDto[];

  // Payment Information
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  depositMethods?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  withdrawalMethods?: string[];

  @IsOptional()
  @IsString()
  minimalDeposit?: string;

  @IsOptional()
  @IsString()
  minimalPayout?: string;

  @IsOptional()
  @IsString()
  maxWithdrawalLimitPerMonth?: string;

  @IsOptional()
  @IsString()
  withdrawalTime?: string;

  @IsOptional()
  @IsBoolean()
  withdrawWithActiveBonus?: boolean;

  @IsOptional()
  @IsString()
  withdrawFees?: string;

  // Payment methods (for display)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  paymentMethods?: PaymentMethodDto[];

  // Support Information
  @IsOptional()
  @IsString()
  workingHours?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  liveChatLanguages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phoneLanguages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emailLanguages?: string[];

  @IsOptional()
  @IsString()
  averageContactTime?: string;

  // Languages (for display - consolidated)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  websiteLanguages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customerSupportLanguages?: string[];

  // Bonus Information
  @IsOptional()
  @IsString()
  bonusText?: string;

  @IsOptional()
  @IsString()
  bonusSubtext?: string;

  @IsOptional()
  @IsBoolean()
  isExclusive?: boolean;

  // Actions
  @IsOptional()
  @IsString()
  visitUrl?: string;

  @IsOptional()
  @IsString()
  reviewUrl?: string;
}
