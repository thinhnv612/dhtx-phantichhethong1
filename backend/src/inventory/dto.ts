import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateInventoryItemDto {
  @IsString() @IsNotEmpty() name: string;
  @Type(() => Number) @IsInt() @Min(0) quantity: number;
  @Type(() => Number) @IsNumber() @Min(0) unitCost: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsString() restaurantId?: string;
}

export class UpdateInventoryItemDto {
  @IsOptional() @IsString() @IsNotEmpty() name?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) quantity?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) unitCost?: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsString() restaurantId?: string;
}
