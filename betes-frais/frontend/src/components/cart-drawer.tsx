'use client';

import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const { items, removeItem, updateItem, subtotal, totalItems, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Votre panier est vide</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Commencez vos achats pour ajouter des produits
        </p>
        <Link
          href="/catalogue"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Découvrir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Mon Panier ({totalItems()} articles)</h2>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-surface rounded-lg border border-border"
            >
              {/* Image */}
              <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ShoppingCart className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.productName}</h3>
                
                {item.weight && (
                  <p className="text-sm text-muted-foreground">
                    Poids: {item.weight >= 1000 ? `${(item.weight / 1000).toFixed(2)} kg` : `${item.weight} g`}
                    {item.weightType === 'variable' && (
                      <span className="ml-2 text-xs text-amber-600">(estimatif)</span>
                    )}
                  </p>
                )}

                {item.cutOption && (
                  <p className="text-sm text-muted-foreground">Découpe: {item.cutOption}</p>
                )}

                {item.seasoningName && (
                  <p className="text-sm text-muted-foreground">Assaisonnement: {item.seasoningName}</p>
                )}

                {item.accompaniments && item.accompaniments.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Accompagnements: {item.accompaniments.map(a => a.name).join(', ')}
                  </p>
                )}

                {/* Quantité */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                    className="p-1 rounded-md hover:bg-muted"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                    className="p-1 rounded-md hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Prix & Actions */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-muted-foreground hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.basePrice * item.quantity)}</p>
                  {item.estimatedAmount && (
                    <p className="text-xs text-muted-foreground">
                      Est. {formatPrice(item.estimatedAmount * item.quantity)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Sous-total</span>
          <span className="text-lg font-semibold">{formatPrice(subtotal())}</span>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Les frais de livraison seront calculés à l'étape suivante.
          {items.some(i => i.weightType === 'variable') && (
            <span className="block mt-1 text-amber-600">
              ⚠️ Certains produits ont un poids variable. Le montant final sera ajusté après pesée.
            </span>
          )}
        </p>

        <Link
          href="/checkout"
          className="w-full inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
        >
          Commander ({formatPrice(subtotal())})
        </Link>
        
        <button
          onClick={clearCart}
          className="w-full text-sm text-muted-foreground hover:text-danger"
        >
          Vider le panier
        </button>
      </div>
    </div>
  );
}
