import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateRestaurantDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() description: string;
  @IsString() address: string;
  @IsOptional() @IsString() imageUrl?: string;
}
export class UpdateRestaurantDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() isOpen?: boolean;
}
