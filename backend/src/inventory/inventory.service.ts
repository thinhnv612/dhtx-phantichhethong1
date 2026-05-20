import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from './dto';
import { InventoryItem } from './inventory-item.entity';

@Injectable()
export class InventoryService {
  constructor(@InjectRepository(InventoryItem) private readonly items: Repository<InventoryItem>) {}

  private withStockStatus(item: InventoryItem) {
    const stockStatus = item.quantity === 0 ? 'OUT_OF_STOCK' : item.quantity <= item.minStock ? 'LOW_STOCK' : 'IN_STOCK';
    return { ...item, stockStatus };
  }

  async findAll() {
    const items = await this.items.find({ order: { createdAt: 'DESC' } });
    return items.map(item => this.withStockStatus(item));
  }

  async findOne(id: string) {
    const item = await this.items.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');
    return this.withStockStatus(item);
  }

  create(dto: CreateInventoryItemDto) {
    return this.items.save(this.items.create({ ...dto, unitCost: dto.unitCost.toFixed(2) })).then(item => this.withStockStatus(item));
  }

  async update(id: string, dto: UpdateInventoryItemDto) {
    const current = await this.items.findOne({ where: { id } });
    if (!current) throw new NotFoundException('Inventory item not found');
    Object.assign(current, dto.unitCost === undefined ? dto : { ...dto, unitCost: dto.unitCost.toFixed(2) });
    const item = await this.items.save(current);
    return this.withStockStatus(item);
  }

  async remove(id: string) {
    const item = await this.items.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');
    await this.items.delete(id);
    return { deleted: true };
  }
}
