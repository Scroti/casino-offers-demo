import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBonusDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

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
}
