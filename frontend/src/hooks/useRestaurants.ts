import { useEffect, useState } from 'react';
import { api, Restaurant } from '../api/client';

export function useRestaurants(search: string) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const data = await api.restaurants(search);
    setRestaurants(data);
    return data;
  };

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [search]);

  return { restaurants, loading, refresh };
}
