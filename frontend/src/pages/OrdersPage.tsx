import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersService } from '../services/orders.service';
import { formatDate, formatPrice } from '../lib/format';
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from '../lib/orderStatus';
import { Badge, EmptyState, PageLoader } from '../components/ui';
import type { Order } from '../types';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    ordersService.myOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  if (orders === null) {
    return <PageLoader />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-text">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Aucune commande pour le moment" description="Vos commandes apparaîtront ici." />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/compte/commandes/${order.orderNumber}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4 hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-text">{order.orderNumber}</p>
                <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <Badge className={ORDER_STATUS_COLOR[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
                <p className="mt-1 text-sm font-semibold text-text">{formatPrice(order.totalAmount)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
