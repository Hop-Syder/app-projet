import React from 'react';

export const HomePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>🍔 FoodDelivery</h1>
        <p style={styles.subtitle}>Commandez vos plats préférés et faites-vous livrer à domicile !</p>
      </div>
      
      <div style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🚀</div>
          <h3>Livraison Rapide</h3>
          <p>Recevez votre commande en moins de 30 minutes</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🍽️</div>
          <h3>Restaurants Variés</h3>
          <p>Découvrez une large sélection de restaurants</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>💳</div>
          <h3>Paiement Sécurisé</h3>
          <p>Payez en toute sécurité par carte ou en espèces</p>
        </div>
      </div>

      <div style={styles.cta}>
        <h2>Prêt à commander ?</h2>
        <a href="/restaurants" style={styles.button}>Voir les restaurants</a>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
  },
  hero: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '4rem 1rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.25rem',
    opacity: 0.9,
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 1rem',
  },
  feature: {
    textAlign: 'center',
    padding: '2rem',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  cta: {
    backgroundColor: '#f5f5f5',
    padding: '4rem 1rem',
    textAlign: 'center',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginTop: '1rem',
    transition: 'background-color 0.2s',
  },
};
