import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InventoryItem } from '../inventory/inventory-item.entity';
import { MenuItem } from './menu-item.entity';

@Entity('menu_item_ingredients')
export class MenuItemIngredient {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => MenuItem, { onDelete: 'CASCADE' }) menuItem: MenuItem;
  @Column() menuItemId: string;
  @ManyToOne(() => InventoryItem, { eager: true, onDelete: 'CASCADE' }) inventoryItem: InventoryItem;
  @Column() inventoryItemId: string;
  @Column({ type: 'numeric', precision: 12, scale: 3 }) quantityPerUnit: string;
  @Column({ nullable: true }) unit?: string;
}
