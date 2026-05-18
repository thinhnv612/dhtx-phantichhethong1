import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { OrderStatus, PaymentMethod, PaymentStatus, UserRole } from '../common/enums';
import { MenuItem } from '../menu-items/menu-item.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Order } from '../orders/order.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../users/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(MenuItem) private readonly menuItems: Repository<MenuItem>,
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
    const menuItems = await this.menuItems.save([
      this.menuItems.create({ restaurantId: bepNha.id, category: 'Cơm phần', name: 'Cơm gà xối mỡ', description: 'Đùi gà chiên giòn, cơm chiên tỏi, dưa leo, đồ chua và nước mắm gừng.', price: '59000.00', imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d' }),
      this.menuItems.create({ restaurantId: bepNha.id, category: 'Cơm phần', name: 'Cơm sườn bì chả', description: 'Sườn nướng mật ong, bì, chả trứng, mỡ hành và nước mắm kẹo.', price: '69000.00', imageUrl: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a' }),
      this.menuItems.create({ restaurantId: bepNha.id, category: 'Ăn vặt', name: 'Gỏi cuốn tôm thịt', description: 'Ba cuốn gỏi cuốn kèm rau thơm và sốt tương đậu phộng.', price: '45000.00', imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43' }),
      this.menuItems.create({ restaurantId: bepNha.id, category: 'Đồ uống', name: 'Trà đào cam sả', description: 'Trà đào ủ lạnh, cam vàng, sả cây và đào miếng.', price: '35000.00', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc' }),
      this.menuItems.create({ restaurantId: anNhien.id, category: 'Món nước', name: 'Bún bò Huế đặc biệt', description: 'Bắp bò, chả cua, giò heo, rau sống và sa tế Huế.', price: '75000.00', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624' }),
      this.menuItems.create({ restaurantId: anNhien.id, category: 'Món nước', name: 'Phở bò tái nạm', description: 'Nước dùng ninh 12 giờ, bò tái, nạm mềm và bánh phở tươi.', price: '70000.00', imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43' }),
      this.menuItems.create({ restaurantId: anNhien.id, category: 'Topping', name: 'Quẩy nóng', description: 'Hai thanh quẩy giòn ăn kèm phở hoặc bún.', price: '12000.00', imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae' }),
      this.menuItems.create({ restaurantId: healthy.id, category: 'Healthy', name: 'Salad ức gà áp chảo', description: 'Ức gà, xà lách romaine, bơ, cà chua bi và sốt mè rang.', price: '89000.00', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }),
      this.menuItems.create({ restaurantId: healthy.id, category: 'Healthy', name: 'Cơm gạo lứt cá hồi', description: 'Cá hồi áp chảo, gạo lứt, bông cải, trứng lòng đào và sốt teriyaki.', price: '119000.00', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' }),
      this.menuItems.create({ restaurantId: healthy.id, category: 'Đồ uống', name: 'Nước ép táo cần tây', description: 'Táo xanh, cần tây, chanh vàng ép lạnh không thêm đường.', price: '49000.00', imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8' }),
    ]);

    const byName = new Map(menuItems.map(item => [item.name, item]));
    const createItem = (name: string, quantity: number) => {
      const menuItem = byName.get(name)!;
      return Object.assign(new OrderItem(), { menuItemId: menuItem.id, quantity, unitPrice: Number(menuItem.price).toFixed(2) });
    };
    const sum = (items: OrderItem[]) => items.reduce((total, item) => total + Number(item.unitPrice) * item.quantity, 0).toFixed(2);
    const paidAt = new Date('2026-05-18T03:20:00.000Z');

    const completedItems = [createItem('Cơm gà xối mỡ', 2), createItem('Trà đào cam sả', 2)];
    const confirmedItems = [createItem('Bún bò Huế đặc biệt', 1), createItem('Quẩy nóng', 1)];
    const preparingItems = [createItem('Salad ức gà áp chảo', 1), createItem('Nước ép táo cần tây', 1)];

    await this.orders.save([
      this.orders.create({ customer, customerId: customer.id, restaurant: bepNha, restaurantId: bepNha.id, status: OrderStatus.COMPLETED, totalAmount: sum(completedItems), deliveryAddress: customer.address!, customerPhone: customer.phone!, note: 'Giao giờ nghỉ trưa, gọi trước 5 phút.', paymentMethod: PaymentMethod.MOMO, paymentStatus: PaymentStatus.PAID, paidAt, paymentTransactionId: 'MOMO-20260518-0001', items: completedItems }),
      this.orders.create({ customer, customerId: customer.id, restaurant: anNhien, restaurantId: anNhien.id, status: OrderStatus.CONFIRMED, totalAmount: sum(confirmedItems), deliveryAddress: 'Tầng 6, 39 Lê Duẩn, Quận 1, TP.HCM', customerPhone: customer.phone, note: 'Ít cay, thêm rau sống.', paymentMethod: PaymentMethod.VNPAY, paymentStatus: PaymentStatus.PAID, paidAt: new Date('2026-05-18T04:05:00.000Z'), paymentTransactionId: 'VNPAY-20260518-0002', items: confirmedItems }),
      this.orders.create({ customer: customerTwo, customerId: customerTwo.id, restaurant: healthy, restaurantId: healthy.id, status: OrderStatus.PREPARING, totalAmount: sum(preparingItems), deliveryAddress: customerTwo.address!, customerPhone: customerTwo.phone!, note: 'Không lấy ống hút nhựa.', paymentMethod: PaymentMethod.CARD, paymentStatus: PaymentStatus.PAID, paidAt: new Date('2026-05-18T04:30:00.000Z'), paymentTransactionId: 'CARD-20260518-0003', items: preparingItems }),
    ]);
  }
}
