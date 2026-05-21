import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { OrdersService } from './orders.service';
class ItemDto { product_id: number; @Min(1) quantity: number; }
class CreateOrderDto { @IsString() customer_name: string; @IsOptional() @IsString() voucher_code?: string; @IsArray() @ValidateNested({ each: true }) @Type(() => ItemDto) items: ItemDto[]; }
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController { constructor(private service: OrdersService) {} @Post() create(@Body() dto: CreateOrderDto, @Req() req:any){ return this.service.createOrder(dto, req.user.sub);} }
