import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './styles.css';
const api = axios.create({ baseURL: 'http://localhost:3000' });
function App() {
  const [loading, setLoading] = useState(false); const [msg, setMsg] = useState('');
  const [voucher, setVoucher] = useState('');
  const [items, setItems] = useState([{ product_id: 1, quantity: 1 }]);
  const checkout = async () => {
    setLoading(true); setMsg('');
    try { await api.post('/orders', { customer_name: 'Khách lẻ', voucher_code: voucher || undefined, items }, { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } }); setMsg('Thanh toán thành công'); }
    catch (e: any) { if (e?.response?.status === 409) setMsg('Sản phẩm/Voucher đã hết'); else setMsg('Lỗi hệ thống'); }
    finally { setLoading(false); }
  };
  return <div className='p-6 max-w-xl mx-auto'><h1 className='text-xl font-bold'>PoC Thủy Bùi</h1><input className='border p-2 my-2 w-full' placeholder='Mã voucher' value={voucher} onChange={(e)=>setVoucher(e.target.value)} />
  <button disabled={loading} onClick={checkout} className='bg-blue-600 text-white px-4 py-2 rounded'>{loading ? 'Đang xử lý...' : 'Thanh toán'}</button>
  <p>{msg}</p></div>;
}
createRoot(document.getElementById('root')!).render(<App />);
