import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ordersService } from '../services/orders.service';
import { formatDate, formatPrice, formatWeight } from '../lib/format';
import { ORDER_STATUS_COLOR, ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from '../lib/orderStatus';
import { Badge, Button, Card, PageLoader } from '../components/ui';
import type { Order } from '../types';

export function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      ordersService.findByOrderNumber(orderNumber).then(setOrder);
    }
  }, [orderNumber]);

  if (!order) {
    return <PageLoader />;
  }

  const currentStepIndex = ORDER_STATUS_FLOW.indexOf(order.status);
  const canCancel = !['DELIVERED', 'CANCELLED', 'FAILED', 'REFUNDED'].includes(order.status);

  async function handleCancel() {
    if (!order || !confirm('Confirmer l’annulation de cette commande ?')) return;
    setCancelling(true);
    try {
      const updated = await ordersService.cancel(order.id, 'Annulée par le client');
      setOrder(updated);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">{order.orderNumber}</h1>
          <p className="text-sm text-muted">{formatDate(order.createdAt)}</p>
        </div>
        <Badge className={ORDER_STATUS_COLOR[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
      </div>

      {order.status !== 'CANCELLED' && order.status !== 'FAILED' && (
        <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-2">
          {ORDER_STATUS_FLOW.map((step, i) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  i <= currentStepIndex ? 'bg-primary text-white' : 'bg-gray-200 text-muted'
                }`}
              >
                {i + 1}
              </div>
              {i < ORDER_STATUS_FLOW.length - 1 && (
                <div className={`h-0.5 w-6 ${i < currentStepIndex ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <Card className="mt-6 p-5">
        <h2 className="font-semibold text-text">Articles</h2>
        <div className="mt-3 flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium text-text">{item.productName}</p>
                <p className="text-xs text-muted">
                  {item.weight ? formatWeight(item.weight) : `${item.quantity} unité(s)`}
                  {item.actualWeight && ` · Poids réel : ${formatWeight(item.actualWeight)}`}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(item.finalAmount ?? item.subtotal)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-1 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-muted">
            <span>Sous-total</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Livraison</span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-text">
            <span>Total {order.estimatedAmount ? '(estimatif)' : ''}</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </Card>

      {order.address && (
        <Card className="mt-4 p-5">
          <h2 className="font-semibold text-text">Livraison</h2>
          <p className="mt-2 text-sm text-muted">
            {order.address.street}, {order.address.city}, {order.address.department}
          </p>
          <p className="text-sm text-muted">{order.address.phone}</p>
        </Card>
      )}

      {canCancel && (
        <Button variant="danger" onClick={handleCancel} disabled={cancelling} className="mt-6">
          {cancelling ? 'Annulation…' : 'Annuler la commande'}
        </Button>
      )}
    </div>
  );
}
