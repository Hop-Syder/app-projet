import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addressesService } from '../services/addresses.service';
import { Button, Card, Input, Label } from '../components/ui';
import type { Address } from '../types';

export function AccountPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ street: '', city: '', department: 'Littoral', phone: '' });

  function loadAddresses() {
    addressesService.findAll().then(setAddresses);
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    await addressesService.create(form);
    setForm({ street: '', city: '', department: 'Littoral', phone: '' });
    setShowForm(false);
    loadAddresses();
  }

  async function handleRemove(id: string) {
    await addressesService.remove(id);
    loadAddresses();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-text">Mon compte</h1>

      <Card className="mt-6 p-5">
        <h2 className="font-semibold text-text">Informations</h2>
        <p className="mt-2 text-sm text-muted">
          {user?.firstName} {user?.lastName} · {user?.email}
          {user?.phone && ` · ${user.phone}`}
        </p>
      </Card>

      <Card className="mt-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text">Adresses enregistrées</h2>
          <button onClick={() => setShowForm((v) => !v)} className="text-sm font-semibold text-primary">
            {showForm ? 'Annuler' : '+ Ajouter'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="mt-3 grid gap-3">
            <div>
              <Label htmlFor="street">Rue / quartier</Label>
              <Input id="street" required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input id="city" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="department">Département</Label>
                <Input id="department" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <Button type="submit" className="w-fit">
              Enregistrer
            </Button>
          </form>
        )}

        <div className="mt-3 flex flex-col gap-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <span>
                {addr.street}, {addr.city}, {addr.department} · {addr.phone}
              </span>
              <button onClick={() => handleRemove(addr.id)} className="text-danger hover:underline">
                Supprimer
              </button>
            </div>
          ))}
          {addresses.length === 0 && !showForm && <p className="text-sm text-muted">Aucune adresse enregistrée.</p>}
        </div>
      </Card>
    </div>
  );
}
