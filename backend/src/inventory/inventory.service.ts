import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from './dto';
import { InventoryItem } from './inventory-item.entity';

@Injectable()
export class InventoryService {
  constructor(@InjectRepository(InventoryItem) private readonly items: Repository<InventoryItem>) {}
  findAll() { return this.items.find({ order: { createdAt: 'DESC' } }); }
  async findOne(id: string) { const item = await this.items.findOne({ where: { id } }); if (!item) throw new NotFoundException('Inventory item not found'); return item; }
  create(dto: CreateInventoryItemDto) { return this.items.save(this.items.create({ ...dto, unitCost: dto.unitCost.toFixed(2) })); }
  async update(id: string, dto: UpdateInventoryItemDto) { const item = await this.findOne(id); Object.assign(item, dto.unitCost === undefined ? dto : { ...dto, unitCost: dto.unitCost.toFixed(2) }); return this.items.save(item); }
  async remove(id: string) { await this.findOne(id); await this.items.delete(id); return { deleted: true }; }
}
