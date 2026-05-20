import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../common/enums';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../users/user.entity';
import { Voucher } from '../vouchers/voucher.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User, user => user.orders) customer: User;
  @Column() customerId: string;
  @ManyToOne(() => Restaurant) restaurant: Restaurant;
  @Column() restaurantId: string;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING }) status: OrderStatus;
  @Column({ type: 'numeric', precision: 12, scale: 2 }) totalAmount: string;
  @ManyToOne(() => Voucher, { nullable: true }) voucher?: Voucher;
  @Column({ nullable: true }) voucherId?: string;
  @Column() deliveryAddress: string;
  @Column({ nullable: true }) customerPhone?: string;
  @Column({ nullable: true }) note?: string;
  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.COD }) paymentMethod: PaymentMethod;
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID }) paymentStatus: PaymentStatus;
  @Column({ nullable: true }) paidAt?: Date;
  @Column({ nullable: true }) paymentTransactionId?: string;
  @OneToMany(() => OrderItem, item => item.order, { cascade: true }) items: OrderItem[];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
