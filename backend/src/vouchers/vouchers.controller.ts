import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVoucherDto, UpdateVoucherDto } from './dto';
import { VouchersService } from './vouchers.service';

@ApiTags('vouchers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchers: VouchersService) {}
  @Get() findAll() { return this.vouchers.findAll(); }
  @Post() create(@Body() dto: CreateVoucherDto) { return this.vouchers.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateVoucherDto) { return this.vouchers.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.vouchers.remove(id); }
}
