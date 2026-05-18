import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column('text') description: string;
  @Column({ default: 'Món chính' }) category: string;
  @Column({ type: 'numeric', precision: 12, scale: 2 }) price: string;
  @Column({ nullable: true }) imageUrl?: string;
  @Column({ default: true }) isAvailable: boolean;
  @ManyToOne(() => Restaurant, restaurant => restaurant.menuItems, { onDelete: 'CASCADE' }) restaurant: Restaurant;
  @Column() restaurantId: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
