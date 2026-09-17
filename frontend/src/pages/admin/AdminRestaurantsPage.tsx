import { useEffect, useState, type FormEvent } from 'react';
import { restaurantsService } from '../../services/restaurants.service';
import { useAuth } from '../../contexts/AuthContext';
import { Badge, Button, Card, Input, Label } from '../../components/ui';
import type { Restaurant } from '../../types';

const emptyForm = { name: '', address: '', phone: '', cuisineType: '' };

export function AdminRestaurantsPage() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function load() {
    restaurantsService.findAll().then(setRestaurants);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    await restaurantsService.create({ ...form, ownerId: user.id });
    setForm(emptyForm);
    setShowForm(false);
    load();
  }

  async function toggleActive(restaurant: Restaurant) {
    await restaurantsService.update(restaurant.id, { isActive: !restaurant.isActive });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Restaurants partenaires</h1>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Annuler' : '+ Nouveau restaurant'}</Button>
      </div>

      {showForm && (
        <Card className="mt-4 p-5">
          <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="restName">Nom</Label>
              <Input id="restName" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cuisineType">Type de cuisine</Label>
              <Input id="cuisineType" value={form.cuisineType} onChange={(e) => setForm({ ...form, cuisineType: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="restAddress">Adresse</Label>
              <Input id="restAddress" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="restPhone">Téléphone</Label>
              <Input id="restPhone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Créer le restaurant</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {restaurants.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-text">{r.name}</p>
              <button onClick={() => toggleActive(r)}>
                <Badge className={r.isActive ? 'bg-primary-soft text-primary-dark' : 'bg-gray-200 text-gray-700'}>
                  {r.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </button>
            </div>
            <p className="mt-1 text-sm text-muted">{r.address}</p>
            {r.cuisineType && <p className="mt-1 text-xs text-muted">{r.cuisineType}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
