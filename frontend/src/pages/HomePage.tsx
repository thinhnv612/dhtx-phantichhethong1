import { useMemo, useState } from 'react';
import { api, CartItem, MenuItem, Restaurant } from '../api/client';
import { RestaurantCard } from '../components/RestaurantCard';
import { useRestaurants } from '../hooks/useRestaurants';

export function HomePage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState('01 Nguyen Hue, Ho Chi Minh City');
  const { restaurants, loading } = useRestaurants(search);
  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.menuItem.price) * item.quantity, 0), [cart]);
  const addToCart = (menuItem: MenuItem) => setCart(items => items.some(i => i.menuItem.id === menuItem.id) ? items.map(i => i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i) : [...items, { menuItem, quantity: 1 }]);
  const loginDemo = async () => { const result = await api.login('customer@food.local', 'Customer@123456'); localStorage.setItem('accessToken', result.accessToken); alert('Đã đăng nhập tài khoản demo'); };
  const checkout = async () => { if (!selected || !cart.length) return; await api.order({ restaurantId: selected.id, deliveryAddress: address, items: cart.map(i => ({ menuItemId: i.menuItem.id, quantity: i.quantity })) }); setCart([]); alert('Đặt hàng thành công'); };
  return <main><section className="hero"><h1>Hệ thống bán đồ ăn online</h1><p>Khám phá nhà hàng, chọn món và thanh toán đơn giản.</p><button onClick={loginDemo}>Đăng nhập demo</button></section><input className="search" placeholder="Tìm nhà hàng hoặc món ăn..." value={search} onChange={e => setSearch(e.target.value)} />{loading ? <p>Đang tải...</p> : <div className="grid">{restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} onSelect={setSelected} />)}</div>}{selected && <section className="panel"><h2>{selected.name}</h2><div className="menu">{selected.menuItems.map(item => <div className="menu-item" key={item.id}><div><strong>{item.name}</strong><p>{item.description}</p><b>{Number(item.price).toLocaleString('vi-VN')}đ</b></div><button onClick={() => addToCart(item)}>Thêm</button></div>)}</div><aside className="cart"><h3>Giỏ hàng</h3>{cart.map(item => <p key={item.menuItem.id}>{item.menuItem.name} x {item.quantity}</p>)}<input value={address} onChange={e => setAddress(e.target.value)} /><strong>Tổng: {total.toLocaleString('vi-VN')}đ</strong><button onClick={checkout}>Đặt hàng</button></aside></section>}</main>;
}
