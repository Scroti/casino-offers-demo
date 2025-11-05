import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateGameDto {
  @IsString()
  gameId: string;

  @IsOptional()
  @IsString()
  casinoGuruIdentifier?: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  embedUrl?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  provider: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  views?: number;

  @IsOptional()
  @IsNumber()
  plays?: number;
}

