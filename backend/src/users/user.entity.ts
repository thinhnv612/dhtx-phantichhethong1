import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../common/enums';
import { Order } from '../orders/order.entity';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column() passwordHash: string;
  @Column() fullName: string;
  @Column({ nullable: true }) phone?: string;
  @Column({ nullable: true }) address?: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER }) role: UserRole;
  @OneToMany(() => Order, order => order.customer) orders: Order[];
  @OneToMany(() => Restaurant, restaurant => restaurant.owner) restaurants: Restaurant[];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
