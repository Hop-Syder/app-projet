import { useEffect, useState, type FormEvent } from 'react';
import { deliveryZonesService } from '../../services/delivery-zones.service';
import { formatPrice } from '../../lib/format';
import { Button, Card, Input, Label } from '../../components/ui';
import type { DeliveryZone } from '../../types';

const emptyForm = { name: '', description: '', fee: 0, minOrder: 0, cities: '', districts: '' };

export function AdminDeliveryZonesPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function load() {
    deliveryZonesService.findAll(false).then(setZones);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    await deliveryZonesService.create({
      name: form.name,
      description: form.description,
      fee: form.fee,
      minOrder: form.minOrder,
      cities: form.cities.split(',').map((c) => c.trim()).filter(Boolean),
      districts: form.districts.split(',').map((c) => c.trim()).filter(Boolean),
    });
    setForm(emptyForm);
    setShowForm(false);
    load();
  }

  async function toggleActive(zone: DeliveryZone) {
    await deliveryZonesService.update(zone.id, { active: !zone.active });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette zone ?')) return;
    await deliveryZonesService.remove(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Zones de livraison</h1>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Annuler' : '+ Nouvelle zone'}</Button>
      </div>

      {showForm && (
        <Card className="mt-4 p-5">
          <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="zoneName">Nom</Label>
              <Input id="zoneName" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="fee">Frais de livraison</Label>
              <Input id="fee" type="number" required value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} />
            </div>
            <div>
              <Label htmlFor="minOrder">Commande minimum</Label>
              <Input id="minOrder" type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
            </div>
            <div>
              <Label htmlFor="zoneDescription">Description</Label>
              <Input id="zoneDescription" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cities">Villes (séparées par virgule)</Label>
              <Input id="cities" value={form.cities} onChange={(e) => setForm({ ...form, cities: e.target.value })} placeholder="Cotonou" />
            </div>
            <div>
              <Label htmlFor="districts">Quartiers (séparés par virgule)</Label>
              <Input id="districts" value={form.districts} onChange={(e) => setForm({ ...form, districts: e.target.value })} placeholder="Akpakpa, Fidjrossè" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Créer la zone</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {zones.map((zone) => (
          <Card key={zone.id} className="p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-text">{zone.name}</p>
              <button onClick={() => toggleActive(zone)} className={`text-xs font-semibold ${zone.active ? 'text-primary' : 'text-muted'}`}>
                {zone.active ? 'Active' : 'Désactivée'}
              </button>
            </div>
            <p className="mt-1 text-sm text-muted">{zone.description}</p>
            <p className="mt-2 text-sm text-text">
              Frais : {formatPrice(zone.fee)} · Minimum : {formatPrice(zone.minOrder)}
            </p>
            <p className="mt-1 text-xs text-muted">{zone.cities.join(', ')}</p>
            <button onClick={() => handleDelete(zone.id)} className="mt-3 text-sm font-medium text-danger">
              Supprimer
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
