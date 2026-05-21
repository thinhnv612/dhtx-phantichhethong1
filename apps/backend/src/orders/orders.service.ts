import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryTransactionType, OrderStatus } from '../entities/enums';
import { InventoryTransaction } from '../entities/inventory-transaction.entity';
import { OrderDetail } from '../entities/order-detail.entity';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Voucher } from '../entities/voucher.entity';
@Injectable()
export class OrdersService {
  constructor(private ds: DataSource) {}
  async createOrder(dto: { customer_name: string; voucher_code?: string; items: Array<{product_id:number;quantity:number}> }, userId: number) {
    return this.ds.transaction(async (m) => {
      const products = await m.findByIds(Product, dto.items.map((x) => x.product_id));
      const map = new Map(products.map((p) => [p.id, p]));
      let total = 0;
      for (const item of dto.items) {
        const p = map.get(item.product_id); if (!p) throw new ConflictException('Sản phẩm không tồn tại');
        const update = await m.createQueryBuilder().update(Product).set({ stock_quantity: () => `stock_quantity - ${item.quantity}`, version: () => 'version + 1' }).where('id = :id AND version = :v AND stock_quantity >= :qty', { id: p.id, v: p.version, qty: item.quantity }).execute();
        if ((update.affected ?? 0) === 0) throw new ConflictException('Sản phẩm/Voucher đã hết');
        total += Number(p.price) * item.quantity;
        await m.insert(InventoryTransaction, { product: { id: p.id }, transaction_type: InventoryTransactionType.SALE, quantity_change: -item.quantity, created_by: { id: userId } });
      }
      let voucher: Voucher | null = null; let discount = 0;
      if (dto.voucher_code) {
        voucher = await m.findOne(Voucher, { where: { code: dto.voucher_code } });
        if (!voucher || total < Number(voucher.min_order_value)) throw new ConflictException('Voucher không hợp lệ');
        const vu = await m.createQueryBuilder().update(Voucher).set({ used_count: () => 'used_count + 1', version: () => 'version + 1' }).where('id = :id AND version = :v AND used_count < usage_limit', { id: voucher.id, v: voucher.version }).execute();
        if ((vu.affected ?? 0) === 0) throw new ConflictException('Sản phẩm/Voucher đã hết');
        discount = Number(voucher.discount_amount);
      }
      const order = await m.save(Order, { customer_name: dto.customer_name, total_price: total, discount_applied: discount, final_price: Math.max(0, total - discount), voucher, status: OrderStatus.PAID });
      for (const item of dto.items) {
        const p = map.get(item.product_id)!;
        await m.save(OrderDetail, { order, product: p, quantity: item.quantity, price_at_purchase: p.price });
      }
      return order;
    });
  }
}
