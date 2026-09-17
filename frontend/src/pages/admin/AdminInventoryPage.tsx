import { useEffect, useState, type FormEvent } from 'react';
import { inventoryService } from '../../services/inventory.service';
import { productsService } from '../../services/products.service';
import { formatDate } from '../../lib/format';
import { Badge, Button, Card, EmptyState, Input, Label, PageLoader, Select } from '../../components/ui';
import type { InventoryItem, Product } from '../../types';

const STATUS_BADGE: Record<string, string> = {
  AVAILABLE: 'bg-primary-soft text-primary-dark',
  RESERVED: 'bg-amber-100 text-amber-800',
  SOLD: 'bg-gray-200 text-gray-700',
  EXPIRED: 'bg-danger-soft text-danger',
  LOST: 'bg-danger-soft text-danger',
  ADJUSTED: 'bg-blue-100 text-blue-800',
};

export function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[] | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    productId: '',
    lotNumber: '',
    quantity: 0,
    unit: 'kg',
    arrivalDate: new Date().toISOString().slice(0, 10),
    expirationDate: '',
  });

  function load() {
    inventoryService.findAll().then(setItems);
  }

  useEffect(() => {
    load();
    productsService.findAll().then(setProducts);
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    await inventoryService.create({
      ...form,
      initialQuantity: form.quantity,
      arrivalDate: new Date(form.arrivalDate).toISOString() as any,
      expirationDate: form.expirationDate ? (new Date(form.expirationDate).toISOString() as any) : undefined,
    });
    setShowForm(false);
    setForm({ productId: '', lotNumber: '', quantity: 0, unit: 'kg', arrivalDate: new Date().toISOString().slice(0, 10), expirationDate: '' });
    load();
  }

  async function markExpired(id: string) {
    await inventoryService.update(id, { status: 'EXPIRED' });
    load();
  }

  if (!items) {
    return <PageLoader />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Stock &amp; lots</h1>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Annuler' : '+ Nouveau lot'}</Button>
      </div>

      {showForm && (
        <Card className="mt-4 p-5">
          <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="invProduct">Produit</Label>
              <Select id="invProduct" required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
                <option value="">Sélectionner…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="lotNumber">N° de lot</Label>
              <Input id="lotNumber" required value={form.lotNumber} onChange={(e) => setForm({ ...form, lotNumber: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="quantity">Quantité</Label>
              <Input id="quantity" type="number" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <Label htmlFor="unit">Unité</Label>
              <Input id="unit" required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="arrivalDate">Date d'arrivée</Label>
              <Input id="arrivalDate" type="date" required value={form.arrivalDate} onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="expirationDate">Date de péremption (optionnel)</Label>
              <Input id="expirationDate" type="date" value={form.expirationDate} onChange={(e) => setForm({ ...form, expirationDate: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Créer le lot</Button>
            </div>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Aucun lot en stock" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted">
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Lot</th>
                <th className="px-4 py-3">Quantité</th>
                <th className="px-4 py-3">Péremption</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text">{item.product?.name}</td>
                  <td className="px-4 py-3 text-muted">{item.lotNumber}</td>
                  <td className="px-4 py-3">
                    {item.quantity - item.reserved} / {item.quantity} {item.unit}
                  </td>
                  <td className="px-4 py-3 text-muted">{item.expirationDate ? formatDate(item.expirationDate) : '—'}</td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_BADGE[item.status]}>{item.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.status === 'AVAILABLE' && (
                      <button onClick={() => markExpired(item.id)} className="text-sm font-medium text-danger">
                        Marquer expiré
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
