import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ProductType } from '../../entities/enums';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const optionalTrimmedString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export class CreateProductDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock_quantity: number;

  @IsEnum(ProductType)
  type: ProductType;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @Transform(optionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  image_url?: string | null;
}

export class UpdateProductDto {
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  stock_quantity?: number;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @Transform(optionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  image_url?: string | null;
}
