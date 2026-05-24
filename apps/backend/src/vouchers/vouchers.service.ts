import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from '../entities/voucher.entity';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private repo: Repository<Voucher>
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const voucher = await this.repo.findOneBy({ id });
    if (!voucher) throw new NotFoundException('Voucher không tồn tại');
    return voucher;
  }

  async validateCode(code: string, total: number) {
    const voucher = await this.repo.findOneBy({ code });
    if (!voucher) throw new NotFoundException('Mã giảm giá không tồn tại');
    if (voucher.used_count >= voucher.usage_limit) {
      throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng');
    }
    if (total < Number(voucher.min_order_value)) {
      throw new BadRequestException(`Đơn hàng chưa đạt giá trị tối thiểu ${voucher.min_order_value}đ để áp dụng voucher này`);
    }
    return voucher;
  }

  create(data: Partial<Voucher>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Voucher>) {
    const voucher = await this.findOne(id);
    Object.assign(voucher, data);
    return this.repo.save(voucher);
  }

  async remove(id: number) {
    const voucher = await this.findOne(id);
    await this.repo.remove(voucher);
    return { success: true };
  }
}
