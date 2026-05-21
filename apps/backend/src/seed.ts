import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { ProductType, UserRole } from './entities/enums';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';
import { Voucher } from './entities/voucher.entity';
const ds = new DataSource({ type:'postgres', host: process.env.DB_HOST ?? 'localhost', port:Number(process.env.DB_PORT ?? 5432), username:process.env.DB_USER ?? 'admin', password:process.env.DB_PASS ?? 'admin123', database:process.env.DB_NAME ?? 'snackshop', entities:[User,Product,Voucher], synchronize:true });
(async () => {
  await ds.initialize();
  const userRepo = ds.getRepository(User);
  const productRepo = ds.getRepository(Product);
  const voucherRepo = ds.getRepository(Voucher);
  await userRepo.upsert([
    { username: 'admin', password_hash: await bcrypt.hash('admin123', 10), role: UserRole.ADMIN },
    { username: 'staff', password_hash: await bcrypt.hash('staff123', 10), role: UserRole.STAFF },
  ], ['username']);
  await productRepo.save([
    { name: 'Khoai Tây Chiên', price: 30000, stock_quantity: 20, type: ProductType.READY_TO_EAT },
    { name: 'Bắp Rang Bơ', price: 25000, stock_quantity: 20, type: ProductType.READY_TO_EAT },
    { name: 'Đậu Phộng', price: 10000, stock_quantity: 100, type: ProductType.RAW_MATERIAL },
  ]);
  await voucherRepo.upsert([{ code: 'GIAM10K', discount_amount: 10000, min_order_value: 50000, usage_limit: 1, used_count: 0 }], ['code']);
  await ds.destroy();
})();
