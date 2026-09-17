import { useEffect, useState, type FormEvent } from 'react';
import { categoriesService } from '../../services/categories.service';
import { Button, Card, ErrorState, Input } from '../../components/ui';
import type { Category } from '../../types';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState<string | null>(null);

  function load() {
    categoriesService.findAll(false).then(setCategories);
  }

  useEffect(() => {
    load();
  }, []);

  function slugify(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await categoriesService.create({ name: form.name, slug: slugify(form.name), description: form.description });
      setForm({ name: '', description: '' });
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Création impossible');
    }
  }

  async function toggleActive(category: Category) {
    await categoriesService.update(category.id, { active: !category.active });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      await categoriesService.remove(id);
      load();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Suppression impossible (produits associés ?)');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Catégories</h1>

      <Card className="mt-6 p-5">
        <h2 className="font-semibold text-text">Nouvelle catégorie</h2>
        <form onSubmit={handleCreate} className="mt-3 flex flex-col gap-3 sm:flex-row">
          {error && <ErrorState message={error} />}
          <Input placeholder="Nom" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input
            placeholder="Description (optionnel)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Button type="submit" className="shrink-0">
            Ajouter
          </Button>
        </form>
      </Card>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Produits</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-text">{c.name}</td>
                <td className="px-4 py-3 text-muted">{c.products?.length ?? 0}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(c)} className={c.active ? 'text-primary' : 'text-muted'}>
                    {c.active ? 'Active' : 'Désactivée'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(c.id)} className="text-sm font-medium text-danger">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
