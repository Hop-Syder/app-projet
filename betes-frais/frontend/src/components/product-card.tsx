'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { formatPrice, formatWeight } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedWeight, setSelectedWeight] = useState<number | undefined>(undefined);
  const [selectedCut, setSelectedCut] = useState<string | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);

  // Calcul du prix selon le poids sélectionné
  const calculatePrice = () => {
    let price = product.basePrice;
    
    if (product.saleMode === 'per_kg' && selectedWeight) {
      const pricePerGram = (product.pricePerKg || product.basePrice) / 1000;
      price = pricePerGram * selectedWeight;
    } else if (product.saleMode === 'variable_weight' && selectedWeight) {
      const pricePerGram = (product.pricePerKg || 0) / 1000;
      price = pricePerGram * selectedWeight;
    }

    // Ajouter le modificateur de découpe
    if (selectedCut && product.cutOptions) {
      const cutOption = product.cutOptions.find(c => c.id === selectedCut);
      if (cutOption) {
        if (cutOption.modifierType === 'percentage') {
          price = price * (1 + cutOption.priceModifier / 100);
        } else {
          price = price + cutOption.priceModifier;
        }
      }
    }

    return price;
  };

  const handleAddToCart = () => {
    const finalPrice = calculatePrice();
    
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.images.find(img => img.isPrimary)?.url,
      basePrice: finalPrice,
      quantity: 1,
      weight: selectedWeight,
      weightType: product.saleMode === 'variable_weight' ? 'variable' : 'fixed',
      estimatedAmount: product.saleMode === 'variable_weight' ? finalPrice : undefined,
      cutOption: selectedCut ? product.cutOptions?.find(c => c.id === selectedCut)?.name : undefined,
    });
  };

  // Générer les options de poids
  const weightOptions = (() => {
    if (!product.minWeight || !product.maxWeight) return [];
    
    const options: number[] = [];
    const step = product.weightStep || 250;
    
    for (let w = product.minWeight; w <= product.maxWeight; w += step) {
      options.push(w);
    }
    
    return options;
  })();

  return (
    <div className="group relative bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-muted">
        {product.images.length > 0 ? (
          <img
            src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12" />
          </div>
        )}
        
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-danger text-white px-4 py-2 rounded-full text-sm font-medium">
              Indisponible
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-3">
        {/* Nom et prix */}
        <div>
          <h3 className="font-semibold text-base line-clamp-2">{product.name}</h3>
          
          {product.saleMode === 'per_kg' || product.saleMode === 'variable_weight' ? (
            <div className="mt-1">
              <p className="text-sm text-muted-foreground">
                {product.pricePerKg ? formatPrice(product.pricePerKg) + '/kg' : 'Prix sur demande'}
              </p>
              {selectedWeight && (
                <p className="text-primary font-semibold mt-1">
                  {formatPrice(calculatePrice())} 
                  {product.saleMode === 'variable_weight' && (
                    <span className="text-xs text-muted-foreground ml-1">(estimatif)</span>
                  )}
                </p>
              )}
            </div>
          ) : (
            <p className="text-primary font-semibold mt-1">
              {formatPrice(product.basePrice)}
            </p>
          )}
        </div>

        {/* Sélecteur de poids */}
        {weightOptions.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Poids</label>
            <div className="flex flex-wrap gap-2">
              {weightOptions.map((weight) => (
                <button
                  key={weight}
                  onClick={() => setSelectedWeight(weight)}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    selectedWeight === weight
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-surface text-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {formatWeight(weight)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Options de découpe */}
        {product.cutOptions && product.cutOptions.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Découpe</label>
            <select
              value={selectedCut || ''}
              onChange={(e) => setSelectedCut(e.target.value || undefined)}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Standard</option>
              {product.cutOptions.map((cut) => (
                <option key={cut.id} value={cut.id}>
                  {cut.name}
                  {cut.priceModifier !== 0 && (
                    <span>
                      {' '}
                      ({cut.modifierType === 'percentage' ? '+' : ''}
                      {cut.priceModifier}{cut.modifierType === 'percentage' ? '%' : ` ${product.currency}`})
                    </span>
                  )}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Bouton ajouter */}
        <button
          onClick={handleAddToCart}
          disabled={!product.available}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          Ajouter au panier
        </button>

        {/* Plus d'infos */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <>
              Moins d'infos <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Plus d'infos <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>

        {/* Infos étendues */}
        {isExpanded && (
          <div className="pt-3 border-t space-y-2 text-xs text-muted-foreground">
            {product.origin && (
              <p><strong>Origine:</strong> {product.origin}</p>
            )}
            {product.storageInstructions && (
              <p><strong>Conservation:</strong> {product.storageInstructions}</p>
            )}
            {product.storageTemperature && (
              <p><strong>Température:</strong> {product.storageTemperature}°C</p>
            )}
            {product.preparationTime && (
              <p><strong>Préparation:</strong> ~{product.preparationTime} min</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
