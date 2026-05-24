import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Support } from '../entities/support.entity';
import { CreateSupportDto } from './dto/support.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Support)
    private repo: Repository<Support>
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const support = await this.repo.findOneBy({ id });
    if (!support) throw new NotFoundException('Yêu cầu hỗ trợ không tồn tại');
    return support;
  }

  create(data: CreateSupportDto) {
    const support = this.repo.create({
      customer_name: data.name,
      phone: data.phone,
      message: data.message,
    });
    return this.repo.save(support);
  }

  async reply(id: number, replyText: string) {
    const support = await this.findOne(id);
    support.reply = replyText;
    support.status = 'REPLIED';
    return this.repo.save(support);
  }
}
