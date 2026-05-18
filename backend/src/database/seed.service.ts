import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums';
import { MenuItem } from '../menu-items/menu-item.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../users/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(@InjectRepository(User) private readonly users: Repository<User>, @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>, @InjectRepository(MenuItem) private readonly menuItems: Repository<MenuItem>) {}
  async onApplicationBootstrap() {
    if (await this.users.count()) return;
    await this.users.save([
      this.users.create({ email: 'admin@food.local', passwordHash: await bcrypt.hash('Admin@123456', 10), fullName: 'System Admin', role: UserRole.ADMIN }),
      this.users.create({ email: 'customer@food.local', passwordHash: await bcrypt.hash('Customer@123456', 10), fullName: 'Demo Customer', address: '01 Nguyen Hue, Ho Chi Minh City', role: UserRole.CUSTOMER }),
    ]);
    const restaurant = await this.restaurants.save(this.restaurants.create({ name: 'Bếp Nhà Online', description: 'Cơm Việt, đồ ăn nhanh và thức uống giao tận nơi.', address: '12 Le Loi, District 1', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4' }));
    await this.menuItems.save([
      this.menuItems.create({ restaurantId: restaurant.id, name: 'Cơm gà xối mỡ', description: 'Gà giòn, cơm thơm, rau dưa.', price: '59000.00', imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d' }),
      this.menuItems.create({ restaurantId: restaurant.id, name: 'Bún bò Huế', description: 'Nước dùng đậm vị, topping đầy đủ.', price: '65000.00', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624' }),
      this.menuItems.create({ restaurantId: restaurant.id, name: 'Trà đào cam sả', description: 'Thức uống mát lạnh.', price: '35000.00', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc' }),
    ]);
  }
}
