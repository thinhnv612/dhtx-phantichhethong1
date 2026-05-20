import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemsModule } from '../menu-items/menu-items.module';
import { OrderItem } from './order-item.entity';
import { Voucher } from '../vouchers/voucher.entity';
import { Order } from './order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
@Module({ imports: [TypeOrmModule.forFeature([Order, OrderItem, Voucher]), MenuItemsModule], controllers: [OrdersController], providers: [OrdersService] })
export class OrdersModule {}
