import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto';
import { Restaurant } from './restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(@InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>) {}
  findAll(search?: string) { return this.restaurants.find({ where: search ? [{ name: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }] : {}, relations: { menuItems: true }, order: { createdAt: 'DESC' } }); }
  async findOne(id: string) { const item = await this.restaurants.findOne({ where: { id }, relations: { menuItems: true } }); if (!item) throw new NotFoundException('Restaurant not found'); return item; }
  create(dto: CreateRestaurantDto) { return this.restaurants.save(this.restaurants.create(dto)); }
  async update(id: string, dto: UpdateRestaurantDto) { const item = await this.findOne(id); Object.assign(item, dto); return this.restaurants.save(item); }
  async remove(id: string) { await this.restaurants.delete(id); return { deleted: true }; }
}
