# Online Food Ordering System

Monorepo triển khai hệ thống bán đồ ăn online theo mô hình gồm PostgreSQL, NestJS backend, React frontend và Flutter mobile app.

## Kiến trúc

- `backend/`: REST API NestJS, TypeORM, PostgreSQL, JWT auth.
- `frontend/`: React + Vite cho khách hàng đặt món trên web.
- `mobile/`: Flutter app cho trải nghiệm mobile.
- `docker-compose.yml`: Chỉ chạy PostgreSQL và pgAdmin để quản lý DB; Backend, Frontend và Mobile chạy local.

## Chức năng chính

- Đăng ký / đăng nhập người dùng.
- Quản lý nhà hàng và món ăn theo danh mục.
- Tìm kiếm nhà hàng, xem menu.
- Tạo đơn hàng nhiều món.
- Mock xác nhận thanh toán thành công cho đơn demo.
- Theo dõi trạng thái đơn hàng.

## Chạy Database và pgAdmin bằng Docker

```bash
cp .env.example .env
docker compose up -d
```

Dịch vụ Docker mặc định:

- PostgreSQL: `localhost:5432`
- pgAdmin: <http://localhost:5050>
- pgAdmin email: `admin@food.local`
- pgAdmin password: `Admin@123456`

Khi tạo server trong pgAdmin, dùng thông tin kết nối sau:

- Host name/address: `postgres`
- Port: `5432`
- Maintenance database: `food_ordering`
- Username: `food`
- Password: `food_password`

## Chạy Backend / Frontend / Mobile ở local

### Backend

Backend chạy local và kết nối PostgreSQL trong Docker qua `localhost:5432`.

```bash
cd backend
npm install
DATABASE_URL=postgresql://food:food_password@localhost:5432/food_ordering \
JWT_SECRET=change_me_in_production \
DB_SYNCHRONIZE=true \
npm run start:dev
```

API mặc định:

- REST API: <http://localhost:3000/api>
- Swagger: <http://localhost:3000/docs>

### Frontend

```bash
cd frontend
npm install
VITE_API_BASE_URL=http://localhost:3000/api npm run dev
```

Web mặc định: <http://localhost:5173>

### Mobile

```bash
cd mobile
flutter pub get
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api
```

## Tài khoản seed

Khi `DB_SYNCHRONIZE=true`, API sẽ tự tạo dữ liệu demo qua `SeedService`.

- Admin: `admin@food.local` / `Admin@123456`
- Chủ quán: `owner@food.local` / `Owner@123456`
- Customer: `customer@food.local` / `Customer@123456`
- Customer 2: `customer2@food.local` / `Customer@123456`

Dữ liệu demo bao phủ luồng thực tế từ danh mục món ăn đến đặt hàng và thanh toán:

- 3 nhà hàng mẫu: Bếp Nhà Online, Phở & Bún Huế An Nhiên, Healthy Box Saigon.
- 10 món ăn thuộc các danh mục `Cơm phần`, `Ăn vặt`, `Đồ uống`, `Món nước`, `Topping`, `Healthy`.
- 3 đơn hàng mẫu ở các trạng thái `COMPLETED`, `CONFIRMED`, `PREPARING`.
- Các đơn hàng đều có địa chỉ giao, số điện thoại, ghi chú, phương thức thanh toán và `paymentStatus=PAID` kèm mã giao dịch mock.

## Ghi chú SOLID / Clean Code

- Mỗi bounded context nằm trong một Nest module riêng.
- Controller chỉ điều phối HTTP; nghiệp vụ nằm trong service.
- DTO tách khỏi entity để tránh phụ thuộc tầng lưu trữ.
- Frontend tách `api`, `hooks`, `components`, `pages`.
- Flutter tách model, service, screen và widget.
