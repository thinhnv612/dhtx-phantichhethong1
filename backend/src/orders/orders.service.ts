import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private readonly orders: Repository<Order>, private readonly menuItems: MenuItemsService) {}
  findForCustomer(customerId: string) { return this.orders.find({ where: { customerId }, relations: { items: { menuItem: true }, restaurant: true }, order: { createdAt: 'DESC' } }); }
  async create(customerId: string, dto: CreateOrderDto) {
    if (dto.items.length === 0) throw new BadRequestException('Order must contain at least one item');
    const orderItems: OrderItem[] = [];
    let total = 0;
    for (const requestItem of dto.items) {
      const menuItem = await this.menuItems.findOne(requestItem.menuItemId);
      if (menuItem.restaurantId !== dto.restaurantId) throw new BadRequestException('All items must belong to selected restaurant');
      const unitPrice = Number(menuItem.price);
      total += unitPrice * requestItem.quantity;
      orderItems.push(Object.assign(new OrderItem(), { menuItemId: menuItem.id, quantity: requestItem.quantity, unitPrice: unitPrice.toFixed(2) }));
    }
    return this.orders.save(this.orders.create({ customerId, restaurantId: dto.restaurantId, deliveryAddress: dto.deliveryAddress, note: dto.note, totalAmount: total.toFixed(2), items: orderItems }));
  }
  async updateStatus(id: string, dto: UpdateOrderStatusDto) { const order = await this.orders.findOne({ where: { id } }); if (!order) throw new NotFoundException('Order not found'); order.status = dto.status; return this.orders.save(order); }
}
