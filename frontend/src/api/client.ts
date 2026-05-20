const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';
export type Restaurant = { id: string; name: string; description: string; address: string; imageUrl?: string; menuItems: MenuItem[] };
export type MenuItem = { id: string; name: string; description: string; category: string; price: string; imageUrl?: string; restaurantId: string };
export type CartItem = { menuItem: MenuItem; quantity: number };
export type Order = { id: string; status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED'; totalAmount: string; createdAt: string };
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
export const api = {
  login: (email: string, password: string) => request<{ accessToken: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  restaurants: (search = '') => request<Restaurant[]>(`/restaurants${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  createRestaurant: (payload: { name: string; description: string; address: string; imageUrl?: string }) => request<Restaurant>('/restaurants', { method: 'POST', body: JSON.stringify(payload) }),
  updateRestaurant: (id: string, payload: { name: string; description: string; address: string; imageUrl?: string }) => request<Restaurant>(`/restaurants/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteRestaurant: (id: string) => request(`/restaurants/${id}`, { method: 'DELETE' }),
  order: (payload: { restaurantId: string; deliveryAddress: string; customerPhone?: string; note?: string; paymentMethod?: 'COD' | 'MOMO' | 'VNPAY' | 'BANK_TRANSFER' | 'CARD'; items: { menuItemId: string; quantity: number }[] }) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  myOrders: () => request<Order[]>('/orders/me'),
  allOrders: () => request<Order[]>('/orders'),
  updateOrderStatus: (id: string, status: Order['status']) => request<Order>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteOrder: (id: string) => request(`/orders/${id}`, { method: 'DELETE' }),
  createMenuItem: (payload: { name: string; description: string; category: string; price: string; restaurantId: string }) => request<MenuItem>('/menu-items', { method: 'POST', body: JSON.stringify(payload) }),
  updateMenuItem: (id: string, payload: { name: string; description: string; category: string; price: string }) => request<MenuItem>(`/menu-items/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteMenuItem: (id: string) => request(`/menu-items/${id}`, { method: 'DELETE' }),
};
