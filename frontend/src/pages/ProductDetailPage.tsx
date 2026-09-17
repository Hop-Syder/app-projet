import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productsService } from '../services/products.service';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice, formatWeight } from '../lib/format';
import { Button, PageLoader } from '../components/ui';
import type { Product } from '../types';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [weight, setWeight] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cutOptionId, setCutOptionId] = useState<string>('');
  const [packagingOptionId, setPackagingOptionId] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setProduct(null);
    setNotFound(false);
    productsService
      .findBySlug(slug)
      .then((p) => {
        setProduct(p);
        if (p.unitType === 'KG' && p.minWeight) {
          setWeight(p.minWeight);
        }
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    let price = product.price;
    if (cutOptionId) {
      const opt = product.cutOptions.find((c) => c.id === cutOptionId);
      if (opt) price += opt.priceModifier;
    }
    if (packagingOptionId) {
      const opt = product.packagingOptions.find((p) => p.id === packagingOptionId);
      if (opt) price += opt.priceModifier;
    }
    return price;
  }, [product, cutOptionId, packagingOptionId]);

  const estimatedTotal = useMemo(() => {
    if (!product) return 0;
    if (product.unitType === 'KG' && weight) {
      return unitPrice * weight * quantity;
    }
    return unitPrice * quantity;
  }, [product, unitPrice, weight, quantity]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg font-semibold text-text">Produit introuvable</p>
        <Link to="/catalogue" className="mt-3 inline-block text-primary">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  if (!product) {
    return <PageLoader />;
  }

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/connexion', { state: { from: { pathname: `/produits/${slug}` } } });
      return;
    }
    setAdding(true);
    setFeedback(null);
    try {
      await addItem({
        productId: product!.id,
        quantity,
        weight: product!.unitType === 'KG' ? weight ?? undefined : undefined,
        cutOptionId: cutOptionId || undefined,
        packagingOptionId: packagingOptionId || undefined,
      });
      setFeedback('Ajouté au panier ✔');
    } catch (err: any) {
      setFeedback(err?.response?.data?.message || "Impossible d'ajouter ce produit au panier.");
    } finally {
      setAdding(false);
    }
  }

  const weightSteps: number[] = [];
  if (product.unitType === 'KG' && product.minWeight && product.maxWeight) {
    const increment = product.weightIncrement || 0.25;
    for (let w = product.minWeight; w <= product.maxWeight + 1e-6; w += increment) {
      weightSteps.push(Math.round(w * 1000) / 1000);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="text-xs text-muted">
        <Link to="/catalogue" className="hover:text-primary">
          Catalogue
        </Link>{' '}
        / {product.category?.name} / <span className="text-text">{product.name}</span>
      </nav>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div className="flex h-80 items-center justify-center rounded-2xl bg-primary-soft text-6xl">🥩</div>

        <div>
          <h1 className="text-2xl font-bold text-text">{product.name}</h1>
          {!product.isAvailable && (
            <span className="mt-2 inline-block rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger">
              Indisponible actuellement
            </span>
          )}
          <p className="mt-2 text-sm text-muted">{product.description}</p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
            {product.origin && <span>Origine : {product.origin}</span>}
            {product.storageInstructions && <span>Conservation : {product.storageInstructions}</span>}
          </div>

          <p className="mt-4 text-2xl font-extrabold text-primary">
            {formatPrice(unitPrice)}
            {product.unitType === 'KG' && <span className="text-sm font-medium text-muted"> /kg</span>}
          </p>

          {product.unitType === 'KG' && weightSteps.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-sm font-medium text-text">Poids</p>
              <div className="flex flex-wrap gap-2">
                {weightSteps.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    className={`rounded-xl border px-3 py-1.5 text-sm font-medium ${
                      weight === w ? 'border-primary bg-primary-soft text-primary-dark' : 'border-border text-text hover:border-primary'
                    }`}
                  >
                    {formatWeight(w)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.cutOptions.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-sm font-medium text-text">Découpe</p>
              <div className="flex flex-wrap gap-2">
                {product.cutOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCutOptionId(opt.id === cutOptionId ? '' : opt.id)}
                    className={`rounded-xl border px-3 py-1.5 text-sm font-medium ${
                      cutOptionId === opt.id ? 'border-primary bg-primary-soft text-primary-dark' : 'border-border text-text hover:border-primary'
                    }`}
                  >
                    {opt.name}
                    {opt.priceModifier > 0 && ` (+${formatPrice(opt.priceModifier)})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.packagingOptions.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-sm font-medium text-text">Conditionnement</p>
              <div className="flex flex-wrap gap-2">
                {product.packagingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPackagingOptionId(opt.id === packagingOptionId ? '' : opt.id)}
                    className={`rounded-xl border px-3 py-1.5 text-sm font-medium ${
                      packagingOptionId === opt.id ? 'border-primary bg-primary-soft text-primary-dark' : 'border-border text-text hover:border-primary'
                    }`}
                  >
                    {opt.name}
                    {opt.priceModifier > 0 && ` (+${formatPrice(opt.priceModifier)})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <p className="text-sm font-medium text-text">Quantité</p>
            <div className="flex items-center rounded-xl border border-border">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1.5 text-lg">
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-1.5 text-lg">
                +
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-primary-soft p-4">
            <p className="text-sm text-primary-dark">
              Montant {product.unitType === 'KG' ? 'estimatif' : 'total'} : <strong>{formatPrice(estimatedTotal)}</strong>
            </p>
            {product.unitType === 'KG' && (
              <p className="mt-1 text-xs text-primary-dark/70">
                Le montant final sera ajusté après pesée réelle par notre équipe.
              </p>
            )}
          </div>

          {feedback && <p className="mt-3 text-sm font-medium text-primary">{feedback}</p>}

          <Button
            onClick={handleAddToCart}
            disabled={!product.isAvailable || adding}
            className="mt-4 w-full md:w-auto"
          >
            {adding ? 'Ajout…' : 'Ajouter au panier'}
          </Button>
        </div>
      </div>
    </div>
  );
}
