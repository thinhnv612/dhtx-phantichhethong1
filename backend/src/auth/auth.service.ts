import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../common/enums';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}
  async register(dto: RegisterDto) {
    if (await this.users.findByEmail(dto.email)) throw new ConflictException('Email already exists');
    const user = await this.users.create({ email: dto.email, passwordHash: await bcrypt.hash(dto.password, 10), fullName: dto.fullName, phone: dto.phone, address: dto.address, role: UserRole.CUSTOMER });
    return this.issueToken(user);
  }
  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Invalid credentials');
    return this.issueToken(user);
  }
  private issueToken(user: { id: string; email: string; role: string; fullName: string }) {
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
    return { accessToken, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } };
  }
}
