import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryTransaction } from '../entities/inventory-transaction.entity';
import { OrderDetail } from '../entities/order-detail.entity';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Voucher } from '../entities/voucher.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
@Module({ imports: [TypeOrmModule.forFeature([Order, OrderDetail, Product, Voucher, InventoryTransaction])], controllers: [OrdersController], providers: [OrdersService] })
export class OrdersModule {}
