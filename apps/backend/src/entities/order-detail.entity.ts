import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => Order) @JoinColumn({ name: 'order_id' }) order: Order;
  @ManyToOne(() => Product) @JoinColumn({ name: 'product_id' }) product: Product;
  @Column() quantity: number;
  @Column('numeric', { precision: 12, scale: 2 }) price_at_purchase: number;
}
