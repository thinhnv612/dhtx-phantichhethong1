import { Column, Entity, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { ProductType } from './enums';
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @Column('numeric', { precision: 12, scale: 2 }) price: number;
  @Column({ default: 0 }) stock_quantity: number;
  @Column({ type: 'enum', enum: ProductType }) type: ProductType;
  @VersionColumn() version: number;
}
