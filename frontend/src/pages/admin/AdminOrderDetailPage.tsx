import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { ordersService } from '../../services/orders.service';
import { formatDate, formatPrice, formatWeight } from '../../lib/format';
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from '../../lib/orderStatus';
import { Badge, Button, Card, Input, Label, PageLoader, Select } from '../../components/ui';
import type { Order, OrderStatus } from '../../types';

const STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'CUTTING',
  'PACKAGING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
  'REFUNDED',
];

export function AdminOrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [weightForm, setWeightForm] = useState({ actualWeight: '', finalAmount: '' });

  function load() {
    if (orderNumber) {
      ordersService.findByOrderNumber(orderNumber).then(setOrder);
    }
  }

  useEffect(load, [orderNumber]);

  if (!order) {
    return <PageLoader />;
  }

  async function handleStatusChange(status: OrderStatus) {
    if (!order) return;
    setUpdating(true);
    try {
      const updated = await ordersService.updateStatus(order.id, status);
      setOrder(updated);
    } finally {
      setUpdating(false);
    }
  }

  async function handleWeightSubmit(e: FormEvent) {
    e.preventDefault();
    if (!order) return;
    await ordersService.updateWeight(order.id, Number(weightForm.actualWeight), Number(weightForm.finalAmount));
    load();
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">{order.orderNumber}</h1>
          <p className="text-sm text-muted">{formatDate(order.createdAt)}</p>
        </div>
        <Badge className={ORDER_STATUS_COLOR[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-semibold text-text">Changer le statut</h2>
        <Select
          disabled={updating}
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
          className="mt-2 max-w-xs"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
      </Card>

      <Card className="mt-4 p-5">
        <h2 className="font-semibold text-text">Client</h2>
        <p className="mt-1 text-sm text-muted">
          {order.customer?.user?.firstName} {order.customer?.user?.lastName}
        </p>
      </Card>

      <Card className="mt-4 p-5">
        <h2 className="font-semibold text-text">Articles</h2>
        <div className="mt-3 flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium text-text">{item.productName}</p>
                <p className="text-xs text-muted">
                  {item.weight ? `Poids commandé : ${formatWeight(item.weight)}` : `${item.quantity} unité(s)`}
                  {item.actualWeight && ` · Poids réel : ${formatWeight(item.actualWeight)}`}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(item.finalAmount ?? item.subtotal)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-bold text-text">
          <span>Total {order.estimatedAmount ? '(estimatif)' : '(final)'}</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </Card>

      {order.estimatedAmount && (
        <Card className="mt-4 p-5">
          <h2 className="font-semibold text-text">Saisir le poids réel après pesée</h2>
          <p className="mt-1 text-xs text-muted">
            Applique le poids et le montant final à l'ensemble des lignes de la commande (RB-04 : toute variation est tracée).
          </p>
          <form onSubmit={handleWeightSubmit} className="mt-3 flex flex-wrap items-end gap-3">
            <div>
              <Label htmlFor="actualWeight">Poids réel (kg)</Label>
              <Input
                id="actualWeight"
                type="number"
                step={0.01}
                required
                value={weightForm.actualWeight}
                onChange={(e) => setWeightForm({ ...weightForm, actualWeight: e.target.value })}
                className="w-40"
              />
            </div>
            <div>
              <Label htmlFor="finalAmount">Montant final</Label>
              <Input
                id="finalAmount"
                type="number"
                required
                value={weightForm.finalAmount}
                onChange={(e) => setWeightForm({ ...weightForm, finalAmount: e.target.value })}
                className="w-40"
              />
            </div>
            <Button type="submit">Valider la pesée</Button>
          </form>
        </Card>
      )}

      {order.address && (
        <Card className="mt-4 p-5">
          <h2 className="font-semibold text-text">Livraison</h2>
          <p className="mt-2 text-sm text-muted">
            {order.address.street}, {order.address.city}, {order.address.department} · {order.address.phone}
          </p>
        </Card>
      )}
    </div>
  );
}
