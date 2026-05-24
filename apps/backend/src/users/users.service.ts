import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>
  ) {}

  findAll() {
    return this.repo.find({
      select: ['id', 'username', 'role'], // Don't return password hashes!
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('Tài khoản không tồn tại');
    return user;
  }

  async create(data: any) {
    const existing = await this.repo.findOneBy({ username: data.username });
    if (existing) throw new ConflictException('Tên đăng nhập đã tồn tại');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.repo.create({
      username: data.username,
      password_hash: hashedPassword,
      role: data.role,
    });
    const saved = await this.repo.save(user);
    delete (saved as any).password_hash;
    return saved;
  }

  async update(id: number, data: any) {
    const user = await this.findOne(id);
    
    if (data.username && data.username !== user.username) {
      const existing = await this.repo.findOneBy({ username: data.username });
      if (existing) throw new ConflictException('Tên đăng nhập đã tồn tại');
      user.username = data.username;
    }

    if (data.password) {
      user.password_hash = await bcrypt.hash(data.password, 10);
    }

    if (data.role) {
      user.role = data.role;
    }

    const saved = await this.repo.save(user);
    delete (saved as any).password_hash;
    return saved;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.repo.remove(user);
    return { success: true };
  }
}
