import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice, formatWeight } from '../lib/format';
import { Button, EmptyState, PageLoader } from '../components/ui';

export function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading && !cart) {
    return <PageLoader />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          title="Votre panier est vide"
          description="Parcourez le catalogue pour ajouter des produits frais."
          action={
            <Link to="/catalogue">
              <Button>Voir le catalogue</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-text">Mon panier</h1>

      <div className="mt-6 flex flex-col gap-3">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-2xl">🥩</div>
            <div className="flex-1">
              <p className="font-semibold text-text">{item.product?.name}</p>
              <p className="text-xs text-muted">
                {item.cutOption?.name && `${item.cutOption.name} · `}
                {item.packagingOption?.name && `${item.packagingOption.name} · `}
                {item.weight ? formatWeight(item.weight) : `${item.quantity} unité(s)`}
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">{formatPrice(item.totalPrice)}</p>
            </div>
            <div className="flex items-center rounded-xl border border-border">
              <button
                onClick={() => (item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id))}
                className="px-3 py-1.5 text-lg"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
              <button onClick={() => updateItem(item.id, item.quantity + 1)} className="px-3 py-1.5 text-lg">
                +
              </button>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-sm text-danger hover:underline">
              Retirer
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-primary-soft p-5">
        <div>
          <p className="text-sm text-primary-dark">Sous-total (hors livraison)</p>
          <p className="text-xl font-extrabold text-primary-dark">{formatPrice(cart.totalAmount)}</p>
        </div>
        <Button onClick={() => navigate('/checkout')}>Passer la commande</Button>
      </div>
    </div>
  );
}
