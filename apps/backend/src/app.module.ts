import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryTransaction } from './entities/inventory-transaction.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';
import { Voucher } from './entities/voucher.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', host: process.env.DB_HOST ?? 'localhost', port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'admin', password: process.env.DB_PASS ?? 'admin123', database: process.env.DB_NAME ?? 'snackshop',
      entities: [User, Product, Voucher, Order, OrderDetail, InventoryTransaction], synchronize: true,
    }),
    AuthModule, InventoryModule, OrdersModule,
  ],
})
export class AppModule {}
