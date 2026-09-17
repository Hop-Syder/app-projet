import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isVariableWeight = product.saleMode === 'variable_weight' || product.saleMode === 'per_kg';

  return (
    <Link href={`/produits/${product.slug}`} className="product-card block">
      <div className="relative aspect-square bg-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Pas d&apos;image
          </div>
        )}
        
        {product.availability === 'unavailable' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Indisponible
            </span>
          </div>
        )}
        
        {isVariableWeight && (
          <div className="absolute top-2 right-2 bg-[#C8943D] text-white px-2 py-1 rounded text-xs font-medium">
            Poids variable
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 truncate">{product.category.name}</p>
        
        <div className="mt-2 flex items-baseline gap-2">
          {product.pricePerKg ? (
            <>
              <span className="text-lg font-bold text-[#176B52]">
                {formatPrice(product.pricePerKg)}
              </span>
              <span className="text-xs text-gray-500">/kg</span>
            </>
          ) : (
            <span className="text-lg font-bold text-[#176B52]">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>
        
        {isVariableWeight && (
          <p className="text-xs text-gray-500 mt-1">
            Montant estimatif - ajusté au poids réel
          </p>
        )}
      </div>
    </Link>
  );
}
