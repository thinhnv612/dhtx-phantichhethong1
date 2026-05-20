import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) code: string;
  @Column({ type: 'numeric', precision: 12, scale: 2 }) discountAmount: string;
  @Column({ default: true }) isActive: boolean;
  @Column({ type: 'timestamp', nullable: true }) expiresAt?: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
