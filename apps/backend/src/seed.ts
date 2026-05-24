import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { ProductType, UserRole, InventoryTransactionType, OrderStatus } from './entities/enums';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';
import { Voucher } from './entities/voucher.entity';
import { Support } from './entities/support.entity';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { InventoryTransaction } from './entities/inventory-transaction.entity';

const ds = new DataSource({ 
  type: 'postgres', 
  host: process.env.DB_HOST ?? 'localhost', 
  port: Number(process.env.DB_PORT ?? 5432), 
  username: process.env.DB_USER ?? 'admin', 
  password: process.env.DB_PASS ?? 'admin123', 
  database: process.env.DB_NAME ?? 'snackshop', 
  entities: [User, Product, Voucher, Support, Order, OrderDetail, InventoryTransaction], 
  synchronize: true 
});

const makeDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

(async () => {
  await ds.initialize();
  console.log("DB connected for seeding...");

  const userRepo = ds.getRepository(User);
  const productRepo = ds.getRepository(Product);
  const voucherRepo = ds.getRepository(Voucher);
  const orderRepo = ds.getRepository(Order);
  const orderDetailRepo = ds.getRepository(OrderDetail);
  const inventoryTransactionRepo = ds.getRepository(InventoryTransaction);
  const supportRepo = ds.getRepository(Support);

  // 1. Clean previous data safely in correct constraint dependency order
  console.log("Cleaning historical tables...");
  await ds.query('TRUNCATE TABLE order_details RESTART IDENTITY CASCADE');
  await ds.query('TRUNCATE TABLE inventory_transactions RESTART IDENTITY CASCADE');
  await ds.query('TRUNCATE TABLE orders RESTART IDENTITY CASCADE');
  await ds.query('TRUNCATE TABLE supports RESTART IDENTITY CASCADE');
  await ds.query('TRUNCATE TABLE vouchers RESTART IDENTITY CASCADE');
  await ds.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE');
  await ds.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  // 2. Seed Users with hashed passwords
  console.log("Seeding staff accounts...");
  const adminUser = await userRepo.save({ 
    username: 'admin', 
    password_hash: await bcrypt.hash('admin123', 10), 
    role: UserRole.ADMIN 
  });
  
  const staffUser = await userRepo.save({ 
    username: 'staff', 
    password_hash: await bcrypt.hash('staff123', 10), 
    role: UserRole.STAFF 
  });

  await userRepo.save([
    { username: 'nhanvien1', password_hash: await bcrypt.hash('staff123', 10), role: UserRole.STAFF },
    { username: 'nhanvien2', password_hash: await bcrypt.hash('staff123', 10), role: UserRole.STAFF },
  ]);

  // 3. Seed Products
  console.log("Seeding products...");
  const products = await productRepo.save([
    // Đồ chế biến sẵn
    { 
      name: 'Khoai Tây Chiên Lắc Phô Mai', 
      price: 30000, 
      stock_quantity: 25, 
      type: ProductType.READY_TO_EAT, 
      category: 'Đồ chế biến sẵn',
      image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Chân Gà Tứ Xuyên Rút Xương', 
      price: 40000, 
      stock_quantity: 18, 
      type: ProductType.READY_TO_EAT, 
      category: 'Đồ chế biến sẵn',
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Nem Chua Rán Hà Nội', 
      price: 35000, 
      stock_quantity: 30, 
      type: ProductType.READY_TO_EAT, 
      category: 'Đồ chế biến sẵn',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60' 
    },
    
    // Đồ ăn vặt
    { 
      name: 'Bắp Rang Bơ Caramen', 
      price: 25000, 
      stock_quantity: 30, 
      type: ProductType.READY_TO_EAT, 
      category: 'Đồ ăn vặt',
      image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Cơm Cháy Chà Bông Siêu Cay', 
      price: 35000, 
      stock_quantity: 15, 
      type: ProductType.READY_TO_EAT, 
      category: 'Đồ ăn vặt',
      image_url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Khô Gà Lá Chanh Xé Cay', 
      price: 45000, 
      stock_quantity: 2, 
      type: ProductType.READY_TO_EAT, 
      category: 'Đồ ăn vặt',
      image_url: 'https://images.unsplash.com/photo-1547058886-af77992d478c?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Bánh Tráng Trộn Thập Cẩm', 
      price: 20000, 
      stock_quantity: 40, 
      type: ProductType.READY_TO_EAT, 
      category: 'Đồ ăn vặt',
      image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Rong Biển Cháy Tỏi', 
      price: 18000, 
      stock_quantity: 0, 
      type: ProductType.READY_TO_EAT, 
      category: 'Đồ ăn vặt',
      image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60' 
    },
    
    // Các loại bánh
    { 
      name: 'Bánh Mochi Dâu Tây Nhật Bản', 
      price: 35000, 
      stock_quantity: 25, 
      type: ProductType.READY_TO_EAT, 
      category: 'Các loại bánh',
      image_url: 'https://images.unsplash.com/photo-1532499016263-f2c3e89edf7f?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Bánh Bông Lan Trứng Muối', 
      price: 45000, 
      stock_quantity: 12, 
      type: ProductType.READY_TO_EAT, 
      category: 'Các loại bánh',
      image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60' 
    },
    
    // Ngũ cốc & mứt
    { 
      name: 'Thanh Gạo Lứt Chà Bông', 
      price: 28000, 
      stock_quantity: 50, 
      type: ProductType.READY_TO_EAT, 
      category: 'Ngũ cốc & mứt',
      image_url: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Bánh Thuyền Mix Hạt Dinh Dưỡng', 
      price: 32000, 
      stock_quantity: 40, 
      type: ProductType.READY_TO_EAT, 
      category: 'Ngũ cốc & mứt',
      image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60' 
    },
    
    // Sữa
    { 
      name: 'Sữa Chua Sấy Lạnh Vị Dâu', 
      price: 25000, 
      stock_quantity: 35, 
      type: ProductType.READY_TO_EAT, 
      category: 'Sữa',
      image_url: 'https://images.unsplash.com/photo-1571244856353-fb085b6652c4?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Túi Sữa Chua Yogurt Hy Lạp', 
      price: 15000, 
      stock_quantity: 60, 
      type: ProductType.READY_TO_EAT, 
      category: 'Sữa',
      image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60' 
    },
    
    // Nguyên vật liệu
    { 
      name: 'Hạt Ngô Làm Bắp Rang', 
      price: 10000, 
      stock_quantity: 150, 
      type: ProductType.RAW_MATERIAL, 
      category: 'Nguyên vật liệu',
      image_url: 'https://images.unsplash.com/photo-1551754625-702377370d62?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Bơ Lạt Động Vật Anchor', 
      price: 45000, 
      stock_quantity: 80, 
      type: ProductType.RAW_MATERIAL, 
      category: 'Nguyên vật liệu',
      image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Đậu Phộng Rang Tỏi Ớt', 
      price: 12000, 
      stock_quantity: 60, 
      type: ProductType.RAW_MATERIAL, 
      category: 'Nguyên vật liệu',
      image_url: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      name: 'Bột Phô Mai Cam Nguyên Chất', 
      price: 65000, 
      stock_quantity: 120, 
      type: ProductType.RAW_MATERIAL, 
      category: 'Nguyên vật liệu',
      image_url: 'https://images.unsplash.com/photo-1552763405-17497573d4aa?w=500&auto=format&fit=crop&q=60' 
    },
  ]);

  const getProduct = (name: string) => products.find(p => p.name === name)!;

  // 4. Seed initial import inventory transaction logs for all products
  console.log("Seeding warehouse inventory logs...");
  for (const p of products) {
    await inventoryTransactionRepo.save({
      product: p,
      transaction_type: InventoryTransactionType.IMPORT,
      quantity_change: p.stock_quantity + 10,
      created_by: adminUser,
      created_at: makeDate(7) // 7 days ago
    });
  }

  // 5. Seed Vouchers
  console.log("Seeding active discount vouchers...");
  const vouchers = await voucherRepo.save([
    { code: 'GIAM10K', discount_amount: 10000, min_order_value: 50000, usage_limit: 10, used_count: 2 },
    { code: 'ANVAT50K', discount_amount: 50000, min_order_value: 250000, usage_limit: 5, used_count: 1 },
    { code: 'FREESHIP', discount_amount: 15000, min_order_value: 30000, usage_limit: 50, used_count: 8 },
  ]);

  const getVoucher = (code: string) => vouchers.find(v => v.code === code)!;

  // 6. Seed Orders helper with nested relationships
  const createSeededOrder = async (
    daysAgo: number,
    customerName: string,
    items: { productName: string; quantity: number }[],
    status: OrderStatus,
    voucherCode?: string
  ) => {
    let subtotal = 0;
    const resolvedItems = items.map(x => {
      const p = getProduct(x.productName);
      subtotal += p.price * x.quantity;
      return { product: p, quantity: x.quantity };
    });

    let discount = 0;
    let appliedVoucher: Voucher | null = null;
    if (voucherCode) {
      appliedVoucher = getVoucher(voucherCode);
      discount = Number(appliedVoucher.discount_amount);
    }

    const finalPrice = Math.max(0, subtotal - discount);
    const orderDate = makeDate(daysAgo);

    const order = await orderRepo.save({
      customer_name: customerName,
      total_price: subtotal,
      discount_applied: discount,
      final_price: finalPrice,
      status,
      voucher: appliedVoucher,
      created_at: orderDate
    });

    for (const item of resolvedItems) {
      await orderDetailRepo.save({
        order,
        product: item.product,
        quantity: item.quantity,
        price_at_purchase: item.product.price
      });

      // Add a SALE transaction for non-cancelled orders
      if (status !== OrderStatus.CANCELLED) {
        await inventoryTransactionRepo.save({
          product: item.product,
          transaction_type: InventoryTransactionType.SALE,
          quantity_change: -item.quantity,
          created_at: orderDate
        });
      }
    }
  };

  console.log("Seeding backdated orders for dashboard telemetry...");
  // Completed order 5 days ago (using GIAM10K voucher)
  await createSeededOrder(5, "Phạm Minh Trí | 0912111222 | 45 Lê Lợi, Quận 1, TP HCM", [
    { productName: 'Khoai Tây Chiên Lắc Phô Mai', quantity: 3 }
  ], OrderStatus.COMPLETED, 'GIAM10K');

  // Completed order 4 days ago
  await createSeededOrder(4, "Lê Thị Thảo | 0988222333 | 78 Nguyễn Du, Hà Nội", [
    { productName: 'Bắp Rang Bơ Caramen', quantity: 5 }
  ], OrderStatus.COMPLETED);

  // Completed large order 3 days ago (using ANVAT50K voucher)
  await createSeededOrder(3, "Trần Đức Huy | 0905444555 | 102 Trần Hưng Đạo, Đà Nẵng", [
    { productName: 'Cơm Cháy Chà Bông Siêu Cay', quantity: 5 },
    { productName: 'Khô Gà Lá Chanh Xé Cay', quantity: 2 }
  ], OrderStatus.COMPLETED, 'ANVAT50K');

  // Shipping order from yesterday
  await createSeededOrder(1, "Nguyễn Thị Hoa | 0977666777 | 12 Chùa Bộc, Đống Đa, Hà Nội", [
    { productName: 'Khoai Tây Chiên Lắc Phô Mai', quantity: 1 },
    { productName: 'Bánh Tráng Trộn Thập Cẩm', quantity: 1 }
  ], OrderStatus.SHIPPING);

  // Pending new order from today (for real-time live monitor screen)
  await createSeededOrder(0, "Đỗ Hoàng Nam | 0966888999 | 56 Tây Sơn, Đống Đa, Hà Nội", [
    { productName: 'Bắp Rang Bơ Caramen', quantity: 3 }
  ], OrderStatus.PENDING);

  // Cancelled order (shows in telemetry exclusions and logs)
  await createSeededOrder(2, "Vũ Hoàng Hải | 0944333222 | 89 Láng Hạ, Hà Nội", [
    { productName: 'Khô Gà Lá Chanh Xé Cay', quantity: 1 },
    { productName: 'Đậu Phộng Rang Tỏi Ớt', quantity: 1 }
  ], OrderStatus.CANCELLED);

  // 7. Seed Support Tickets
  console.log("Seeding customer support tickets...");
  await supportRepo.save([
    {
      customer_name: 'Trần Mai Anh',
      phone: '0933999888',
      message: 'Shop cho mình hỏi có ship qua khu vực Cầu Giấy tối nay được không ạ?',
      status: 'PENDING',
      created_at: makeDate(0)
    },
    {
      customer_name: 'Nguyễn Minh Quân',
      phone: '0988777666',
      message: 'Sản phẩm bột phô mai cam hạn sử dụng còn lâu không shop ơi?',
      reply: 'Dạ chào bạn, bột phô mai bên mình luôn nhập lô mới nhất, hạn sử dụng còn hơn 10 tháng nên bạn hoàn toàn yên tâm nhé ạ!',
      status: 'REPLIED',
      created_at: makeDate(2)
    }
  ]);

  console.log("Database seeded successfully with beautiful dynamic mock data!");
  await ds.destroy();
})();
