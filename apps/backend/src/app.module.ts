import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SupportModule } from './support/support.module';

import { InventoryTransaction } from './entities/inventory-transaction.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';
import { Voucher } from './entities/voucher.entity';
import { Support } from './entities/support.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.DB_HOST ?? 'localhost', 
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'admin', 
      password: process.env.DB_PASS ?? 'admin123', 
      database: process.env.DB_NAME ?? 'snackshop',
      entities: [User, Product, Voucher, Order, OrderDetail, InventoryTransaction, Support], 
      synchronize: true,
    }),
    AuthModule, 
    InventoryModule, 
    OrdersModule,
    ProductsModule,
    VouchersModule,
    UsersModule,
    AnalyticsModule,
    SupportModule,
  ],
})
export class AppModule {}
