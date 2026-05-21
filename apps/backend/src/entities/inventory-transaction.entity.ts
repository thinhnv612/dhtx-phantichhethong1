import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InventoryTransactionType } from './enums';
import { Product } from './product.entity';
import { User } from './user.entity';
@Entity('inventory_transactions')
export class InventoryTransaction {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => Product) @JoinColumn({ name: 'product_id' }) product: Product;
  @Column({ type: 'enum', enum: InventoryTransactionType }) transaction_type: InventoryTransactionType;
  @Column() quantity_change: number;
  @CreateDateColumn() created_at: Date;
  @ManyToOne(() => User) @JoinColumn({ name: 'created_by' }) created_by: User;
}
