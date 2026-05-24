import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryTransactionType, OrderStatus } from '../entities/enums';
import { InventoryTransaction } from '../entities/inventory-transaction.entity';
import { OrderDetail } from '../entities/order-detail.entity';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Voucher } from '../entities/voucher.entity';
import { OrdersSseService } from './orders-sse.service';

@Injectable()
export class OrdersService {
  constructor(
    private ds: DataSource,
    private sse: OrdersSseService
  ) {}

  async findAll(status?: string) {
    const query = this.ds.getRepository(Order).createQueryBuilder('order')
      .leftJoinAndSelect('order.voucher', 'voucher')
      .orderBy('order.id', 'DESC');
    
    if (status) {
      query.where('order.status = :status', { status });
    }

    const orders = await query.getMany();

    // Fetch order details for each order
    for (const order of orders) {
      order['details'] = await this.ds.getRepository(OrderDetail).find({
        where: { order: { id: order.id } },
        relations: ['product'],
      });
    }

    return orders;
  }

  async findOne(id: number) {
    const order = await this.ds.getRepository(Order).findOne({
      where: { id },
      relations: ['voucher'],
    });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    
    order['details'] = await this.ds.getRepository(OrderDetail).find({
      where: { order: { id: order.id } },
      relations: ['product'],
    });

    return order;
  }

  async updateStatus(id: number, status: OrderStatus) {
    return this.ds.transaction(async (m) => {
      const order = await m.findOne(Order, {
        where: { id },
        relations: ['voucher'],
      });
      if (!order) throw new NotFoundException('Đơn hàng không tồn tại');

      // If transition to CANCELLED and it wasn't already CANCELLED, restore stocks!
      if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
        const details = await m.find(OrderDetail, {
          where: { order: { id: order.id } },
          relations: ['product'],
        });
        for (const d of details) {
          await m.increment(Product, { id: d.product.id }, 'stock_quantity', d.quantity);
          await m.insert(InventoryTransaction, {
            product: { id: d.product.id },
            transaction_type: InventoryTransactionType.ADJUSTMENT,
            quantity_change: d.quantity,
          });
        }

        // Refund voucher usage if voucher was applied
        if (order.voucher) {
          await m.decrement(Voucher, { id: order.voucher.id }, 'used_count', 1);
        }
      }

      order.status = status;
      return m.save(Order, order);
    });
  }

  async createOrder(dto: { customer_name: string; voucher_code?: string; items: Array<{product_id:number;quantity:number}> }, userId?: number) {
    return this.ds.transaction(async (m) => {
      const products = await m.findByIds(Product, dto.items.map((x) => x.product_id));
      const map = new Map(products.map((p) => [p.id, p]));
      let total = 0;
      
      for (const item of dto.items) {
        const p = map.get(item.product_id); 
        if (!p) throw new ConflictException('Sản phẩm không tồn tại');
        
        const update = await m.createQueryBuilder()
          .update(Product)
          .set({ 
            stock_quantity: () => `stock_quantity - ${item.quantity}`, 
            version: () => 'version + 1' 
          })
          .where('id = :id AND version = :v AND stock_quantity >= :qty', { 
            id: p.id, 
            v: p.version, 
            qty: item.quantity 
          })
          .execute();
          
        if ((update.affected ?? 0) === 0) throw new ConflictException(`Sản phẩm ${p.name} không đủ tồn kho`);
        total += Number(p.price) * item.quantity;
        
        await m.insert(InventoryTransaction, { 
          product: { id: p.id }, 
          transaction_type: InventoryTransactionType.SALE, 
          quantity_change: -item.quantity, 
          created_by: userId ? { id: userId } : undefined 
        });
      }
      
      let voucher: Voucher | null = null; 
      let discount = 0;
      if (dto.voucher_code) {
        voucher = await m.findOne(Voucher, { where: { code: dto.voucher_code } });
        if (!voucher || total < Number(voucher.min_order_value)) throw new ConflictException('Voucher không hợp lệ hoặc đơn hàng chưa đạt giá trị tối thiểu');
        
        const vu = await m.createQueryBuilder()
          .update(Voucher)
          .set({ 
            used_count: () => 'used_count + 1', 
            version: () => 'version + 1' 
          })
          .where('id = :id AND version = :v AND used_count < usage_limit', { 
            id: voucher.id, 
            v: voucher.version 
          })
          .execute();
          
        if ((vu.affected ?? 0) === 0) throw new ConflictException('Voucher đã hết lượt sử dụng');
        discount = Number(voucher.discount_amount);
      }
      
      const order = await m.save(Order, { 
        customer_name: dto.customer_name, 
        total_price: total, 
        discount_applied: discount, 
        final_price: Math.max(0, total - discount), 
        voucher, 
        status: OrderStatus.PENDING 
      });
      
      const createdDetails = [];
      for (const item of dto.items) {
        const p = map.get(item.product_id)!;
        const d = await m.save(OrderDetail, { order, product: p, quantity: item.quantity, price_at_purchase: p.price });
        createdDetails.push({ ...d, product: p });
      }

      // Prepare SSE payload
      const ssePayload = {
        ...order,
        details: createdDetails,
      };

      // Broadcast order creation event in real-time!
      this.sse.emit(ssePayload);

      return order;
    });
  }
}
