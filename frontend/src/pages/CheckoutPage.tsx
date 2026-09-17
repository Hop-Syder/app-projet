import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { addressesService } from '../services/addresses.service';
import { deliveryZonesService } from '../services/delivery-zones.service';
import { ordersService } from '../services/orders.service';
import { paymentsService } from '../services/payments.service';
import { formatPrice } from '../lib/format';
import { Button, Card, ErrorState, Input, Label, PageLoader, Select } from '../components/ui';
import type { Address, DeliveryZone } from '../types';

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Paiement à la livraison (espèces)' },
  { value: 'MOBILE_MONEY', label: 'Mobile Money (MTN / Moov)' },
];

export function CheckoutPage() {
  const { cart, clear } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    department: 'Littoral',
    phone: '',
    instructions: '',
    deliveryZoneId: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    addressesService.findAll().then((list) => {
      setAddresses(list);
      const def = list.find((a) => a.isDefault) || list[0];
      if (def) setSelectedAddressId(def.id);
      else setShowNewAddress(true);
    });
    deliveryZonesService.findAll().then(setZones);
  }, []);

  if (!cart || cart.items.length === 0) {
    navigate('/panier');
    return null;
  }

  if (addresses === null) {
    return <PageLoader />;
  }

  const selectedZone = zones.find(
    (z) => z.id === (showNewAddress ? newAddress.deliveryZoneId : addresses.find((a) => a.id === selectedAddressId)?.deliveryZoneId),
  );
  const deliveryFee = selectedZone?.fee ?? 0;
  const total = cart.totalAmount + deliveryFee;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let addressId = selectedAddressId;

      if (showNewAddress) {
        const created = await addressesService.create({ ...newAddress, isDefault: addresses!.length === 0 });
        addressId = created.id;
      }

      const order = await ordersService.create({
        addressId,
        deliveryZoneId: selectedZone?.id,
        deliveryFee,
        paymentMethod,
        items: cart!.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          weight: item.weight ?? undefined,
          cutOption: item.cutOptionId ?? undefined,
          packagingOption: item.packagingOptionId ?? undefined,
        })),
      });

      await paymentsService.initiate(order.id, paymentMethod as 'CASH' | 'MOBILE_MONEY');
      await clear();
      navigate(`/commandes/${order.orderNumber}/confirmation`);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Impossible de valider la commande. Réessayez.';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-text">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-4 md:col-span-2">
          {error && <ErrorState message={error} />}

          <Card className="p-5">
            <h2 className="font-semibold text-text">Adresse de livraison</h2>

            {addresses.length > 0 && !showNewAddress && (
              <div className="mt-3 flex flex-col gap-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${
                      selectedAddressId === addr.id ? 'border-primary bg-primary-soft' : 'border-border'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-medium text-text">{addr.street}</span>
                      <span className="block text-muted">
                        {addr.city}, {addr.department} · {addr.phone}
                      </span>
                    </span>
                  </label>
                ))}
                <button type="button" onClick={() => setShowNewAddress(true)} className="mt-1 text-left text-sm font-semibold text-primary">
                  + Utiliser une nouvelle adresse
                </button>
              </div>
            )}

            {showNewAddress && (
              <div className="mt-3 grid gap-3">
                <div>
                  <Label htmlFor="street">Rue / quartier</Label>
                  <Input id="street" required value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" required value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="department">Département</Label>
                    <Input id="department" required value={newAddress.department} onChange={(e) => setNewAddress({ ...newAddress, department: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" required value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} placeholder="+229 ..." />
                </div>
                <div>
                  <Label htmlFor="deliveryZoneId">Zone de livraison</Label>
                  <Select
                    id="deliveryZoneId"
                    value={newAddress.deliveryZoneId}
                    onChange={(e) => setNewAddress({ ...newAddress, deliveryZoneId: e.target.value })}
                  >
                    <option value="">Sélectionner une zone</option>
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} — {formatPrice(z.fee)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="instructions">Instructions de livraison (optionnel)</Label>
                  <Input
                    id="instructions"
                    value={newAddress.instructions}
                    onChange={(e) => setNewAddress({ ...newAddress, instructions: e.target.value })}
                    placeholder="Porte bleue, 3e étage…"
                  />
                </div>
                {addresses.length > 0 && (
                  <button type="button" onClick={() => setShowNewAddress(false)} className="text-left text-sm text-muted">
                    ← Utiliser une adresse existante
                  </button>
                )}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-text">Mode de paiement</h2>
            <div className="mt-3 flex flex-col gap-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${
                    paymentMethod === m.value ? 'border-primary bg-primary-soft' : 'border-border'
                  }`}
                >
                  <input type="radio" name="payment" checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} />
                  {m.label}
                </label>
              ))}
            </div>
          </Card>
        </div>

        <Card className="h-fit p-5">
          <h2 className="font-semibold text-text">Récapitulatif</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Sous-total</span>
              <span>{formatPrice(cart.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Livraison</span>
              <span>{selectedZone ? formatPrice(deliveryFee) : 'À définir'}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold text-text">
              <span>Total estimatif</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">
            Ce montant est estimatif pour les produits vendus au poids : il sera ajusté après pesée réelle.
          </p>
          <Button type="submit" disabled={submitting} className="mt-4 w-full">
            {submitting ? 'Validation…' : 'Confirmer la commande'}
          </Button>
        </Card>
      </form>
    </div>
  );
}
