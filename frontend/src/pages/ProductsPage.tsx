import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsService } from '../services/products.service';
import { categoriesService } from '../services/categories.service';
import { formatPrice } from '../lib/format';
import { EmptyState, PageLoader, Select } from '../components/ui';
import type { Category, Product } from '../types';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const categoryId = searchParams.get('categoryId') || '';

  useEffect(() => {
    categoriesService.findAll().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setProducts(null);
    productsService
      .findAll({ categoryId: categoryId || undefined, search: search || undefined, isAvailable: true })
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [categoryId, search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-text">Catalogue</h1>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit…"
          className="w-full rounded-xl border border-gray-200 bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:max-w-xs"
        />
        <Select
          value={categoryId}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            if (e.target.value) params.set('categoryId', e.target.value);
            else params.delete('categoryId');
            setSearchParams(params);
          }}
          className="sm:max-w-xs"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6">
        {products === null ? (
          <PageLoader />
        ) : products.length === 0 ? (
          <EmptyState title="Aucun produit trouvé" description="Essayez une autre recherche ou catégorie." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/produits/${product.slug}`}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-md"
              >
                <div className="flex h-32 items-center justify-center bg-primary-soft text-4xl">🥩</div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <p className="text-sm font-semibold text-text">{product.name}</p>
                  <p className="text-xs text-muted">{product.category?.name}</p>
                  {!product.isAvailable && (
                    <span className="mt-1 w-fit rounded-full bg-danger-soft px-2 py-0.5 text-[11px] font-semibold text-danger">
                      Indisponible
                    </span>
                  )}
                  <p className="mt-1 text-sm font-bold text-primary">
                    {formatPrice(product.price)}
                    {product.unitType === 'KG' && <span className="text-xs font-normal text-muted"> /kg</span>}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
