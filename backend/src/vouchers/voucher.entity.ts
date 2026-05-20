import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) code: string;
  @Column({ type: 'numeric', precision: 12, scale: 2 }) discountAmount: string;
  @Column({ default: true }) isActive: boolean;
  @Column({ type: 'timestamp', nullable: true }) expiresAt?: Date;
  @ManyToOne(() => Restaurant, { nullable: true }) restaurant?: Restaurant;
  @Column({ nullable: true }) restaurantId?: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
