import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ type: 'int', default: 0 }) quantity: number;
  @Column({ type: 'int', default: 10 }) minStock: number;
  @Column({ type: 'numeric', precision: 12, scale: 2, default: '0.00' }) unitCost: string;
  @Column({ nullable: true }) unit?: string;
  @ManyToOne(() => Restaurant, { nullable: true }) restaurant?: Restaurant;
  @Column({ nullable: true }) restaurantId?: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @VersionColumn() version: number;
}
