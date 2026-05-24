import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('supports')
export class Support {
  @PrimaryGeneratedColumn() id: number;
  @Column() customer_name: string;
  @Column() phone: string;
  @Column('text') message: string;
  @Column('text', { nullable: true }) reply?: string | null;
  @Column({ default: 'PENDING' }) status: string; // PENDING, REPLIED
  @CreateDateColumn() created_at: Date;
}
