import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { InventoryModule } from './inventory/inventory.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { OrdersModule } from './orders/orders.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';
import { VouchersModule } from './vouchers/vouchers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ type: 'postgres', url: config.getOrThrow<string>('DATABASE_URL'), autoLoadEntities: true, synchronize: config.get('DB_SYNCHRONIZE') === 'true' }),
    }),
    UsersModule,
    AuthModule,
    RestaurantsModule,
    MenuItemsModule,
    OrdersModule,
    InventoryModule,
    VouchersModule,
    DatabaseModule,
  ],
})
export class AppModule {}
