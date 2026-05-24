import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from './enums';
import { Voucher } from './voucher.entity';
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn() id: number;
  @Column() customer_name: string;
  @Column('numeric', { precision: 12, scale: 2 }) total_price: number;
  @Column('numeric', { precision: 12, scale: 2, default: 0 }) discount_applied: number;
  @Column('numeric', { precision: 12, scale: 2 }) final_price: number;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PAID }) status: OrderStatus;
  @ManyToOne(() => Voucher, { nullable: true }) @JoinColumn({ name: 'voucher_id' }) voucher?: Voucher | null;
  @CreateDateColumn() created_at: Date;
  details?: any;
}
