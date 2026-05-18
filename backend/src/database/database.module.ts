import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from '../menu-items/menu-item.entity';
import { Order } from '../orders/order.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../users/user.entity';
import { SeedService } from './seed.service';
@Module({ imports: [TypeOrmModule.forFeature([User, Restaurant, MenuItem, Order])], providers: [SeedService] })
export class DatabaseModule {}
