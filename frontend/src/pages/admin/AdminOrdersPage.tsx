import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersService } from '../../services/orders.service';
import { formatDate, formatPrice } from '../../lib/format';
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from '../../lib/orderStatus';
import { Badge, EmptyState, PageLoader, Select } from '../../components/ui';
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

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [status, setStatus] = useState<OrderStatus | ''>('');

  useEffect(() => {
    setOrders(null);
    ordersService.findAll(status ? { status } : undefined).then(setOrders);
  }, [status]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Commandes</h1>
        <Select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | '')} className="max-w-xs">
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
      </div>

      {orders === null ? (
        <PageLoader />
      ) : orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Aucune commande" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted">
                <th className="px-4 py-3">N° commande</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Paiement</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link to={`/admin/commandes/${order.orderNumber}`} className="font-medium text-primary">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {order.customer?.user?.firstName} {order.customer?.user?.lastName}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={ORDER_STATUS_COLOR[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">{order.paymentStatus}</td>
                  <td className="px-4 py-3">{formatPrice(order.totalAmount)}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
