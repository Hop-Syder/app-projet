import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🍔 FoodDelivery
        </Link>
        <div style={styles.links}>
          <Link to="/restaurants" style={styles.link}>Restaurants</Link>
          <Link to="/products" style={styles.link}>Produits</Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" style={styles.link}>Commandes</Link>
              <Link to="/profile" style={styles.link}>Profil</Link>
              <button onClick={onLogout} style={styles.button}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Connexion</Link>
              <Link to="/register" style={styles.link}>Inscription</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    backgroundColor: '#ff6b35',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'opacity 0.2s',
  },
  button: {
    backgroundColor: 'white',
    color: '#ff6b35',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
