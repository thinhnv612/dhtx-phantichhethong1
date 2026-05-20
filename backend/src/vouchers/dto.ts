import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateVoucherDto {
  @IsString() @IsNotEmpty() code: string;
  @Type(() => Number) @IsNumber() @Min(0) discountAmount: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsDateString() expiresAt?: string;
}

export class UpdateVoucherDto {
  @IsOptional() @IsString() @IsNotEmpty() code?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) discountAmount?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsDateString() expiresAt?: string;
}
