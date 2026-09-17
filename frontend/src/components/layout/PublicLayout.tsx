import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/restaurants', label: 'Restaurants' },
];

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="20.5" r="1.3" />
      <circle cx="17.5" cy="20.5" r="1.3" />
    </svg>
  );
}

export function PublicLayout() {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-primary">
            <span className="text-xl">🥩</span> Bêtes &amp; Frais
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-soft text-primary-dark' : 'text-muted hover:text-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isStaff && (
              <Link
                to="/admin"
                className="rounded-lg px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10"
              >
                Espace admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/panier"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-text hover:bg-black/5"
              aria-label="Panier"
            >
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/compte/commandes" className="text-sm font-medium text-text hover:text-primary">
                  {user?.firstName}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-sm font-medium text-muted hover:text-danger"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/connexion"
                className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark md:inline-flex"
              >
                Se connecter
              </Link>
            )}

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-text hover:bg-black/5 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-surface px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-text hover:bg-black/5"
                >
                  {link.label}
                </Link>
              ))}
              {isStaff && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-accent">
                  Espace admin
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link to="/compte/commandes" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-text">
                    Mon compte
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate('/');
                    }}
                    className="rounded-lg px-3 py-2 text-left text-sm font-medium text-danger"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link to="/connexion" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-primary">
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface py-8 text-sm text-muted">
        <div className="mx-auto max-w-6xl px-4">
          <p className="font-semibold text-text">Bêtes &amp; Frais</p>
          <p className="mt-1">Commerce en ligne de produits animaux frais — Bénin.</p>
          <p className="mt-3 text-xs">
            Les montants liés au poids variable sont estimatifs jusqu'à validation du poids réel. Aucune commande
            n'est confirmée sans validation côté serveur.
          </p>
        </div>
      </footer>
    </div>
  );
}
