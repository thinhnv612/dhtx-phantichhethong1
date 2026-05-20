import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemIngredient } from './menu-item-ingredient.entity';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto';
import { MenuItem } from './menu-item.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem) private readonly menuItems: Repository<MenuItem>,
    @InjectRepository(MenuItemIngredient) private readonly ingredients: Repository<MenuItemIngredient>,
  ) {}

  findByRestaurant(restaurantId: string) {
    return this.menuItems.find({ where: { restaurantId, isAvailable: true }, relations: { ingredients: { inventoryItem: true } }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const item = await this.menuItems.findOne({ where: { id }, relations: { ingredients: { inventoryItem: true } } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async create(dto: CreateMenuItemDto) {
    const { ingredients, ...payload } = dto;
    const item = await this.menuItems.save(this.menuItems.create({ ...payload, price: dto.price.toFixed(2) }));
    if (ingredients?.length) {
      await this.ingredients.save(ingredients.map(i => this.ingredients.create({ menuItemId: item.id, inventoryItemId: i.inventoryItemId, quantityPerUnit: i.quantityPerUnit.toFixed(3), unit: i.unit })));
    }
    return this.findOne(item.id);
  }

  async update(id: string, dto: UpdateMenuItemDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto.price === undefined ? dto : { ...dto, price: dto.price.toFixed(2) });
    await this.menuItems.save(item);
    if (dto.ingredients) {
      await this.ingredients.delete({ menuItemId: id });
      if (dto.ingredients.length) {
        await this.ingredients.save(dto.ingredients.map(i => this.ingredients.create({ menuItemId: id, inventoryItemId: i.inventoryItemId, quantityPerUnit: i.quantityPerUnit.toFixed(3), unit: i.unit })));
      }
    }
    return this.findOne(id);
  }

  async remove(id: string) { await this.menuItems.delete(id); return { deleted: true }; }
}
