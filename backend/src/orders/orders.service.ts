import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../common/enums';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { Voucher } from '../vouchers/voucher.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.DELIVERING, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Voucher) private readonly vouchers: Repository<Voucher>,
    private readonly menuItems: MenuItemsService,
  ) {}

  findAll() {
    return this.orders.find({ relations: { items: { menuItem: true }, restaurant: true, customer: true, voucher: true }, order: { createdAt: 'DESC' } });
  }

  findForCustomer(customerId: string) {
    return this.orders.find({ where: { customerId }, relations: { items: { menuItem: true }, restaurant: true, voucher: true }, order: { createdAt: 'DESC' } });
  }

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

    let voucher: Voucher | null = null;
    if (dto.voucherCode) {
      voucher = await this.vouchers.findOne({ where: { code: dto.voucherCode, isActive: true } });
      if (!voucher) throw new BadRequestException('Voucher is invalid or inactive');
      if (voucher.restaurantId && voucher.restaurantId !== dto.restaurantId) throw new BadRequestException('Voucher does not belong to selected restaurant');
      if (voucher.expiresAt && voucher.expiresAt.getTime() < Date.now()) throw new BadRequestException('Voucher expired');
      total = Math.max(0, total - Number(voucher.discountAmount));
    }

    return this.orders.save(this.orders.create({ customerId, restaurantId: dto.restaurantId, voucherId: voucher?.id, status: OrderStatus.CONFIRMED, deliveryAddress: dto.deliveryAddress, customerPhone: dto.customerPhone, note: dto.note, totalAmount: total.toFixed(2), paymentMethod: dto.paymentMethod ?? PaymentMethod.MOMO, paymentStatus: PaymentStatus.PAID, paidAt: new Date(), paymentTransactionId: `PAY-${Date.now()}`, items: orderItems }));
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== dto.status && !allowedTransitions[order.status].includes(dto.status)) {
      throw new BadRequestException(`Invalid status transition from ${order.status} to ${dto.status}`);
    }
    order.status = dto.status;
    return this.orders.save(order);
  }

  async remove(id: string) {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    await this.orders.delete(id);
    return { deleted: true };
  }
}
