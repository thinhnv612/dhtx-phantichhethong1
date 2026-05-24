import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Voucher } from '../entities/voucher.entity';
import { OrderDetail } from '../entities/order-detail.entity';
import { OrderStatus } from '../entities/enums';

@Injectable()
export class AnalyticsService {
  constructor(private ds: DataSource) {}

  async getDashboardStats() {
    const ordersRepo = this.ds.getRepository(Order);
    const productsRepo = this.ds.getRepository(Product);
    const vouchersRepo = this.ds.getRepository(Voucher);
    const orderDetailsRepo = this.ds.getRepository(OrderDetail);

    // 1. Core KPIs
    // Total Revenue (Only completed or paid/pending orders, excluding CANCELLED)
    const revenueRes = await ordersRepo.createQueryBuilder('o')
      .select('SUM(o.final_price)', 'sum')
      .where('o.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .getRawOne();
    const totalRevenue = Number(revenueRes?.sum || 0);

    // Total Orders
    const totalOrders = await ordersRepo.count();

    // Total Products
    const totalProducts = await productsRepo.count();

    // Active Vouchers
    const activeVouchers = await vouchersRepo.count();

    // 2. Low stock alert (quantity < 5)
    const lowStock = await productsRepo.createQueryBuilder('p')
      .where('p.stock_quantity < :limit', { limit: 5 })
      .getMany();

    // 3. Best-seller products (Group by product, sum quantities)
    const bestSellers = await orderDetailsRepo.createQueryBuilder('od')
      .innerJoinAndSelect('od.product', 'product')
      .innerJoin('od.order', 'order')
      .select('product.name', 'name')
      .addSelect('SUM(od.quantity)', 'sold')
      .addSelect('product.price', 'price')
      .where('order.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .groupBy('product.id')
      .addGroupBy('product.name')
      .orderBy('sold', 'DESC')
      .limit(5)
      .getRawMany();

    // Convert sold count to number
    const formattedBestSellers = bestSellers.map(x => ({
      name: x.name,
      sold: Number(x.sold || 0),
      price: Number(x.price || 0),
    }));

    // 4. Revenue Trend (last 7 days)
    const revenueTrend = await ordersRepo.createQueryBuilder('o')
      .select("TO_CHAR(o.created_at, 'YYYY-MM-DD')", 'date')
      .addSelect('SUM(o.final_price)', 'revenue')
      .where('o.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .groupBy("TO_CHAR(o.created_at, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .limit(7)
      .getRawMany();

    const formattedRevenueTrend = revenueTrend.map(x => ({
      date: x.date,
      revenue: Number(x.revenue || 0),
    }));

    return {
      kpis: {
        totalRevenue,
        totalOrders,
        totalProducts,
        activeVouchers,
      },
      lowStock,
      bestSellers: formattedBestSellers,
      revenueTrend: formattedRevenueTrend,
    };
  }
}
