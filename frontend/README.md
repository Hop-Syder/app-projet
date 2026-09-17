# Frontend - FoodDelivery App

Application React + Vite pour la plateforme de livraison de nourriture.

## Installation

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

L'application sera disponible sur http://localhost:5173

## Structure du projet

```
src/
├── components/     # Composants réutilisables (Navbar, etc.)
├── pages/          # Pages de l'application
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── RestaurantsPage.tsx
│   └── ProductsPage.tsx
├── services/       # Services API
│   ├── api.ts
│   ├── auth.service.ts
│   ├── restaurant.service.ts
│   ├── product.service.ts
│   └── order.service.ts
├── hooks/          # Hooks React personnalisés
│   ├── useAuth.ts
│   ├── useRestaurant.ts
│   └── useProduct.ts
├── types/          # Types TypeScript
│   └── index.ts
└── utils/          # Utilitaires
```

## Fonctionnalités

- ✅ Authentification (login/register)
- ✅ Navigation avec React Router
- ✅ Gestion d'état avec TanStack Query
- ✅ Pages: Accueil, Restaurants, Produits, Login, Register
- ✅ Services API configurés avec Axios
- ✅ Types TypeScript basés sur le schéma Prisma

## Variables d'environnement

Créez un fichier `.env` à la racine:

```
VITE_API_URL=http://localhost:3000/api
```

## Build

```bash
npm run build
```

## Technologies

- React 19
- Vite 8
- TypeScript
- React Router DOM
- TanStack Query
- Axios
