import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsService } from '../services/products.service';
import { categoriesService } from '../services/categories.service';
import { formatPrice } from '../lib/format';
import { PageLoader } from '../components/ui';
import type { Category, Product } from '../types';

export function HomePage() {
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    productsService.getFeatured(8).then(setFeatured).catch(() => setFeatured([]));
    categoriesService.findAll().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <div>
      <section className="bg-primary-soft">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 md:py-24">
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-primary">
            Marché frais moderne · Bénin
          </span>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-primary-dark md:text-5xl">
            Viande, volaille et poisson frais, livrés chez vous en toute confiance.
          </h1>
          <p className="max-w-xl text-base text-primary-dark/80 md:text-lg">
            Choisissez le poids, la découpe et le mode de livraison. Le prix final est toujours calculé et
            confirmé par nos équipes avant préparation.
          </p>
          <Link
            to="/catalogue"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
          >
            Découvrir le catalogue
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-bold text-text">Catégories</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/catalogue?categoryId=${category.id}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-center text-sm font-medium text-text transition-shadow hover:shadow-md"
            >
              <span className="text-2xl">🥩</span>
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Produits populaires</h2>
          <Link to="/catalogue" className="text-sm font-semibold text-primary">
            Voir tout →
          </Link>
        </div>

        {featured === null ? (
          <PageLoader />
        ) : featured.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Aucun produit en avant pour le moment.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((product) => (
              <Link
                key={product.id}
                to={`/produits/${product.slug}`}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-md"
              >
                <div className="flex h-32 items-center justify-center bg-primary-soft text-4xl">🥩</div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <p className="text-sm font-semibold text-text">{product.name}</p>
                  <p className="text-xs text-muted">{product.category?.name}</p>
                  <p className="mt-1 text-sm font-bold text-primary">
                    {formatPrice(product.price)}
                    {product.unitType === 'KG' && <span className="text-xs font-normal text-muted"> /kg</span>}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-bold text-text">Comment ça marche</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          {[
            ['🔍', 'Découvrir', 'Parcourez le catalogue par catégorie ou recherchez directement.'],
            ['⚖️', 'Choisir', 'Sélectionnez le poids, la découpe et le conditionnement.'],
            ['🛒', 'Commander', 'Ajoutez au panier et validez adresse et créneau de livraison.'],
            ['🚚', 'Recevoir', 'Suivez votre commande jusqu’à la livraison.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="rounded-2xl border border-border bg-surface p-5">
              <span className="text-2xl">{icon}</span>
              <p className="mt-2 font-semibold text-text">{title}</p>
              <p className="mt-1 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
