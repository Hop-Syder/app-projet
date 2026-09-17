'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User, Utensils } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/catalogue', icon: Search, label: 'Catalogue' },
  { href: '/restaurants', icon: Utensils, label: 'Restaurants' },
  { href: '/panier', icon: ShoppingCart, label: 'Panier' },
  { href: '/compte', icon: User, label: 'Compte' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
