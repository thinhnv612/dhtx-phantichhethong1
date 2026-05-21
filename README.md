# Thuy Bui Snack Shop PoC

## 1) Yêu cầu môi trường
- Node.js 20+
- pnpm 10+
- Docker + Docker Compose

## 2) Chạy dự án trên localhost (thủ công)

### Bước 1: Cài dependencies
```bash
pnpm install
```

### Bước 2: Khởi động PostgreSQL + pgAdmin
```bash
docker compose up -d
```

- PostgreSQL:
  - Host: `localhost`
  - Port: `5432`
  - User: `admin`
  - Password: `admin123`
  - Database: `snackshop`
- pgAdmin: `http://localhost:5050`
  - Email: `admin@thuybui.local`
  - Password: `admin123`

### Bước 3: Seed dữ liệu mẫu
```bash
pnpm --filter backend seed
```

Tài khoản mẫu:
- admin / admin123
- staff / staff123

Voucher test concurrency:
- `GIAM10K` (giới hạn 1 lần dùng)

### Bước 4: Chạy backend + frontend cùng lúc
```bash
pnpm dev
```

Mặc định:
- Backend API: `http://localhost:3000`
- Frontend (Vite): xem URL hiển thị trong terminal (thường là `http://localhost:5173`)

## 3) Chạy từng app riêng (tuỳ chọn)

### Chỉ chạy backend
```bash
pnpm --filter backend dev
```

### Chỉ chạy frontend
```bash
pnpm --filter frontend dev
```

## 4) API chính
- `POST /auth/login`
- `POST /inventory/import`
- `POST /orders`

## 5) Dừng dịch vụ Docker
```bash
docker compose down
```
