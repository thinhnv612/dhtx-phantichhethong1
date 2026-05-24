import { Body, Controller, Get, Param, Post, Put, Query, Req, Sse, MessageEvent, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { OrdersService } from './orders.service';
import { OrderStatus } from '../entities/enums';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrdersSseService } from './orders-sse.service';

class ItemDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  product_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
class CreateOrderDto { 
  @IsString() customer_name: string; 
  @IsOptional() @IsString() voucher_code?: string; 
  @IsArray() @ValidateNested({ each: true }) @Type(() => ItemDto) items: ItemDto[]; 
}

class UpdateStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

@Controller('orders')
export class OrdersController { 
  constructor(
    private service: OrdersService,
    private sseService: OrdersSseService
  ) {} 

  // Make POST /orders public for guest checkout!
  @Post() 
  create(@Body() dto: CreateOrderDto, @Req() req: any) { 
    // If request contains JWT token, we can associate it, otherwise check out as guest
    const userId = req?.user?.sub;
    return this.service.createOrder(dto, userId);
  }

  // Get orders list (Admin only)
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  // SSE stream for real-time orders (Public/Admin)
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.sseService.event$.pipe(
      map(data => ({ data } as MessageEvent))
    );
  }

  // Track specific order status (Public)
  @Get('track/:id')
  trackOrder(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // Update order status (Admin only)
  @Put(':id/status')
  @UseGuards(AuthGuard('jwt'))
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(Number(id), dto.status);
  }
}
