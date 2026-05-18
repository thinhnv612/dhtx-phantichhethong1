import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto';
import { MenuItem } from './menu-item.entity';

@Injectable()
export class MenuItemsService {
  constructor(@InjectRepository(MenuItem) private readonly menuItems: Repository<MenuItem>) {}
  findByRestaurant(restaurantId: string) { return this.menuItems.find({ where: { restaurantId, isAvailable: true }, order: { createdAt: 'DESC' } }); }
  async findOne(id: string) { const item = await this.menuItems.findOne({ where: { id } }); if (!item) throw new NotFoundException('Menu item not found'); return item; }
  create(dto: CreateMenuItemDto) { return this.menuItems.save(this.menuItems.create({ ...dto, price: dto.price.toFixed(2) })); }
  async update(id: string, dto: UpdateMenuItemDto) { const item = await this.findOne(id); Object.assign(item, dto.price === undefined ? dto : { ...dto, price: dto.price.toFixed(2) }); return this.menuItems.save(item); }
  async remove(id: string) { await this.menuItems.delete(id); return { deleted: true }; }
}
