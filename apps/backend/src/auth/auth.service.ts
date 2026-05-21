import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export class AuthService {
  constructor(@InjectRepository(User) private users: Repository<User>, private jwt: JwtService) {}
  async login(username: string, password: string) {
    const user = await this.users.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) throw new UnauthorizedException('Invalid credentials');
    return { access_token: await this.jwt.signAsync({ sub: user.id, username: user.username, role: user.role }) };
  }
}
