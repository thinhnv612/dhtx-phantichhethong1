import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './enums';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) username: string;
  @Column() password_hash: string;
  @Column({ type: 'enum', enum: UserRole }) role: UserRole;
}
