import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class CreateMenuItemDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() description: string;
  @IsNumber() @Min(0) price: number;
  @IsString() restaurantId: string;
  @IsOptional() @IsString() imageUrl?: string;
}
export class UpdateMenuItemDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() isAvailable?: boolean;
}
