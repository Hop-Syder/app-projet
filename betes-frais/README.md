# 🥩 Bêtes & Frais — Plateforme de Commerce de Produits Animaux

**Version:** 1.0  
**Stack:** Next.js 14 + NestJS + PostgreSQL + Prisma + Flutter (futur)  
**Pays cible:** Bénin  
**Design:** Mobile-first, PWA, UX 2026

---

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Démarrage Rapide](#-démarrage-rapide)
- [Structure du Projet](#-structure-du-projet)
- [Commandes Utiles](#-commandes-utiles)
- [API Documentation](#-documentation-api)
- [Développement](#-développement)
- [Déploiement](#-déploiement)

---

## ✨ Fonctionnalités

### Frontend Client
- 🏠 **Accueil moderne** avec catégories, produits populaires et promotions
- 🔍 **Recherche intelligente** avec autocomplétion et suggestions
- 🛒 **Catalogue complet** avec filtres avancés (animal, prix, découpe, disponibilité)
- 📄 **Fiches produits détaillées** (poids, origine, conservation, nutrition)
- ⚖️ **Gestion des poids variables** (montant estimatif vs final)
- 🎯 **Commande flexible**:
  - Viande seule
  - Viande + assaisonnement/préparation
  - Viande + accompagnement
  - Repas complet personnalisé
- 🍽️ **Mode Restaurant**:
  - Consultation des établissements partenaires
  - Commande sur place (table/QR code)
  - À emporter
  - Livraison géolocalisée
- 📍 **Livraison avancée**:
  - Localisation sur carte
  - Choix de créneaux horaires
  - Suivi en temps réel
  - Instructions personnalisées
- 👤 **Compte client** (historique, adresses, favoris, avis)
- 📱 **PWA installable** avec mode offline partiel

### Backoffice Administration
- 📊 **Dashboard opérationnel** avec KPIs
- 📦 **Gestion complète des produits** (catalogue, stocks, lots, dates)
- 🏷️ **Gestion des catégories** hiérarchiques
- 🐄 **Suivi des animaux et lots** (traçabilité)
- ⚖️ **Règles de poids et prix** configurables
- 📝 **Gestion des commandes** (statuts, pesée réelle, ajustements)
- 🔪 **Options de découpe** et conditionnement
- 🚚 **Zones de livraison** et frais configurables
- 👥 **Gestion des clients** et historiques
- 💳 **Suivi des paiements** et remboursements
- 🏪 **Gestion des restaurants** partenaires (mode sur place)
- 📢 **Promotions et codes promo**
- ⭐ **Avis et modération**
- 🔐 **RBAC complet** (rôles, permissions, audit logs)

---

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Frontend      │ HTTP │    Backend       │ SQL  │   PostgreSQL    │
│   Next.js 14    │◄────►│    NestJS        │◄────►│   + Prisma ORM  │
│   PWA           │ REST │    API REST      │      │                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌──────────────────┐
│   Storage S3    │      │   Redis (cache)  │
│   (Images)      │      │   (optionnel)    │
└─────────────────┘      └──────────────────┘
```

### Technologies

| Couche | Technologie |
|--------|-------------|
| Frontend Web | Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui |
| State Management | Zustand, TanStack Query |
| Forms | React Hook Form, Zod |
| Backend API | NestJS, TypeScript, REST/OpenAPI |
| Base de données | PostgreSQL 16, Prisma ORM |
| Stockage fichiers | S3-compatible (Cloudflare R2 / AWS S3) |
| Conteneurisation | Docker, Docker Compose |
| Mobile (futur) | Flutter (Android/iOS) |

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- npm ou pnpm
- Docker & Docker Compose (recommandé)
- PostgreSQL 16 (si développement local sans Docker)

### Option 1: Avec Docker (Recommandé)

```bash
# Cloner le projet
cd betes-frais

# Lancer tous les services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

🌐 **Accès:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger API: http://localhost:3001/api/docs
- PostgreSQL: localhost:5432

### Option 2: Développement Local

#### 1. Base de données

```bash
# Lancer PostgreSQL avec Docker
docker run -d \
  --name betes_frais_db \
  -e POSTGRES_USER=betefrais_user \
  -e POSTGRES_PASSWORD=BetesFraisPass2026! \
  -e POSTGRES_DB=betes_frais_db \
  -p 5432:5432 \
  postgres:16-alpine
```

#### 2. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier .env
cp .env.example .env

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# Lancer le serveur
npm run start:dev
```

#### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Copier le fichier .env.local
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

---

## 📁 Structure du Projet

```
betes-frais/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── main.ts            # Point d'entrée
│   │   ├── app.module.ts      # Module principal
│   │   ├── common/            # Guards, filters, interceptors, decorators
│   │   ├── config/            # Configuration
│   │   ├── prisma/            # Service Prisma
│   │   ├── auth/              # Authentification JWT
│   │   ├── users/             # Gestion utilisateurs
│   │   ├── products/          # Catalogue produits
│   │   ├── categories/        # Catégories hiérarchiques
│   │   ├── orders/            # Commandes flexibles
│   │   ├── restaurants/       # Mode restaurant
│   │   ├── delivery/          # Livraison & zones
│   │   ├── inventory/         # Stocks & lots
│   │   └── uploads/           # Gestion fichiers
│   ├── prisma/
│   │   └── schema.prisma      # Schéma de base de données
│   ├── test/                  # Tests
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Application Next.js
│   ├── src/
│   │   ├── app/               # Routes & pages (App Router)
│   │   ├── components/        # Composants UI réutilisables
│   │   ├── lib/               # Utilitaires, API client
│   │   ├── stores/            # Zustand stores
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # Types TypeScript
│   │   └── styles/            # Styles globaux
│   ├── public/                # Assets statiques
│   │   ├── icons/             # Icônes PWA
│   │   └── images/            # Images
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml          # Orchestration Docker
├── README.md                   # Ce fichier
└── TDR_BETES_FRAIS_v1.1.md    # Termes de Référence complets
```

---

## 🛠️ Commandes Utiles

### Backend

```bash
cd backend

# Installation
npm install

# Développement
npm run start:dev

# Build production
npm run build

# Tests
npm run test
npm run test:e2e

# Prisma
npx prisma generate
npx prisma migrate dev
npx prisma migrate deploy
npx prisma studio
```

### Frontend

```bash
cd frontend

# Installation
npm install

# Développement
npm run dev

# Build production
npm run build
npm run start

# Linting
npm run lint
```

### Docker

```bash
# Lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Rebuild
docker-compose up -d --build

# Reset complet
docker-compose down -v && docker-compose up -d
```

---

## 📚 Documentation API

Une fois le backend lancé, accédez à:

- **Swagger UI:** http://localhost:3001/api/docs
- **OpenAPI JSON:** http://localhost:3001/api/docs-json

### Endpoints Principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Liste des produits (filtres, pagination) |
| GET | `/api/products/:slug` | Détail d'un produit |
| GET | `/api/categories` | Arborescence des catégories |
| POST | `/api/auth/register` | Inscription client |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/orders` | Historique commandes (auth requis) |
| POST | `/api/orders` | Créer une commande |
| GET | `/api/restaurants` | Liste des restaurants |
| POST | `/api/delivery/calculate` | Calcul frais livraison |

---

## 💻 Développement

### Ajouter un nouveau module backend

```bash
cd backend
nest g resource modules/nom-module
```

### Ajouter un composant frontend

```bash
cd frontend
# Créer dans src/components/
```

### Bonnes pratiques

- ✅ Validation Zod côté frontend et backend
- ✅ Typage TypeScript strict
- ✅ Tests unitaires pour la logique métier critique
- ✅ Logs structurés
- ✅ Gestion des erreurs centralisée
- ✅ RBAC pour toutes les routes admin

---

## 🚢 Déploiement

### Production Checklist

- [ ] Variables d'environnement de production configurées
- [ ] Secrets JWT changés
- [ ] HTTPS activé
- [ ] Base de données sauvegardée régulièrement
- [ ] Monitoring mis en place
- [ ] Logs centralisés
- [ ] Rate limiting activé
- [ ] CORS configuré correctement
- [ ] Validation réglementaire effectuée (Bénin)

### Hébergement Recommandé

| Service | Option |
|---------|--------|
| Frontend | Vercel / Netlify / Cloud Run |
| Backend | Cloud Run / Railway / Render / EC2 |
| Database | Supabase / Neon / RDS |
| Storage | Cloudflare R2 / AWS S3 |
| CDN | Cloudflare |

---

## 📞 Support & Contact

Pour toute question concernant ce projet:

- 📧 Email: support@betesfrais.bj (à configurer)
- 📄 TDR: Voir `TDR_BETES_FRAIS_v1.1.md`

---

## 📝 Licence

Propriétaire — Tous droits réservés © 2026 Bêtes & Frais

---

**Document généré automatiquement — Version 1.0**
