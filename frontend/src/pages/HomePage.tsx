import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api, CartItem, MenuItem, Order, Restaurant } from '../api/client';
import { RestaurantCard } from '../components/RestaurantCard';
import { useRestaurants } from '../hooks/useRestaurants';

const emptyMenuForm = { name: '', category: '', price: '', description: '' };
const emptyRestaurantForm = { name: '', description: '', address: '', imageUrl: '' };
const orderStatuses: Order['status'][] = ['PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELLED'];

export function HomePage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [address, setAddress] = useState('01 Nguyễn Huệ, Quận 1, TP.HCM');
  const [phone, setPhone] = useState('0912345678');
  const [menuForm, setMenuForm] = useState(emptyMenuForm);
  const [restaurantForm, setRestaurantForm] = useState(emptyRestaurantForm);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingRestaurantId, setEditingRestaurantId] = useState<string | null>(null);
  const { restaurants, loading, refresh } = useRestaurants(search);
  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.menuItem.price) * item.quantity, 0), [cart]);
  const groupedMenu = useMemo(() => selected?.menuItems.reduce<Record<string, MenuItem[]>>((groups, item) => ({ ...groups, [item.category]: [...(groups[item.category] ?? []), item] }), {}) ?? {}, [selected]);

  const syncSelected = async (selectedId?: string) => {
    const freshRestaurants = await refresh();
    const id = selectedId ?? selected?.id;
    setSelected(id ? freshRestaurants.find(r => r.id === id) ?? null : null);
    return freshRestaurants;
  };

  const addToCart = (menuItem: MenuItem) => setCart(items => items.some(i => i.menuItem.id === menuItem.id) ? items.map(i => i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i) : [...items, { menuItem, quantity: 1 }]);
  const loginDemo = async () => { const result = await api.login('customer@food.local', 'Customer@123456'); localStorage.setItem('accessToken', result.accessToken); setIsAdminSession(false); alert('Đã đăng nhập customer demo'); setOrders(await api.myOrders()); };
  const loginAdminDemo = async () => { const result = await api.login('admin@food.local', 'Admin@123456'); localStorage.setItem('accessToken', result.accessToken); setIsAdminSession(true); alert('Đã đăng nhập admin demo'); setOrders(await api.allOrders()); };


  useEffect(() => {
    if (!isAdminSession) return;
    const timer = setInterval(() => { api.allOrders().then(setOrders).catch(() => undefined); }, 5000);
    return () => clearInterval(timer);
  }, [isAdminSession]);
  const checkout = async () => { if (!selected || !cart.length) return; await api.order({ restaurantId: selected.id, deliveryAddress: address, customerPhone: phone, paymentMethod: 'MOMO', note: 'Thanh toán demo tự động thành công.', items: cart.map(i => ({ menuItemId: i.menuItem.id, quantity: i.quantity })) }); setCart([]); setOrders(await api.myOrders()); alert('Đặt hàng thành công. Thanh toán MoMo đã được xác nhận!'); };

  const onSelectRestaurant = (restaurant: Restaurant) => { setSelected(restaurant); setEditingItemId(null); setMenuForm(emptyMenuForm); };

  const submitMenu = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    if (!menuForm.name || !menuForm.category || !menuForm.price) return alert('Vui lòng nhập đủ tên món, danh mục và giá.');
    if (editingItemId) await api.updateMenuItem(editingItemId, menuForm); else await api.createMenuItem({ ...menuForm, restaurantId: selected.id });
    await syncSelected(selected.id);
    setEditingItemId(null);
    setMenuForm(emptyMenuForm);
  };

  const submitRestaurant = async (event: FormEvent) => {
    event.preventDefault();
    if (!restaurantForm.name || !restaurantForm.address) return alert('Vui lòng nhập tên nhà hàng và địa chỉ.');
    if (editingRestaurantId) {
      await api.updateRestaurant(editingRestaurantId, restaurantForm);
      await syncSelected(editingRestaurantId);
    } else {
      const created = await api.createRestaurant(restaurantForm);
      await syncSelected(created.id);
    }
    setEditingRestaurantId(null);
    setRestaurantForm(emptyRestaurantForm);
  };

  const startEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurantId(restaurant.id);
    setRestaurantForm({ name: restaurant.name, description: restaurant.description, address: restaurant.address, imageUrl: restaurant.imageUrl ?? '' });
  };

  const deleteRestaurant = async (id: string) => {
    if (!confirm('Xóa nhà hàng này?')) return;
    await api.deleteRestaurant(id);
    await syncSelected();
  };

  const startEditMenu = (item: MenuItem) => { setEditingItemId(item.id); setMenuForm({ name: item.name, category: item.category, price: item.price, description: item.description }); };
  const deleteItem = async (id: string) => { if (!confirm('Xóa món này?')) return; await api.deleteMenuItem(id); await syncSelected(); };
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders(items => items.map(i => i.id === orderId ? { ...i, status } : i));
    await api.updateOrderStatus(orderId, status);
    setOrders(await api.allOrders());
  };

  return <main><section className="hero"><h1>Hệ thống bán đồ ăn online</h1><p>Khám phá nhà hàng, chọn món theo danh mục và thanh toán demo thành công.</p><div className="hero-actions"><button onClick={loginDemo}>Đăng nhập customer demo</button><button onClick={loginAdminDemo}>Đăng nhập admin demo</button></div></section><input className="search" placeholder="Tìm nhà hàng hoặc món ăn..." value={search} onChange={e => setSearch(e.target.value)} />{loading ? <p>Đang tải...</p> : <div className="grid">{restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} onSelect={onSelectRestaurant} />)}</div>}<section className="admin-box"><h3>Quản trị nhà hàng (Admin)</h3><form onSubmit={submitRestaurant}><input placeholder="Tên nhà hàng" value={restaurantForm.name} onChange={e => setRestaurantForm({ ...restaurantForm, name: e.target.value })} /><input placeholder="Địa chỉ" value={restaurantForm.address} onChange={e => setRestaurantForm({ ...restaurantForm, address: e.target.value })} /><input placeholder="Ảnh URL" value={restaurantForm.imageUrl} onChange={e => setRestaurantForm({ ...restaurantForm, imageUrl: e.target.value })} /><textarea placeholder="Mô tả" value={restaurantForm.description} onChange={e => setRestaurantForm({ ...restaurantForm, description: e.target.value })} /><div className="admin-actions"><button type="submit">{editingRestaurantId ? 'Cập nhật nhà hàng' : 'Thêm nhà hàng'}</button>{editingRestaurantId && <button type="button" onClick={() => { setEditingRestaurantId(null); setRestaurantForm(emptyRestaurantForm); }}>Hủy sửa</button>}</div></form><div className="admin-list">{restaurants.map(r => <div className="admin-list-item" key={r.id}><span>{r.name}</span><div><button onClick={() => startEditRestaurant(r)}>Sửa</button><button onClick={() => deleteRestaurant(r.id)}>Xóa</button></div></div>)}</div></section>{selected && <section className="panel"><h2>{selected.name}</h2><div className="menu-full">{Object.entries(groupedMenu).map(([category, items]) => <div className="category" key={category}><h3>{category}</h3>{items.map(item => <div className="menu-item" key={item.id}><div><strong>{item.name}</strong><p>{item.description}</p><b>{Number(item.price).toLocaleString('vi-VN')}đ</b></div><div className="menu-actions"><button onClick={() => addToCart(item)}>Thêm</button><button onClick={() => startEditMenu(item)}>Sửa</button><button onClick={() => deleteItem(item.id)}>Xóa</button></div></div>)}</div>)}</div><aside className="cart"><h3>Giỏ hàng</h3>{cart.map(item => <p key={item.menuItem.id}>{item.menuItem.name} x {item.quantity}</p>)}<label>Địa chỉ giao hàng</label><input value={address} onChange={e => setAddress(e.target.value)} /><label>Số điện thoại</label><input value={phone} onChange={e => setPhone(e.target.value)} /><p className="payment-success">Thanh toán demo: MoMo - xác nhận thành công</p><strong>Tổng: {total.toLocaleString('vi-VN')}đ</strong><button onClick={checkout}>Đặt hàng & xác nhận thanh toán</button></aside><section className="admin-box"><h3>Quản trị món ăn (Admin)</h3><form onSubmit={submitMenu}><input placeholder="Tên món" value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} /><input placeholder="Danh mục" value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} /><input placeholder="Giá" value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} /><textarea placeholder="Mô tả" value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} /><div className="admin-actions"><button type="submit">{editingItemId ? 'Cập nhật món' : 'Thêm món mới'}</button>{editingItemId && <button type="button" onClick={() => { setEditingItemId(null); setMenuForm(emptyMenuForm); }}>Hủy sửa</button>}</div></form></section></section>}<section className="admin-box"><h3>Quản trị trạng thái đơn (Admin)</h3>{orders.length === 0 ? <p>Chưa có đơn để quản trị.</p> : orders.map(order => <div className="admin-list-item" key={order.id}><span>{order.id.slice(0, 8)} - {Number(order.totalAmount).toLocaleString('vi-VN')}đ</span><div className="order-admin-actions"><select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as Order['status'])}>{orderStatuses.map(status => <option key={status} value={status}>{status}</option>)}</select><button onClick={() => api.deleteOrder(order.id).then(() => api.allOrders().then(setOrders))}>Xóa đơn</button></div></div>)}</section></main>;
}
