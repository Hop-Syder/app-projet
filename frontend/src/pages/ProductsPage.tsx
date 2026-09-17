import React from 'react';
import { useProducts } from '../hooks/useProduct';


export const ProductsPage: React.FC = () => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) return <div style={styles.loading}>Chargement...</div>;
  if (error) return <div style={styles.error}>Erreur lors du chargement des produits</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Nos Produits</h1>
      {products && products.length === 0 ? (
        <p style={styles.empty}>Aucun produit disponible pour le moment.</p>
      ) : (
        <div style={styles.grid}>
          {products?.map((product) => (
            <div key={product.id} style={styles.card}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} style={styles.image} />
              ) : (
                <div style={styles.placeholder}>🍕</div>
              )}
              <div style={styles.cardContent}>
                <h3 style={styles.name}>{product.name}</h3>
                {product.description && (
                  <p style={styles.description}>{product.description}</p>
                )}
                <div style={styles.priceRow}>
                  <span style={styles.price}>{product.price.toFixed(2)} €</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span style={styles.originalPrice}>
                      {product.originalPrice.toFixed(2)} €
                    </span>
                  )}
                </div>
                {!product.isAvailable && (
                  <span style={styles.unavailable}>Indisponible</span>
                )}
                {product.isFeatured && (
                  <span style={styles.featured}>⭐ En vedette</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    color: '#ff6b35',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    color: '#666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '200px',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
  },
  cardContent: {
    padding: '1rem',
  },
  name: {
    fontSize: '1.25rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  description: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    lineHeight: '1.4',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  originalPrice: {
    fontSize: '1rem',
    color: '#999',
    textDecoration: 'line-through',
  },
  unavailable: {
    backgroundColor: '#999',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    display: 'inline-block',
  },
  featured: {
    backgroundColor: '#ffb400',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    display: 'inline-block',
    marginLeft: '0.5rem',
  },
};
