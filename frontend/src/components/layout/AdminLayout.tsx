import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { to: '/admin', label: 'Tableau de bord', icon: '📊', end: true },
  { to: '/admin/commandes', label: 'Commandes', icon: '🧾' },
  { to: '/admin/produits', label: 'Produits', icon: '🥩' },
  { to: '/admin/categories', label: 'Catégories', icon: '🗂️' },
  { to: '/admin/stock', label: 'Stock & lots', icon: '📦' },
  { to: '/admin/livraison', label: 'Zones de livraison', icon: '🛵' },
  { to: '/admin/restaurants', label: 'Restaurants', icon: '🍽️' },
  { to: '/admin/avis', label: 'Avis clients', icon: '⭐' },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: '👥' },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <span aria-hidden>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background text-text">
      <aside className="hidden w-64 flex-col bg-primary-dark md:flex">
        <div className="px-5 py-5">
          <Link to="/" className="text-lg font-extrabold text-white">
            🥩 Bêtes &amp; Frais
          </Link>
          <p className="mt-0.5 text-xs text-white/60">Espace administration</p>
        </div>
        {nav}
        <div className="border-t border-white/10 px-4 py-4">
          <p className="text-sm font-semibold text-white">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-white/60">{user?.role}</p>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="mt-3 text-sm font-medium text-white/70 hover:text-white"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64 flex-col bg-primary-dark flex">
            {nav}
          </div>
          <button className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu" />
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-xl" aria-label="Ouvrir le menu">
            ☰
          </button>
          <Link to="/" className="font-bold text-primary">
            🥩 Bêtes &amp; Frais
          </Link>
          <Link to="/admin/utilisateurs" className="text-sm text-muted">
            {user?.firstName}
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
