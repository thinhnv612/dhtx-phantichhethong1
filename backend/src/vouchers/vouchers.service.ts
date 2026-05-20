import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVoucherDto, UpdateVoucherDto } from './dto';
import { Voucher } from './voucher.entity';

@Injectable()
export class VouchersService {
  constructor(@InjectRepository(Voucher) private readonly vouchers: Repository<Voucher>) {}
  findAll() { return this.vouchers.find({ order: { createdAt: 'DESC' } }); }
  async findOne(id: string) { const item = await this.vouchers.findOne({ where: { id } }); if (!item) throw new NotFoundException('Voucher not found'); return item; }
  create(dto: CreateVoucherDto) { return this.vouchers.save(this.vouchers.create({ ...dto, discountAmount: dto.discountAmount.toFixed(2), expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined })); }
  async update(id: string, dto: UpdateVoucherDto) { const item = await this.findOne(id); Object.assign(item, dto.discountAmount === undefined ? dto : { ...dto, discountAmount: dto.discountAmount.toFixed(2) }, dto.expiresAt === undefined ? {} : { expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined }); return this.vouchers.save(item); }
  async remove(id: string) { await this.findOne(id); await this.vouchers.delete(id); return { deleted: true }; }
}
