import { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { Search, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accueil - Bêtes & Frais',
  description: 'Découvrez nos produits animaux frais de qualité au Bénin. Viande, volailles, poissons et plus encore.',
};

// Données factices pour le MVP
const categories = [
  { id: '1', name: 'Bœuf', slug: 'boeuf', icon: '🐄' },
  { id: '2', name: 'Mouton', slug: 'mouton', icon: '🐑' },
  { id: '3', name: 'Chèvre', slug: 'chevre', icon: '🐐' },
  { id: '4', name: 'Porc', slug: 'porc', icon: '🐖' },
  { id: '5', name: 'Volailles', slug: 'volailles', icon: '🐔' },
  { id: '6', name: 'Poissons', slug: 'poissons', icon: '🐟' },
  { id: '7', name: 'Lapin', slug: 'lapin', icon: '🐇' },
];

const featuredProducts = [
  {
    id: '1',
    slug: 'filet-de-boeuf',
    name: 'Filet de Bœuf',
    description: 'Filet de bœuf frais, première qualité',
    category: { id: '1', name: 'Bœuf', slug: 'boeuf' },
    animal: { id: '1', name: 'Bœuf', species: 'Bos taurus' },
    origin: 'Bénin',
    saleMode: 'per_kg' as const,
    basePrice: 5000,
    pricePerKg: 5000,
    stock: 50,
    images: [{ id: '1', url: '/images/filet-boeuf.jpg', alt: 'Filet de bœuf', isPrimary: true }],
    availability: 'available' as const,
  },
  {
    id: '2',
    slug: 'poulet-fermier',
    name: 'Poulet Fermier',
    description: 'Poulet fermier élevé en plein air',
    category: { id: '5', name: 'Volailles', slug: 'volailles' },
    animal: { id: '5', name: 'Poulet', species: 'Gallus gallus' },
    origin: 'Bénin',
    saleMode: 'fixed' as const,
    basePrice: 3500,
    stock: 100,
    images: [{ id: '2', url: '/images/poulet.jpg', alt: 'Poulet fermier', isPrimary: true }],
    availability: 'available' as const,
  },
  {
    id: '3',
    slug: 'viande-de-mouton',
    name: 'Viande de Mouton',
    description: 'Viande de mouton fraîche, poids variable',
    category: { id: '2', name: 'Mouton', slug: 'mouton' },
    animal: { id: '2', name: 'Mouton', species: 'Ovis aries' },
    origin: 'Bénin',
    saleMode: 'variable_weight' as const,
    basePrice: 4500,
    pricePerKg: 4500,
    stock: 30,
    images: [{ id: '3', url: '/images/mouton.jpg', alt: 'Viande de mouton', isPrimary: true }],
    availability: 'available' as const,
  },
];

export default function HomePage() {
  return (
    <div className="pb-20">
      {/* Header avec recherche */}
      <header className="bg-[#176B52] text-white p-4 pt-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Bêtes & Frais</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un produit, une catégorie..."
              className="input-field pr-12"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Catégories */}
        <section className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Catégories</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalogue?category=${category.slug}`}
                className="flex flex-col items-center gap-2 p-2 hover:bg-[#EAF6F0] rounded-lg transition-colors"
              >
                <span className="text-3xl">{category.icon}</span>
                <span className="text-xs text-center font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Comment ça marche</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Découvrir', desc: 'Parcourez notre catalogue' },
              { step: '2', title: 'Choisir', desc: 'Sélectionnez vos produits' },
              { step: '3', title: 'Commander', desc: 'Personnalisez et payez' },
              { step: '4', title: 'Recevoir', desc: 'Livraison ou retrait' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-8 h-8 bg-[#176B52] text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                  {item.step}
                </div>
                <h3 className="font-medium text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Produits populaires */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Produits populaires</h2>
            <Link href="/catalogue" className="text-[#176B52] text-sm font-medium flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </section>

        {/* Garanties */}
        <section className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Nos garanties</h2>
          <div className="space-y-3">
            {[
              { title: 'Qualité contrôlée', desc: 'Produits inspectés et certifiés' },
              { title: 'Fraîcheur garantie', desc: 'Chaîne du froid respectée' },
              { title: 'Livraison rapide', desc: 'Partout au Bénin' },
              { title: 'Prix transparents', desc: 'Pas de frais cachés' },
            ].map((guarantee) => (
              <div key={guarantee.title} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#EAF6F0] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#176B52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-sm">{guarantee.title}</h3>
                  <p className="text-xs text-gray-500">{guarantee.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
