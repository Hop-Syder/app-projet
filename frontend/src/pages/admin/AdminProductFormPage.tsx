import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsService } from '../../services/products.service';
import { categoriesService } from '../../services/categories.service';
import { Button, Card, ErrorState, Input, Label, PageLoader, Select, Textarea } from '../../components/ui';
import type { Category, CutOption, PackagingOption, UnitType } from '../../types';

interface OptionRow {
  id?: string;
  name: string;
  priceModifier: number;
}

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  categoryId: '',
  price: 0,
  pricePerKg: undefined as number | undefined,
  unitType: 'KG' as UnitType,
  minWeight: undefined as number | undefined,
  maxWeight: undefined as number | undefined,
  weightIncrement: 0.25,
  origin: '',
  storageInstructions: '',
  isFeatured: false,
  isAvailable: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id && id !== 'nouveau';
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [cutOptions, setCutOptions] = useState<OptionRow[]>([]);
  const [packagingOptions, setPackagingOptions] = useState<OptionRow[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoriesService.findAll().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    productsService.findOne(id).then((p) => {
      setForm({
        name: p.name,
        slug: p.slug,
        description: p.description || '',
        categoryId: p.categoryId,
        price: p.price,
        pricePerKg: p.pricePerKg ?? undefined,
        unitType: p.unitType,
        minWeight: p.minWeight ?? undefined,
        maxWeight: p.maxWeight ?? undefined,
        weightIncrement: p.weightIncrement ?? 0.25,
        origin: p.origin || '',
        storageInstructions: p.storageInstructions || '',
        isFeatured: p.isFeatured,
        isAvailable: p.isAvailable,
      });
      setCutOptions((p.cutOptions || []).map((c: CutOption) => ({ id: c.id, name: c.name, priceModifier: c.priceModifier })));
      setPackagingOptions(
        (p.packagingOptions || []).map((c: PackagingOption) => ({ id: c.id, name: c.name, priceModifier: c.priceModifier })),
      );
      setLoading(false);
    });
  }, [isEdit, id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        cutOptions: cutOptions.filter((o) => o.name.trim()),
        packagingOptions: packagingOptions.filter((o) => o.name.trim()),
      };

      if (isEdit && id) {
        await productsService.update(id, payload);
      } else {
        await productsService.create(payload);
      }
      navigate('/admin/produits');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Impossible d’enregistrer le produit.';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-text">{isEdit ? 'Modifier le produit' : 'Nouveau produit'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && <ErrorState message={error} />}

        <Card className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="categoryId">Catégorie</Label>
              <Select id="categoryId" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Sélectionner…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="unitType">Unité de vente</Label>
              <Select id="unitType" value={form.unitType} onChange={(e) => setForm({ ...form, unitType: e.target.value as UnitType })}>
                <option value="KG">Au kilogramme</option>
                <option value="PIECE">À la pièce</option>
                <option value="LOT">Au lot</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Prix ({form.unitType === 'KG' ? 'par kg' : 'unitaire'})</Label>
              <Input
                id="price"
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="origin">Origine</Label>
              <Input id="origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="Bénin" />
            </div>

            {form.unitType === 'KG' && (
              <>
                <div>
                  <Label htmlFor="minWeight">Poids minimum (kg)</Label>
                  <Input
                    id="minWeight"
                    type="number"
                    step={0.1}
                    value={form.minWeight ?? ''}
                    onChange={(e) => setForm({ ...form, minWeight: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxWeight">Poids maximum (kg)</Label>
                  <Input
                    id="maxWeight"
                    type="number"
                    step={0.1}
                    value={form.maxWeight ?? ''}
                    onChange={(e) => setForm({ ...form, maxWeight: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="weightIncrement">Pas de sélection (kg)</Label>
                  <Input
                    id="weightIncrement"
                    type="number"
                    step={0.05}
                    value={form.weightIncrement}
                    onChange={(e) => setForm({ ...form, weightIncrement: Number(e.target.value) })}
                  />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <Label htmlFor="storageInstructions">Instructions de conservation</Label>
              <Input
                id="storageInstructions"
                value={form.storageInstructions}
                onChange={(e) => setForm({ ...form, storageInstructions: e.target.value })}
                placeholder="À conserver entre 0 et 4°C, consommer sous 48h"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <label className="flex items-center gap-2 text-sm text-text">
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
              Disponible à la vente
            </label>
            <label className="flex items-center gap-2 text-sm text-text">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Mettre en avant sur l'accueil
            </label>
          </div>
        </Card>

        <OptionEditor title="Options de découpe" rows={cutOptions} setRows={setCutOptions} />
        <OptionEditor title="Options de conditionnement" rows={packagingOptions} setRows={setPackagingOptions} />

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/produits')}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}

function OptionEditor({
  title,
  rows,
  setRows,
}: {
  title: string;
  rows: OptionRow[];
  setRows: (rows: OptionRow[]) => void;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text">{title}</h2>
        <button
          type="button"
          onClick={() => setRows([...rows, { name: '', priceModifier: 0 }])}
          className="text-sm font-semibold text-primary"
        >
          + Ajouter
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="Nom (ex : Tranches fines)"
              value={row.name}
              onChange={(e) => setRows(rows.map((r, idx) => (idx === i ? { ...r, name: e.target.value } : r)))}
            />
            <Input
              type="number"
              placeholder="Supplément"
              className="w-32"
              value={row.priceModifier}
              onChange={(e) =>
                setRows(rows.map((r, idx) => (idx === i ? { ...r, priceModifier: Number(e.target.value) } : r)))
              }
            />
            <button type="button" onClick={() => setRows(rows.filter((_, idx) => idx !== i))} className="text-danger">
              ✕
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
