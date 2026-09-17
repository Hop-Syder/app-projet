import { useEffect, useState } from 'react';
import { restaurantsService } from '../services/restaurants.service';
import { EmptyState, PageLoader } from '../components/ui';
import type { Restaurant } from '../types';

export function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

  useEffect(() => {
    restaurantsService.findAll({ isActive: true }).then(setRestaurants).catch(() => setRestaurants([]));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-text">Restaurants partenaires</h1>
      <p className="mt-1 text-sm text-muted">Commandez sur place, à emporter ou en livraison.</p>

      {restaurants === null ? (
        <PageLoader />
      ) : restaurants.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Aucun restaurant partenaire pour le moment" />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {restaurants.map((r) => (
            <div key={r.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="flex h-32 items-center justify-center bg-primary-soft text-4xl">🍽️</div>
              <div className="p-4">
                <p className="font-semibold text-text">{r.name}</p>
                <p className="text-sm text-muted">{r.address}</p>
                {r.cuisineType && <p className="mt-1 text-xs text-muted">{r.cuisineType}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
