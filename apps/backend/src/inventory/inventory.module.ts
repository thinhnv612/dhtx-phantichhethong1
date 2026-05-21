import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryTransaction } from '../entities/inventory-transaction.entity';
import { Product } from '../entities/product.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
@Module({ imports: [TypeOrmModule.forFeature([Product, InventoryTransaction])], controllers: [InventoryController], providers: [InventoryService] })
export class InventoryModule {}
