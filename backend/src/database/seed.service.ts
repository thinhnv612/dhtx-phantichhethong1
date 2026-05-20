import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InventoryItem } from '../inventory/inventory-item.entity';
import { MenuItemIngredient } from '../menu-items/menu-item-ingredient.entity';
import { MenuItem } from '../menu-items/menu-item.entity';
import { OrderStatus, PaymentMethod, PaymentStatus, UserRole } from '../common/enums';
import { OrderItem } from '../orders/order-item.entity';
import { Order } from '../orders/order.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../users/user.entity';
import { Voucher } from '../vouchers/voucher.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(MenuItem) private readonly menuItems: Repository<MenuItem>,
    @InjectRepository(MenuItemIngredient) private readonly ingredients: Repository<MenuItemIngredient>,
    @InjectRepository(InventoryItem) private readonly inventory: Repository<InventoryItem>,
    @InjectRepository(Voucher) private readonly vouchers: Repository<Voucher>,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
  ) {}

  async onApplicationBootstrap() {
    if (await this.users.count()) return;

    const password = await bcrypt.hash('Customer@123456', 10);
    const [, owner, customer, customerTwo] = await this.users.save([
      this.users.create({ email: 'admin@food.local', passwordHash: await bcrypt.hash('Admin@123456', 10), fullName: 'System Admin', phone: '0909000001', role: UserRole.ADMIN }),
      this.users.create({ email: 'owner@food.local', passwordHash: await bcrypt.hash('Owner@123456', 10), fullName: 'Nguyễn Minh Chủ Quán', phone: '0909123456', address: '45 Trần Hưng Đạo, Quận 1, TP.HCM', role: UserRole.RESTAURANT_OWNER }),
      this.users.create({ email: 'customer@food.local', passwordHash: password, fullName: 'Trần Thị Mai', phone: '0912345678', address: '01 Nguyễn Huệ, Quận 1, TP.HCM', role: UserRole.CUSTOMER }),
      this.users.create({ email: 'customer2@food.local', passwordHash: password, fullName: 'Lê Hoàng Nam', phone: '0987654321', address: '88 Pasteur, Quận 3, TP.HCM', role: UserRole.CUSTOMER }),
    ]);

    const restaurants = await this.restaurants.save([
      this.restaurants.create({ name: 'Bếp Nhà Online', description: 'Cơm Việt, món nước, đồ ăn nhanh và thức uống giao tận nơi.', address: '12 Lê Lợi, Quận 1, TP.HCM', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', owner }),
      this.restaurants.create({ name: 'Phở & Bún Huế An Nhiên', description: 'Các món nước nóng hổi, nước dùng ninh xương đậm vị.', address: '25 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', owner }),
      this.restaurants.create({ name: 'Healthy Box Saigon', description: 'Salad, cơm gạo lứt và nước ép cho bữa trưa văn phòng.', address: '101 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', owner }),
    ]);

    const [bepNha, anNhien, healthy] = restaurants;

    const stocks = await this.inventory.save([
      this.inventory.create({ restaurantId: bepNha.id, name: 'Gạo tẻ', quantity: 20000, minStock: 4000, unit: 'gram', unitCost: '0.04' }),
      this.inventory.create({ restaurantId: bepNha.id, name: 'Đùi gà', quantity: 60, minStock: 12, unit: 'piece', unitCost: '12000.00' }),
      this.inventory.create({ restaurantId: bepNha.id, name: 'Cam vàng', quantity: 120, minStock: 25, unit: 'piece', unitCost: '5000.00' }),
      this.inventory.create({ restaurantId: anNhien.id, name: 'Bún sợi', quantity: 15000, minStock: 3000, unit: 'gram', unitCost: '0.03' }),
      this.inventory.create({ restaurantId: anNhien.id, name: 'Bò bắp', quantity: 8000, minStock: 1500, unit: 'gram', unitCost: '0.18' }),
      this.inventory.create({ restaurantId: healthy.id, name: 'Ức gà', quantity: 7000, minStock: 1400, unit: 'gram', unitCost: '0.12' }),
      this.inventory.create({ restaurantId: healthy.id, name: 'Rau salad', quantity: 5000, minStock: 1200, unit: 'gram', unitCost: '0.05' }),
      this.inventory.create({ restaurantId: healthy.id, name: 'Táo xanh', quantity: 140, minStock: 30, unit: 'piece', unitCost: '6000.00' }),
    ]);

    const stockByName = new Map(stocks.map(item => [item.name, item]));

    const menuItems = await this.menuItems.save([
      this.menuItems.create({ restaurantId: bepNha.id, category: 'Cơm phần', name: 'Cơm gà xối mỡ', description: 'Đùi gà chiên giòn, cơm chiên tỏi, dưa leo, đồ chua và nước mắm gừng.', price: '59000.00', imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d' }),
      this.menuItems.create({ restaurantId: bepNha.id, category: 'Đồ uống', name: 'Trà đào cam sả', description: 'Trà đào ủ lạnh, cam vàng, sả cây và đào miếng.', price: '35000.00', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc' }),
      this.menuItems.create({ restaurantId: anNhien.id, category: 'Món nước', name: 'Bún bò Huế đặc biệt', description: 'Bắp bò, chả cua, giò heo, rau sống và sa tế Huế.', price: '75000.00', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624' }),
      this.menuItems.create({ restaurantId: healthy.id, category: 'Healthy', name: 'Salad ức gà áp chảo', description: 'Ức gà, xà lách romaine, bơ, cà chua bi và sốt mè rang.', price: '89000.00', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }),
      this.menuItems.create({ restaurantId: healthy.id, category: 'Đồ uống', name: 'Nước ép táo cần tây', description: 'Táo xanh, cần tây, chanh vàng ép lạnh không thêm đường.', price: '49000.00', imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8' }),
    ]);

    const byName = new Map(menuItems.map(item => [item.name, item]));

    await this.ingredients.save([
      this.ingredients.create({ menuItemId: byName.get('Cơm gà xối mỡ')!.id, inventoryItemId: stockByName.get('Gạo tẻ')!.id, quantityPerUnit: '180.000', unit: 'gram' }),
      this.ingredients.create({ menuItemId: byName.get('Cơm gà xối mỡ')!.id, inventoryItemId: stockByName.get('Đùi gà')!.id, quantityPerUnit: '1.000', unit: 'piece' }),
      this.ingredients.create({ menuItemId: byName.get('Trà đào cam sả')!.id, inventoryItemId: stockByName.get('Cam vàng')!.id, quantityPerUnit: '0.500', unit: 'piece' }),
      this.ingredients.create({ menuItemId: byName.get('Bún bò Huế đặc biệt')!.id, inventoryItemId: stockByName.get('Bún sợi')!.id, quantityPerUnit: '220.000', unit: 'gram' }),
      this.ingredients.create({ menuItemId: byName.get('Bún bò Huế đặc biệt')!.id, inventoryItemId: stockByName.get('Bò bắp')!.id, quantityPerUnit: '120.000', unit: 'gram' }),
      this.ingredients.create({ menuItemId: byName.get('Salad ức gà áp chảo')!.id, inventoryItemId: stockByName.get('Ức gà')!.id, quantityPerUnit: '150.000', unit: 'gram' }),
      this.ingredients.create({ menuItemId: byName.get('Salad ức gà áp chảo')!.id, inventoryItemId: stockByName.get('Rau salad')!.id, quantityPerUnit: '80.000', unit: 'gram' }),
      this.ingredients.create({ menuItemId: byName.get('Nước ép táo cần tây')!.id, inventoryItemId: stockByName.get('Táo xanh')!.id, quantityPerUnit: '1.500', unit: 'piece' }),
    ]);

    const vouchers = await this.vouchers.save([
      this.vouchers.create({ code: 'BEPNHA20K', discountAmount: '20000.00', isActive: true, expiresAt: new Date('2026-12-31T23:59:59.000Z'), restaurantId: bepNha.id }),
      this.vouchers.create({ code: 'AN_NHIEN10K', discountAmount: '10000.00', isActive: true, expiresAt: new Date('2026-09-30T23:59:59.000Z'), restaurantId: anNhien.id }),
      this.vouchers.create({ code: 'WELCOME15K', discountAmount: '15000.00', isActive: true, expiresAt: new Date('2026-12-31T23:59:59.000Z') }),
      this.vouchers.create({ code: 'EXPIRED5K', discountAmount: '5000.00', isActive: false, expiresAt: new Date('2025-12-31T23:59:59.000Z') }),
    ]);

    const createItem = (name: string, quantity: number) => {
      const menuItem = byName.get(name)!;
      return Object.assign(new OrderItem(), { menuItemId: menuItem.id, quantity, unitPrice: Number(menuItem.price).toFixed(2) });
    };

    const orderAItems = [createItem('Cơm gà xối mỡ', 1), createItem('Trà đào cam sả', 2)];
    const orderBItems = [createItem('Bún bò Huế đặc biệt', 2)];
    const orderCItems = [createItem('Salad ức gà áp chảo', 1), createItem('Nước ép táo cần tây', 1)];

    const sum = (items: OrderItem[], discount = 0) => Math.max(0, items.reduce((total, item) => total + Number(item.unitPrice) * item.quantity, 0) - discount).toFixed(2);

    await this.orders.save([
      this.orders.create({ customer, customerId: customer.id, restaurant: bepNha, restaurantId: bepNha.id, voucherId: vouchers.find(v => v.code === 'BEPNHA20K')?.id, status: OrderStatus.COMPLETED, totalAmount: sum(orderAItems, 20000), deliveryAddress: customer.address!, customerPhone: customer.phone!, note: 'Giao giờ nghỉ trưa, gọi trước 5 phút.', paymentMethod: PaymentMethod.MOMO, paymentStatus: PaymentStatus.PAID, paidAt: new Date('2026-05-18T03:20:00.000Z'), paymentTransactionId: 'MOMO-20260518-0001', items: orderAItems }),
      this.orders.create({ customer, customerId: customer.id, restaurant: anNhien, restaurantId: anNhien.id, voucherId: vouchers.find(v => v.code === 'AN_NHIEN10K')?.id, status: OrderStatus.CONFIRMED, totalAmount: sum(orderBItems, 10000), deliveryAddress: 'Tầng 6, 39 Lê Duẩn, Quận 1, TP.HCM', customerPhone: customer.phone, note: 'Ít cay, thêm rau sống.', paymentMethod: PaymentMethod.VNPAY, paymentStatus: PaymentStatus.PAID, paidAt: new Date('2026-05-18T04:05:00.000Z'), paymentTransactionId: 'VNPAY-20260518-0002', items: orderBItems }),
      this.orders.create({ customer: customerTwo, customerId: customerTwo.id, restaurant: healthy, restaurantId: healthy.id, voucherId: vouchers.find(v => v.code === 'WELCOME15K')?.id, status: OrderStatus.PREPARING, totalAmount: sum(orderCItems, 15000), deliveryAddress: customerTwo.address!, customerPhone: customerTwo.phone!, note: 'Không lấy ống hút nhựa.', paymentMethod: PaymentMethod.CARD, paymentStatus: PaymentStatus.PAID, paidAt: new Date('2026-05-18T04:30:00.000Z'), paymentTransactionId: 'CARD-20260518-0003', items: orderCItems }),
    ]);
  }
}
