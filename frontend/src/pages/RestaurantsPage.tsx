import React from 'react';
import { Link } from 'react-router-dom';
import { useRestaurants } from '../hooks/useRestaurant';


export const RestaurantsPage: React.FC = () => {
  const { data: restaurants, isLoading, error } = useRestaurants();

  if (isLoading) return <div style={styles.loading}>Chargement...</div>;
  if (error) return <div style={styles.error}>Erreur lors du chargement des restaurants</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Nos Restaurants</h1>
      {restaurants && restaurants.length === 0 ? (
        <p style={styles.empty}>Aucun restaurant disponible pour le moment.</p>
      ) : (
        <div style={styles.grid}>
          {restaurants?.map((restaurant) => (
            <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id} style={styles.cardLink}>
              <div style={styles.card}>
                {restaurant.imageUrl ? (
                  <img src={restaurant.imageUrl} alt={restaurant.name} style={styles.image} />
                ) : (
                  <div style={styles.placeholder}>🍽️</div>
                )}
                <div style={styles.cardContent}>
                  <h3 style={styles.name}>{restaurant.name}</h3>
                  {restaurant.cuisineType && (
                    <p style={styles.cuisine}>{restaurant.cuisineType}</p>
                  )}
                  <div style={styles.info}>
                    <span style={styles.rating}>
                      ⭐ {restaurant.rating?.toFixed(1) || 'N/A'} ({restaurant.totalReviews} avis)
                    </span>
                    <span style={styles.price}>{restaurant.priceRange || '$$'}</span>
                  </div>
                  <p style={styles.address}>📍 {restaurant.address}</p>
                  {!restaurant.isActive && (
                    <span style={styles.closed}>Fermé</span>
                  )}
                </div>
              </div>
            </Link>
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
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
  cuisine: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  rating: {
    color: '#ffb400',
    fontWeight: 'bold',
  },
  price: {
    color: '#666',
    fontSize: '0.9rem',
  },
  address: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  closed: {
    backgroundColor: '#ff4444',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    display: 'inline-block',
  },
};
