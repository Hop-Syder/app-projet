import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import { formatDate, formatPrice } from '../../lib/format';
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from '../../lib/orderStatus';
import { Badge, Card, PageLoader } from '../../components/ui';
import type { AdminDashboard, OrderStatus } from '../../types';

const KPI_CARDS: { key: keyof AdminDashboard; label: string; format?: 'price' }[] = [
  { key: 'totalOrders', label: 'Commandes totales' },
  { key: 'pendingOrders', label: 'En attente' },
  { key: 'preparingOrders', label: 'En préparation' },
  { key: 'deliveredOrders', label: 'Livrées' },
  { key: 'totalRevenue', label: 'Revenu encaissé', format: 'price' },
  { key: 'totalCustomers', label: 'Clients' },
  { key: 'totalProducts', label: 'Produits actifs' },
  { key: 'lowStockItems', label: 'Lots en stock faible' },
];

export function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);

  useEffect(() => {
    adminService.getDashboard().then(setData);
  }, []);

  if (!data) {
    return <PageLoader />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Tableau de bord</h1>
      <p className="mt-1 text-sm text-muted">Vue d'ensemble de l'activité Bêtes &amp; Frais.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {KPI_CARDS.map((kpi) => (
          <Card key={kpi.key} className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{kpi.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-text">
              {kpi.format === 'price' ? formatPrice(data[kpi.key] as number) : (data[kpi.key] as number)}
            </p>
          </Card>
        ))}
      </div>

      {data.expiredItems > 0 && (
        <div className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {data.expiredItems} lot(s) de stock expiré(s) à traiter —{' '}
          <Link to="/admin/stock" className="font-semibold underline">
            voir le stock
          </Link>
        </div>
      )}

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text">Commandes récentes</h2>
          <Link to="/admin/commandes" className="text-sm font-semibold text-primary">
            Tout voir →
          </Link>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-muted">
                <th className="py-2">N° commande</th>
                <th className="py-2">Client</th>
                <th className="py-2">Statut</th>
                <th className="py-2">Montant</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="py-2">
                    <Link to={`/admin/commandes/${order.orderNumber}`} className="font-medium text-primary">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-2">
                    {order.customer?.user?.firstName} {order.customer?.user?.lastName}
                  </td>
                  <td className="py-2">
                    <Badge className={ORDER_STATUS_COLOR[order.status as OrderStatus]}>
                      {ORDER_STATUS_LABEL[order.status as OrderStatus]}
                    </Badge>
                  </td>
                  <td className="py-2">{formatPrice(order.totalAmount)}</td>
                  <td className="py-2 text-muted">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
