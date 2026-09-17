import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersService } from '../services/orders.service';
import { formatPrice } from '../lib/format';
import { Button, PageLoader } from '../components/ui';
import type { Order } from '../types';

export function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderNumber) {
      ordersService.findByOrderNumber(orderNumber).then(setOrder);
    }
  }, [orderNumber]);

  if (!order) {
    return <PageLoader />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-3xl">✔</div>
      <h1 className="mt-4 text-2xl font-bold text-text">Commande confirmée</h1>
      <p className="mt-2 text-sm text-muted">
        Votre commande <strong>{order.orderNumber}</strong> a bien été enregistrée. Vous serez notifié à chaque étape.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5 text-left">
        <p className="text-sm font-semibold text-text">Montant estimatif : {formatPrice(order.totalAmount)}</p>
        <p className="mt-1 text-xs text-muted">
          Pour les produits vendus au poids, le montant sera ajusté après pesée réelle.
        </p>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Link to="/catalogue">
          <Button variant="outline">Continuer mes achats</Button>
        </Link>
        <Link to="/compte/commandes">
          <Button>Suivre ma commande</Button>
        </Link>
      </div>
    </div>
  );
}
