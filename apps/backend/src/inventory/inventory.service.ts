import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InventoryTransactionType } from '../entities/enums';
import { InventoryTransaction } from '../entities/inventory-transaction.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class InventoryService {
  constructor(
    private ds: DataSource, 
    @InjectRepository(Product) private products: Repository<Product>, 
    @InjectRepository(InventoryTransaction) private logs: Repository<InventoryTransaction>
  ) {}

  async findAll() {
    return this.logs.find({
      relations: ['product', 'created_by'],
      order: { id: 'DESC' },
    });
  }

  async importStock(items: Array<{ product_id: number; quantity: number }>, userId: number) {
    return this.ds.transaction(async (m) => {
      for (const item of items) {
        const p = await m.findOneByOrFail(Product, { id: item.product_id });
        await m.increment(Product, { id: p.id }, 'stock_quantity', item.quantity);
        await m.insert(InventoryTransaction, { 
          product: { id: p.id }, 
          transaction_type: InventoryTransactionType.IMPORT, 
          quantity_change: item.quantity, 
          created_by: { id: userId } 
        });
      }
      return { success: true };
    });
  }
}
