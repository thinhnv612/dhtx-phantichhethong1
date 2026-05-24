import { Product } from '../types';

export const formatVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const getProductAvatar = (product: Product) => {
  const avatars = [
    { bg: 'bg-amber-100 text-amber-600', emoji: '🍿', color: '#f59e0b' },
    { bg: 'bg-orange-100 text-orange-600', emoji: '🍟', color: '#ea580c' },
    { bg: 'bg-yellow-100 text-yellow-600', emoji: '🧈', color: '#ca8a04' },
    { bg: 'bg-rose-100 text-rose-600', emoji: '🍧', color: '#e11d48' },
    { bg: 'bg-emerald-100 text-emerald-600', emoji: '🍪', color: '#059669' },
  ];
  return avatars[product.id % avatars.length];
};
