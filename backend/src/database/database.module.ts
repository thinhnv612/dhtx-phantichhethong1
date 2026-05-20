import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from '../inventory/inventory-item.entity';
import { MenuItemIngredient } from '../menu-items/menu-item-ingredient.entity';
import { MenuItem } from '../menu-items/menu-item.entity';
import { Order } from '../orders/order.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../users/user.entity';
import { Voucher } from '../vouchers/voucher.entity';
import { SeedService } from './seed.service';

@Module({ imports: [TypeOrmModule.forFeature([User, Restaurant, MenuItem, MenuItemIngredient, InventoryItem, Voucher, Order])], providers: [SeedService] })
export class DatabaseModule {}
