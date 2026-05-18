import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MenuItem } from '../menu-items/menu-item.entity';
import { User } from '../users/user.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column('text') description: string;
  @Column() address: string;
  @Column({ nullable: true }) imageUrl?: string;
  @Column({ default: true }) isOpen: boolean;
  @ManyToOne(() => User, user => user.restaurants, { nullable: true }) owner?: User;
  @OneToMany(() => MenuItem, item => item.restaurant) menuItems: MenuItem[];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
