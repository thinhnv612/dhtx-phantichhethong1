import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentMethod } from '../common/enums';
class CreateOrderItemDto { @IsString() menuItemId: string; @IsInt() @Min(1) quantity: number; }
export class CreateOrderDto {
  @IsString() restaurantId: string;
  @IsString() deliveryAddress: string;
  @IsOptional() @IsString() customerPhone?: string;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsEnum(PaymentMethod) paymentMethod?: PaymentMethod;
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateOrderItemDto) items: CreateOrderItemDto[];
}
export class UpdateOrderStatusDto { @IsEnum(OrderStatus) status: OrderStatus; }
