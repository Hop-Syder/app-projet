import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '../services/restaurant.service';
import type { Restaurant } from '../types';

export function useRestaurants() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantService.getAll(),
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantService.getById(id),
    enabled: !!id,
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Restaurant>) => restaurantService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Restaurant> }) =>
      restaurantService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}
