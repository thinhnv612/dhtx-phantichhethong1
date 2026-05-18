import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @IsEmail() email: string;
  @MinLength(8) password: string;
  @IsString() @IsNotEmpty() fullName: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
}
export class LoginDto { @IsEmail() email: string; @IsString() password: string; }
