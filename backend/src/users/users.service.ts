import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}
  findByEmail(email: string) { return this.users.findOne({ where: { email } }); }
  findById(id: string) { return this.users.findOneOrFail({ where: { id } }); }
  create(data: Partial<User>) { return this.users.save(this.users.create(data)); }
  findAll() { return this.users.find({ order: { createdAt: 'DESC' } }); }
  async update(id: string, data: Partial<User>) { const user = await this.users.findOne({ where: { id } }); if (!user) throw new NotFoundException('User not found'); Object.assign(user, data); return this.users.save(user); }
  async remove(id: string) { const user = await this.users.findOne({ where: { id } }); if (!user) throw new NotFoundException('User not found'); await this.users.delete(id); return { deleted: true }; }
}
