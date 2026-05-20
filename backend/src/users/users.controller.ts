import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../common/enums';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}
  @Get() findAll() { return this.users.findAll(); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: { fullName?: string; phone?: string; address?: string; role?: UserRole }) { return this.users.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.users.remove(id); }
}
