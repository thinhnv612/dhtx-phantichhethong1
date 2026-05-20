import { Body, Controller, Delete, Get, MessageEvent, Param, Patch, Post, Sse, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { interval, Observable, startWith, switchMap, map } from 'rxjs';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get() findAll() { return this.orders.findAll(); }
  @Get('me') findMine(@CurrentUser() user: { id: string }) { return this.orders.findForCustomer(user.id); }
  @Post() create(@CurrentUser() user: { id: string }, @Body() dto: CreateOrderDto) { return this.orders.create(user.id, dto); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) { return this.orders.updateStatus(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.orders.remove(id); }

  @Sse('stream')
  streamOrders(): Observable<MessageEvent> {
    return interval(5000).pipe(startWith(0), switchMap(() => this.orders.findAll()), map(data => ({ data })));
  }
}
