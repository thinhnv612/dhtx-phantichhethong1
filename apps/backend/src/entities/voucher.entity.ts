import { Column, Entity, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) code: string;
  @Column('numeric', { precision: 12, scale: 2 }) discount_amount: number;
  @Column('numeric', { precision: 12, scale: 2 }) min_order_value: number;
  @Column() usage_limit: number;
  @Column({ default: 0 }) used_count: number;
  @VersionColumn() version: number;
}
