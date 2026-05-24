export interface Product {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
  type: 'READY_TO_EAT' | 'RAW_MATERIAL';
  category: string;
  version: number;
  image_url?: string | null;
}

export interface Voucher {
  id: number;
  code: string;
  discount_amount: number;
  min_order_value: number;
  usage_limit: number;
  used_count: number;
}

export interface OrderDetail {
  id: number;
  product: Product;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  id: number;
  customer_name: string;
  total_price: number;
  discount_applied: number;
  final_price: number;
  status: 'PENDING' | 'PAID' | 'PREPARING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  voucher?: Voucher | null;
  created_at: string;
  details?: OrderDetail[];
}

export interface SupportTicket {
  id: number;
  customer_name: string;
  phone: string;
  message: string;
  reply?: string | null;
  status: 'PENDING' | 'REPLIED';
  created_at: string;
}

export interface InventoryLog {
  id: number;
  product: Product;
  transaction_type: 'IMPORT' | 'SALE' | 'ADJUSTMENT';
  quantity_change: number;
  created_at: string;
}
