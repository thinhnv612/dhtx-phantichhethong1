import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class IngredientDto {
  @IsString() inventoryItemId: string;
  @IsNumber() @Min(0) quantityPerUnit: number;
  @IsOptional() @IsString() unit?: string;
}

export class CreateMenuItemDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() description: string;
  @IsOptional() @IsString() category?: string;
  @IsNumber() @Min(0) price: number;
  @IsString() restaurantId: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => IngredientDto) ingredients?: IngredientDto[];
}

export class UpdateMenuItemDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() isAvailable?: boolean;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => IngredientDto) ingredients?: IngredientDto[];
}
