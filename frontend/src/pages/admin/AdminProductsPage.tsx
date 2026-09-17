import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsService } from '../../services/products.service';
import { formatPrice } from '../../lib/format';
import { Badge, Button, EmptyState, PageLoader } from '../../components/ui';
import type { Product } from '../../types';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);

  function load() {
    productsService.findAll().then(setProducts);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce produit ?')) return;
    await productsService.remove(id);
    load();
  }

  if (!products) {
    return <PageLoader />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Produits</h1>
          <p className="mt-1 text-sm text-muted">{products.length} produit(s) au catalogue.</p>
        </div>
        <Link to="/admin/produits/nouveau">
          <Button>+ Nouveau produit</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Aucun produit" description="Créez votre premier produit." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted">
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text">{p.name}</td>
                  <td className="px-4 py-3 text-muted">{p.category?.name}</td>
                  <td className="px-4 py-3">
                    {formatPrice(p.price)}
                    {p.unitType === 'KG' && '/kg'}
                  </td>
                  <td className="px-4 py-3 text-muted">{p.stockQuantity ?? '—'}</td>
                  <td className="px-4 py-3">
                    {p.isAvailable ? (
                      <Badge className="bg-primary-soft text-primary-dark">Disponible</Badge>
                    ) : (
                      <Badge className="bg-danger-soft text-danger">Indisponible</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/produits/${p.id}`} className="mr-3 text-sm font-medium text-primary">
                      Modifier
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-sm font-medium text-danger">
                      Supprimer
                    </button>
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
