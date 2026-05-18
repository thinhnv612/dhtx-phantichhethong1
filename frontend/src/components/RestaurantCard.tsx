import { Restaurant } from '../api/client';
export function RestaurantCard({ restaurant, onSelect }: { restaurant: Restaurant; onSelect: (restaurant: Restaurant) => void }) {
  return <article className="card" onClick={() => onSelect(restaurant)}><img src={restaurant.imageUrl ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'} /><h3>{restaurant.name}</h3><p>{restaurant.description}</p><small>{restaurant.address}</small></article>;
}
