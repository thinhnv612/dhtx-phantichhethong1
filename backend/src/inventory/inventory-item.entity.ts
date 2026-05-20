import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ type: 'int', default: 0 }) quantity: number;
  @Column({ type: 'numeric', precision: 12, scale: 2, default: '0.00' }) unitCost: string;
  @Column({ nullable: true }) unit?: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
