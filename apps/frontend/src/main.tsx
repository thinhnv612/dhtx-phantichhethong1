import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './styles.css';

// -------------------------------------------------------------
// TYPES & HELPERS IMPORTS
// -------------------------------------------------------------
import { Product, Voucher, Order, SupportTicket, InventoryLog } from './types';
import { formatVND } from './utils/helpers';

// Shared Components
import { OfflineBanner } from './components/OfflineBanner';
import { ToastContainer, Toast } from './components/ToastContainer';

// Store Components
import { StoreHeader } from './components/store/StoreHeader';
import { StoreHome } from './components/store/StoreHome';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { CartDrawer } from './components/store/CartDrawer';
import { OrderTracker } from './components/store/OrderTracker';
import { SupportForm } from './components/store/SupportForm';

// Admin Components
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminVouchers } from './components/admin/AdminVouchers';
import { AdminStaff } from './components/admin/AdminStaff';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminSupport } from './components/admin/AdminSupport';
import { AdminModals } from './components/admin/AdminModals';

// -------------------------------------------------------------
// CONFIGURATION & AXIOS SETUP
// -------------------------------------------------------------
const API_URL = 'http://localhost:3000';
const api = axios.create({ baseURL: API_URL });

// Custom Web Audio API Synthesized Bell Chime ("Ting" sound)
const playChimeSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    
    // Low bell ring
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // Slide to A5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.8);

    // High crystal harmonic chime
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174.66, now + 0.1); // D6
    gain2.gain.setValueAtTime(0.08, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.9);
  } catch (err) {
    console.warn("Chime generation failed (waiting for user interaction):", err);
  }
};

// Local storage helpers for shopping cart
const getSavedCart = (): { product: Product; quantity: number }[] => {
  try {
    const saved = localStorage.getItem('thuybui_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (cart: { product: Product; quantity: number }[]) => {
  localStorage.setItem('thuybui_cart', JSON.stringify(cart));
};

const normalizeProductName = (name?: string) => name?.trim().toLowerCase() || '';

const reconcileCartWithProducts = (
  cart: { product: Product; quantity: number }[],
  latestProducts: Product[]
) => {
  const usedProductIds = new Set<number>();

  return cart.flatMap(item => {
    const product =
      latestProducts.find(p => p.id === item.product.id) ||
      latestProducts.find(p =>
        !usedProductIds.has(p.id) &&
        normalizeProductName(p.name) === normalizeProductName(item.product.name) &&
        p.type === item.product.type
      );

    if (!product || product.stock_quantity <= 0) return [];

    usedProductIds.add(product.id);
    return [{
      product,
      quantity: Math.min(item.quantity, product.stock_quantity),
    }];
  });
};

function App() {
  // Navigation State
  const [portal, setPortal] = useState<'store' | 'admin'>('store');
  const [storeTab, setStoreTab] = useState<'home' | 'track' | 'support'>('home');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'orders' | 'products' | 'vouchers' | 'staff' | 'inventory' | 'support'>(
    (localStorage.getItem('adminRole') || '') === 'STAFF' ? 'orders' : 'dashboard'
  );

  // Customer Portal States
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Cart State
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(getSavedCart());
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', address: '' });
  const [orderMessage, setOrderMessage] = useState('');
  const [createdOrderInfo, setCreatedOrderInfo] = useState<{ id: number; finalPrice: number } | null>(null);

  // Tracking State
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackError, setTrackError] = useState('');

  // Contact State
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Auth State
  const [adminToken, setAdminToken] = useState(localStorage.getItem('token') || '');
  const [adminUser, setAdminUser] = useState(localStorage.getItem('adminUser') || '');
  const [adminRole, setAdminRole] = useState(localStorage.getItem('adminRole') || '');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Admin Data States
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [adminVouchers, setAdminVouchers] = useState<Voucher[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminSupport, setAdminSupport] = useState<SupportTicket[]>([]);
  const [adminInventoryLogs, setAdminInventoryLogs] = useState<InventoryLog[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [adminOrdersFilter, setAdminOrdersFilter] = useState<string>('ALL');

  // Real-time Sound Alerts & Notifiers
  const [newOrderAlert, setNewOrderAlert] = useState<boolean>(false);
  const [alertCount, setAlertCount] = useState<number>(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Modals & CRUD Form States
  const [productCrudModal, setProductCrudModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data?: Partial<Product> }>({ open: false, mode: 'create' });
  const [voucherCrudModal, setVoucherCrudModal] = useState<{ open: boolean; data?: Partial<Voucher> }>({ open: false });
  const [staffCrudModal, setStaffCrudModal] = useState<{ open: boolean; data?: { username: string; password?: string; role: 'ADMIN' | 'STAFF' } }>({ open: false });
  const [importStockModal, setImportStockModal] = useState<{ open: boolean; product_id: number; quantity: number }>({ open: false, product_id: 0, quantity: 10 });
  const [replySupportModal, setReplySupportModal] = useState<{ open: boolean; ticket?: SupportTicket; text: string }>({ open: false, text: '' });

  // Sync Cart to Local Storage
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Monitor Network Connectivity & Sync Offline Orders
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Đã kết nối Internet trở lại!', 'success');
      syncOfflineOrders();
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Mất kết nối Internet. Đã chuyển sang chế độ ngoại tuyến.', 'warn');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      syncOfflineOrders();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Set up SSE connection on app load (Public/Admin stream)
  useEffect(() => {
    const sseSource = new EventSource(`${API_URL}/orders/sse`);
    
    sseSource.onmessage = (event) => {
      try {
        const newOrder = JSON.parse(event.data) as Order;
        console.log("Realtime SSE: New order arrived!", newOrder);
        
        // Trigger visual shake and auditory chime
        playChimeSound();
        setNewOrderAlert(true);
        setAlertCount(prev => prev + 1);
        
        // Push notification toast
        const newToast = {
          id: Date.now(),
          text: `🔔 Đơn hàng mới #${newOrder.id} vừa được đặt từ ${newOrder.customer_name.split('|')[0]} (${formatVND(newOrder.final_price)})!`,
          type: 'success' as const
        };
        setToasts(prev => [newToast, ...prev]);

        // Prepend to admin order list if currently loaded
        setAdminOrders(prev => [newOrder, ...prev]);

        // Automatically fetch fresh dashboard telemetry if admin token is present
        if (adminToken) {
          fetchDashboardStats();
        }
      } catch (err) {
        console.error("Error processing SSE message:", err);
      }
    };

    sseSource.onerror = (err) => {
      console.warn("SSE stream encountered connection failure. Retrying...", err);
    };

    return () => {
      sseSource.close();
    };
  }, [adminToken]);

  // Trigger loading admin panels when switched and authenticated
  useEffect(() => {
    if (portal === 'admin' && adminToken) {
      fetchAdminData();
    }
  }, [portal, adminToken, adminTab]);

  // Toast removal timer
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prev => prev.slice(0, -1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // -------------------------------------------------------------
  // API SERVICE CALLS
  // -------------------------------------------------------------
  const syncOfflineOrders = async () => {
    const offlineOrdersStr = localStorage.getItem('thuybui_offline_orders');
    if (!offlineOrdersStr) return;
    try {
      const offlineOrders = JSON.parse(offlineOrdersStr);
      if (offlineOrders.length === 0) return;

      showToast(`Đang đồng bộ ${offlineOrders.length} đơn hàng ngoại tuyến...`, 'info');
      let successCount = 0;
      for (const order of offlineOrders) {
        try {
          await api.post('/orders', order);
          successCount++;
        } catch (e) {
          console.error('Lỗi khi đồng bộ đơn offline:', e);
        }
      }
      localStorage.removeItem('thuybui_offline_orders');
      if (successCount > 0) {
        showToast(`Đồng bộ thành công ${successCount} đơn hàng lên máy chủ!`, 'success');
        fetchProducts();
      }
    } catch (err) {
      console.error('Lỗi phân tích đơn offline:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      const latestProducts = res.data as Product[];
      setProducts(latestProducts);
      setCart(prev => reconcileCartWithProducts(prev, latestProducts));
      localStorage.setItem('thuybui_cached_products', JSON.stringify(latestProducts));
    } catch (e) {
      const cached = localStorage.getItem('thuybui_cached_products');
      if (cached) {
        const cachedProducts = JSON.parse(cached) as Product[];
        setProducts(cachedProducts);
        setCart(prev => reconcileCartWithProducts(prev, cachedProducts));
        showToast('Hiển thị sản phẩm từ bộ nhớ tạm (Offline)', 'info');
      } else {
        showToast('Không thể tải danh sách sản phẩm', 'warn');
      }
    }
  };

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'info') => {
    setToasts(prev => [{ id: Date.now(), text, type }, ...prev]);
  };

  const validateVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError('Vui lòng nhập mã voucher');
      return;
    }
    const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    try {
      setVoucherError('');
      const res = await api.get(`/vouchers/validate/${voucherCode.trim()}?total=${cartSubtotal}`);
      setAppliedVoucher(res.data);
      showToast('Áp dụng mã giảm giá thành công!', 'success');
    } catch (err: any) {
      setAppliedVoucher(null);
      setVoucherError(err.response?.data?.message || 'Mã giảm giá không hợp lệ');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      showToast('Vui lòng nhập đầy đủ thông tin giao hàng', 'warn');
      return;
    }

    const itemsDto = cart.map(x => ({
      product_id: x.product.id,
      quantity: x.quantity
    }));

    // Pack Customer Info into customer_name
    const packedCustomerName = `${shippingInfo.name.trim()} | ${shippingInfo.phone.trim()} | ${shippingInfo.address.trim()}`;
    const payload = {
      customer_name: packedCustomerName,
      voucher_code: appliedVoucher?.code || undefined,
      items: itemsDto
    };

    if (!isOnline) {
      // Offline fallback handling
      const cached = localStorage.getItem('thuybui_cached_products');
      if (cached) {
        const cachedProducts = JSON.parse(cached);
        let stockOk = true;

        for (const item of itemsDto) {
          const matched = cachedProducts.find((p: any) => p.id === item.product_id);
          if (matched) {
            if (Number(matched.stock_quantity) < item.quantity) {
              stockOk = false;
              showToast(`Sản phẩm ${matched.name} không đủ tồn kho (Offline)`, 'warn');
              break;
            } else {
              matched.stock_quantity = Number(matched.stock_quantity) - item.quantity;
            }
          }
        }

        if (!stockOk) return;

        localStorage.setItem('thuybui_cached_products', JSON.stringify(cachedProducts));
        setProducts(cachedProducts);
      }

      // Add to offline queue
      const offlineOrdersStr = localStorage.getItem('thuybui_offline_orders');
      const offlineOrders = offlineOrdersStr ? JSON.parse(offlineOrdersStr) : [];
      offlineOrders.push(payload);
      localStorage.setItem('thuybui_offline_orders', JSON.stringify(offlineOrders));

      const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const discount = appliedVoucher ? Number(appliedVoucher.discount_amount) : 0;
      const finalPrice = Math.max(0, cartSubtotal - discount);

      setCreatedOrderInfo({
        id: Date.now() % 1000000,
        finalPrice: finalPrice
      });

      setCart([]);
      setAppliedVoucher(null);
      setVoucherCode('');
      setCheckoutStep('success');
      setCartOpen(false);
      showToast('Đơn hàng ngoại tuyến đã được lưu tạm trên thiết bị!', 'success');
      return;
    }

    try {
      setOrderMessage('');

      const res = await api.post('/orders', payload);
      const createdOrder = res.data;
      
      setCreatedOrderInfo({
        id: createdOrder.id,
        finalPrice: createdOrder.final_price
      });

      setCart([]);
      setAppliedVoucher(null);
      setVoucherCode('');
      setCheckoutStep('success');
      setCartOpen(false);
      showToast(`Đơn hàng #${createdOrder.id} đã được tạo!`, 'success');
      
      fetchProducts();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra tồn kho';
      setOrderMessage(errMsg);
      showToast(errMsg, 'warn');
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackOrderId.trim()) return;
    try {
      setTrackError('');
      setTrackedOrder(null);
      const res = await api.get(`/orders/track/${trackOrderId.trim()}`);
      setTrackedOrder(res.data);
    } catch (err: any) {
      setTrackError(err.response?.data?.message || 'Không tìm thấy mã đơn hàng');
      setTrackedOrder(null);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      showToast('Vui lòng nhập đầy đủ thông tin liên hệ', 'warn');
      return;
    }
    try {
      await api.post('/support', contactForm);
      setContactSuccess(true);
      setContactForm({ name: '', phone: '', message: '' });
      showToast('Tin nhắn hỗ trợ đã được gửi thành công!', 'success');
    } catch (err) {
      showToast('Gửi tin nhắn thất bại', 'warn');
    }
  };

  // -------------------------------------------------------------
  // ADMIN AUTHENTICATION
  // -------------------------------------------------------------
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) return;
    try {
      setLoginError('');
      const res = await api.post('/auth/login', loginForm);
      const token = res.data.access_token;
      
      // Decode JWT token loosely to extract username and role
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const parsedToken = JSON.parse(jsonPayload);
      
      localStorage.setItem('token', token);
      localStorage.setItem('adminUser', parsedToken.username);
      localStorage.setItem('adminRole', parsedToken.role);
      
      setAdminToken(token);
      setAdminUser(parsedToken.username);
      setAdminRole(parsedToken.role);
      setAdminTab(parsedToken.role === 'STAFF' ? 'orders' : 'dashboard');
      setLoginForm({ username: '', password: '' });
      showToast(`Chào mừng trở lại, ${parsedToken.username}!`, 'success');
    } catch (err: any) {
      setLoginError('Tên đăng nhập hoặc mật khẩu không chính xác');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminRole');
    setAdminToken('');
    setAdminUser('');
    setAdminRole('');
    setPortal('store');
    showToast('Đã đăng xuất tài khoản quản trị', 'info');
  };

  // -------------------------------------------------------------
  // ADMIN SERVICE LOADS
  // -------------------------------------------------------------
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${adminToken}` }
  });

  const fetchAdminData = async () => {
    if (!adminToken) return;
    if (adminRole === 'STAFF' && ['dashboard', 'products', 'vouchers', 'staff'].includes(adminTab)) {
      setAdminTab('orders');
      return;
    }
    try {
      if (adminTab === 'dashboard') {
        fetchDashboardStats();
      } else if (adminTab === 'orders') {
        const res = await api.get('/orders', getAuthHeader());
        setAdminOrders(res.data);
      } else if (adminTab === 'products') {
        const res = await api.get('/products');
        setAdminProducts(res.data);
      } else if (adminTab === 'vouchers') {
        const res = await api.get('/vouchers', getAuthHeader());
        setAdminVouchers(res.data);
      } else if (adminTab === 'staff') {
        const res = await api.get('/users', getAuthHeader());
        setAdminUsers(res.data);
      } else if (adminTab === 'inventory') {
        const resProd = await api.get('/products');
        setAdminProducts(resProd.data);
        const resLogs = await api.get('/inventory/transactions', getAuthHeader());
        setAdminInventoryLogs(resLogs.data);
      } else if (adminTab === 'support') {
        const res = await api.get('/support', getAuthHeader());
        setAdminSupport(res.data);
      }
    } catch (e: any) {
      if (e.response?.status === 401) {
        handleAdminLogout();
      } else {
        showToast('Lỗi tải dữ liệu quản trị', 'warn');
      }
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/analytics/dashboard', getAuthHeader());
      setDashboardStats(res.data);
    } catch (e) {
      console.error("Dashboard stats error:", e);
    }
  };

  // -------------------------------------------------------------
  // ADMIN ORDER TRANSLATIONS
  // -------------------------------------------------------------
  const changeOrderStatus = async (orderId: number, nextStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: nextStatus }, getAuthHeader());
      showToast(`Cập nhật đơn hàng #${orderId} sang trạng thái ${nextStatus}`, 'success');
      
      // Update in-place to avoid complete list refresh
      setAdminOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus as any } : o));
      
      if (adminTab === 'dashboard') {
        fetchDashboardStats();
      }
    } catch (err) {
      showToast('Thay đổi trạng thái thất bại', 'warn');
    }
  };

  // -------------------------------------------------------------
  // ADMIN CRUD OPERATIONS
  // -------------------------------------------------------------
  const getProductErrorMessage = (err: any) => {
    const message = err.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    return message || 'Lưu sản phẩm thất bại';
  };

  const buildProductPayload = (data: Partial<Product>) => {
    const type = data.type || 'READY_TO_EAT';
    return {
      name: data.name?.trim() || '',
      price: Number(data.price),
      stock_quantity: Number(data.stock_quantity),
      type,
      category: data.category?.trim() || (type === 'RAW_MATERIAL' ? 'Nguyên vật liệu' : 'Đồ ăn vặt'),
      image_url: data.image_url?.trim() || null,
    };
  };

  const saveProductCrud = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = productCrudModal.data;
    const payload = data ? buildProductPayload(data) : null;
    if (
      !payload?.name ||
      !Number.isFinite(payload.price) ||
      payload.price < 0 ||
      !Number.isInteger(payload.stock_quantity) ||
      payload.stock_quantity < 0
    ) {
      showToast('Vui lòng nhập đầy đủ thông tin', 'warn');
      return;
    }
    try {
      if (productCrudModal.mode === 'create') {
        await api.post('/products', payload, getAuthHeader());
        showToast(`Đã tạo sản phẩm ${payload.name}`, 'success');
      } else {
        if (!data?.id) {
          showToast('Không xác định được sản phẩm cần sửa', 'warn');
          return;
        }
        await api.put(`/products/${data.id}`, payload, getAuthHeader());
        showToast(`Đã cập nhật sản phẩm ${payload.name}`, 'success');
      }
      setProductCrudModal({ open: false, mode: 'create' });
      fetchAdminData();
      fetchProducts(); // Sync client view
    } catch (err: any) {
      showToast(getProductErrorMessage(err), 'warn');
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await api.delete(`/products/${id}`, getAuthHeader());
      showToast('Đã xóa sản phẩm', 'success');
      fetchAdminData();
      fetchProducts(); // Sync client view
    } catch {
      showToast('Xóa sản phẩm thất bại', 'warn');
    }
  };

  const saveVoucherCrud = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = voucherCrudModal.data;
    if (!data?.code || !data.discount_amount || !data.min_order_value || !data.usage_limit) {
      showToast('Vui lòng nhập đầy đủ thông tin voucher', 'warn');
      return;
    }
    try {
      await api.post('/vouchers', data, getAuthHeader());
      showToast(`Đã tạo voucher ${data.code}`, 'success');
      setVoucherCrudModal({ open: false });
      fetchAdminData();
    } catch {
      showToast('Lưu voucher thất bại', 'warn');
    }
  };

  const deleteVoucher = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
    try {
      await api.delete(`/vouchers/${id}`, getAuthHeader());
      showToast('Đã xóa voucher', 'success');
      fetchAdminData();
    } catch {
      showToast('Xóa voucher thất bại', 'warn');
    }
  };

  const saveStaffCrud = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = staffCrudModal.data;
    if (!data?.username || !data.password) {
      showToast('Vui lòng nhập tên tài khoản và mật khẩu', 'warn');
      return;
    }
    try {
      await api.post('/users', data, getAuthHeader());
      showToast(`Đã đăng ký nhân viên ${data.username}`, 'success');
      setStaffCrudModal({ open: false });
      fetchAdminData();
    } catch {
      showToast('Đăng ký tài khoản thất bại', 'warn');
    }
  };

  const deleteStaff = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản nhân viên này?')) return;
    try {
      await api.delete(`/users/${id}`, getAuthHeader());
      showToast('Đã xóa tài khoản nhân viên', 'success');
      fetchAdminData();
    } catch {
      showToast('Xóa nhân viên thất bại', 'warn');
    }
  };

  const handleStockImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (importStockModal.product_id === 0 || importStockModal.quantity <= 0) return;
    try {
      const payload = {
        items: [{
          product_id: importStockModal.product_id,
          quantity: importStockModal.quantity
        }]
      };
      await api.post('/inventory/import', payload, getAuthHeader());
      showToast('Nhập hàng thành công!', 'success');
      setImportStockModal({ open: false, product_id: 0, quantity: 10 });
      fetchAdminData();
      fetchProducts(); // Sync client view
    } catch {
      showToast('Nhập kho thất bại', 'warn');
    }
  };

  const handleSupportReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replySupportModal.ticket || !replySupportModal.text.trim()) return;
    try {
      await api.post(`/support/${replySupportModal.ticket.id}/reply`, { reply: replySupportModal.text.trim() }, getAuthHeader());
      showToast(`Đã gửi phản hồi cho khách hàng ${replySupportModal.ticket.customer_name}`, 'success');
      setReplySupportModal({ open: false, text: '' });
      fetchAdminData();
    } catch {
      showToast('Gửi phản hồi thất bại', 'warn');
    }
  };

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stock_quantity <= 0) {
      showToast('Sản phẩm đã hết hàng!', 'warn');
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          showToast(`Chỉ còn ${product.stock_quantity} sản phẩm trong kho!`, 'warn');
          return prev;
        }
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      showToast(`Đã thêm ${product.name} vào giỏ hàng`, 'success');
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (productId: number, change: number) => {
    setCart(prev => {
      const item = prev.find(x => x.product.id === productId);
      if (!item) return prev;
      
      const newQty = item.quantity + change;
      if (newQty <= 0) {
        return prev.filter(x => x.product.id !== productId);
      }
      
      if (change > 0 && newQty > item.product.stock_quantity) {
        showToast(`Không thể vượt quá tồn kho (${item.product.stock_quantity})`, 'warn');
        return prev;
      }
      
      return prev.map(x => x.product.id === productId ? { ...x, quantity: newQty } : x);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Offline Connectivity Status Warning Banner */}
      <OfflineBanner isOnline={isOnline} />
      
      {/* Global Navigation Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
      
      {/* -------------------------------------------------------------
          TOP BAR (GLOBAL NAVIGATION)
          ------------------------------------------------------------- */}
      <StoreHeader 
        portal={portal}
        setPortal={setPortal}
        storeTab={storeTab}
        setStoreTab={setStoreTab}
        cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartTrigger={() => { setCartOpen(true); setCheckoutStep('cart'); }}
        newOrderAlert={newOrderAlert}
        alertCount={alertCount}
        onAlertClick={() => { setNewOrderAlert(false); setAlertCount(0); setAdminTab('orders'); }}
        adminToken={adminToken}
        onAdminLogout={handleAdminLogout}
      />

      {/* -------------------------------------------------------------
          MAIN CONTENT ZONE
          ------------------------------------------------------------- */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Portal: CUSTOMER STOREFRONT */}
        {portal === 'store' && (
          <>
            {storeTab === 'home' && (
              <StoreHome 
                products={products}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                onAddToCart={addToCart}
                onSelectProduct={setSelectedProduct}
              />
            )}

            {storeTab === 'track' && (
              <OrderTracker 
                trackOrderId={trackOrderId}
                onTrackOrderIdChange={setTrackOrderId}
                trackedOrder={trackedOrder}
                trackError={trackError}
                onSubmit={handleTrackOrder}
              />
            )}

            {storeTab === 'support' && (
              <SupportForm 
                contactForm={contactForm}
                onContactFormChange={setContactForm}
                contactSuccess={contactSuccess}
                onContactSuccessChange={setContactSuccess}
                onSubmit={handleSupportSubmit}
              />
            )}
          </>
        )}

        {/* Portal: ADMINISTRATIVE DASHBOARD */}
        {portal === 'admin' && (
          <div className="animate-fade-in">
            {!adminToken ? (
              
              /* login view overlay card */
              <div className="max-w-md mx-auto space-y-6 py-6 sm:py-12">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-lg">
                    🛠️
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Khu Vực Quản Trị Hệ Thống</h1>
                  <p className="text-slate-500 text-sm font-medium">Đăng nhập tài khoản Admin hoặc Nhân viên để quản lý đơn hàng, xem thống kê realtime và cập nhật kho.</p>
                </div>

                <form onSubmit={handleAdminLogin} className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 space-y-5">
                  {loginError && (
                    <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-semibold text-center animate-shake">
                      🚨 {loginError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tên đăng nhập</label>
                    <input 
                      type="text"
                      placeholder="Nhập tên đăng nhập..."
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm font-medium transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Mật khẩu</label>
                    <input 
                      type="password"
                      placeholder="Nhập mật khẩu..."
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm font-medium transition-all"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl active:scale-95 shadow-lg shadow-slate-900/10 hover:shadow-xl transition-all">
                    Đăng nhập hệ thống
                  </button>
                  
                  <div className="text-center text-xs text-slate-400 font-semibold border-t border-slate-50 pt-4">
                    💡 Seed mặc định: <span className="text-slate-600">admin / admin123</span> hoặc <span className="text-slate-600">staff / staff123</span>
                  </div>
                </form>
              </div>
            ) : (
              
              /* grid panel layouts */
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Left vertical sidebar */}
                <AdminSidebar 
                  adminUser={adminUser}
                  adminRole={adminRole}
                  adminTab={adminTab}
                  onTabChange={setAdminTab}
                />

                {/* Right detailed tabs panel */}
                <div className="lg:col-span-3">
                  {adminTab === 'dashboard' && (
                    <AdminDashboard dashboardStats={dashboardStats} />
                  )}

                  {adminTab === 'orders' && (
                    <AdminOrders 
                      adminOrders={adminOrders}
                      adminOrdersFilter={adminOrdersFilter}
                      onAdminOrdersFilterChange={setAdminOrdersFilter}
                      onChangeOrderStatus={changeOrderStatus}
                    />
                  )}

                  {adminTab === 'products' && (
                    <AdminProducts 
                      adminProducts={adminProducts}
                      onOpenProductModal={(mode, data) => setProductCrudModal({ open: true, mode, data: data || {} })}
                      onDeleteProduct={deleteProduct}
                    />
                  )}

                  {adminTab === 'vouchers' && (
                    <AdminVouchers 
                      adminVouchers={adminVouchers}
                      onOpenVoucherModal={(data) => setVoucherCrudModal({ open: true, data: data || {} })}
                      onDeleteVoucher={deleteVoucher}
                    />
                  )}

                  {adminTab === 'staff' && (
                    <AdminStaff 
                      adminUsers={adminUsers}
                      onOpenStaffModal={(data) => setStaffCrudModal({ open: true, data: data || { username: '', role: 'STAFF' } })}
                      onDeleteStaff={deleteStaff}
                    />
                  )}

                  {adminTab === 'inventory' && (
                    <AdminInventory 
                      adminProducts={adminProducts}
                      adminInventoryLogs={adminInventoryLogs}
                      onOpenImportModal={() => {
                        const firstProdId = adminProducts[0]?.id || 0;
                        setImportStockModal({ open: true, product_id: firstProdId, quantity: 10 });
                      }}
                    />
                  )}

                  {adminTab === 'support' && (
                    <AdminSupport 
                      adminSupport={adminSupport}
                      onOpenReplyModal={(ticket) => setReplySupportModal({ open: true, ticket, text: '' })}
                    />
                  )}
                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* -------------------------------------------------------------
          MODALS LAYER
          ------------------------------------------------------------- */}

      {/* Selected Product Detail popup modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Shopping Cart Drawer panel panel */}
      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateCartQty={updateCartQty}
        checkoutStep={checkoutStep}
        onCheckoutStepChange={setCheckoutStep}
        voucherCode={voucherCode}
        onVoucherCodeChange={setVoucherCode}
        appliedVoucher={appliedVoucher}
        voucherError={voucherError}
        onValidateVoucher={validateVoucher}
        shippingInfo={shippingInfo}
        onShippingInfoChange={setShippingInfo}
        orderMessage={orderMessage}
        createdOrderInfo={createdOrderInfo}
        onSubmitCheckout={handleCheckoutSubmit}
        isOnline={isOnline}
      />

      {/* Modals layout CRUD operations */}
      <AdminModals 
        productCrudModal={productCrudModal}
        setProductCrudModal={setProductCrudModal}
        saveProductCrud={saveProductCrud}
        
        voucherCrudModal={voucherCrudModal}
        setVoucherCrudModal={setVoucherCrudModal}
        saveVoucherCrud={saveVoucherCrud}

        staffCrudModal={staffCrudModal}
        setStaffCrudModal={setStaffCrudModal}
        saveStaffCrud={saveStaffCrud}

        importStockModal={importStockModal}
        setImportStockModal={setImportStockModal}
        handleStockImport={handleStockImport}
        adminProducts={adminProducts}

        replySupportModal={replySupportModal}
        setReplySupportModal={setReplySupportModal}
        handleSupportReply={handleSupportReply}
      />

    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
