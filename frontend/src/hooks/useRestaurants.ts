import { useEffect, useState } from 'react';
import { api, Restaurant } from '../api/client';
export function useRestaurants(search: string) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); api.restaurants(search).then(setRestaurants).finally(() => setLoading(false)); }, [search]);
  return { restaurants, loading };
}
