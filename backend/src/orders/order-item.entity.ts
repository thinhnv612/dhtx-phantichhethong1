import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MenuItem } from '../menu-items/menu-item.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' }) order: Order;
  @Column() orderId: string;
  @ManyToOne(() => MenuItem) menuItem: MenuItem;
  @Column() menuItemId: string;
  @Column() quantity: number;
  @Column({ type: 'numeric', precision: 12, scale: 2 }) unitPrice: string;
}
