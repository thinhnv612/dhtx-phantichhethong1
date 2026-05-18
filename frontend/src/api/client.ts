const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';
export type Restaurant = { id: string; name: string; description: string; address: string; imageUrl?: string; menuItems: MenuItem[] };
export type MenuItem = { id: string; name: string; description: string; price: string; imageUrl?: string; restaurantId: string };
export type CartItem = { menuItem: MenuItem; quantity: number };
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
export const api = {
  login: (email: string, password: string) => request<{ accessToken: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  restaurants: (search = '') => request<Restaurant[]>(`/restaurants${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  order: (payload: { restaurantId: string; deliveryAddress: string; items: { menuItemId: string; quantity: number }[] }) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  myOrders: () => request('/orders/me'),
};
