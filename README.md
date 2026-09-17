# BÊTES & FRAIS

Plateforme web de commerce de produits animaux — Bénin.

## 🎯 Vision

Solution numérique professionnelle pour la commercialisation en ligne de produits animaux et alimentaires d'origine animale, conçue pour le marché béninois avec une expansion prévue en Afrique de l'Ouest. Voir `docs/TDR_BETES_FRAIS_v1.1.md` et `TDR_BETES_FRAIS_v1.1.md` pour le cahier des charges complet.

## 📋 Fonctionnalités

### Front-office (client)
- Catalogue avec recherche et filtres par catégorie
- Fiche produit : sélection du poids (vente au kg), de la découpe et du conditionnement
- Panier, checkout (adresse, zone de livraison, mode de paiement), suivi de commande
- Compte client : adresses enregistrées, historique de commandes
- Liste des restaurants partenaires

### Back-office (admin) — `/admin`
- Tableau de bord avec KPIs (commandes, revenu, stock faible)
- Gestion des produits (CRUD, options de découpe/conditionnement)
- Gestion des catégories
- Gestion des commandes : changement de statut, saisie du poids réel après pesée
- Gestion du stock et des lots (traçabilité, péremption)
- Gestion des zones de livraison
- Gestion des restaurants partenaires
- Modération des avis clients
- Gestion des utilisateurs et des rôles (RBAC)

## 🏗️ Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend Web | Vite + React 19 + TypeScript + React Router + Tailwind CSS v4 |
| Data fetching | Axios + TanStack Query, contextes React (auth, panier) |
| Backend API | NestJS + TypeScript + REST |
| Base de données | PostgreSQL + Prisma ORM |
| Auth | JWT (passport-jwt) + RBAC (guards + `@Roles`) |
| Sécurité | Helmet, CORS, rate limiting (`@nestjs/throttler`), validation globale |

> Le TDR cible Next.js pour le frontend (SSR/SEO). Le frontend actuel est un SPA Vite/React déjà entamé avant cette session ; le migrer vers Next.js est un chantier à part entière, non fait ici pour ne pas perdre le travail existant. À prévoir si le SEO devient prioritaire.

### Structure du projet

```
.
├── backend/     # API NestJS (voir backend/src pour la liste des modules)
├── frontend/    # SPA Vite + React (catalogue, panier, checkout, admin)
├── docs/        # TDR et documentation
└── docker-compose.yml   # PostgreSQL pour le développement local
```

## 🚀 Démarrage rapide

### Prérequis
- Node.js 20+
- PostgreSQL 14+ (ou Docker)
- npm

### 1. Base de données

```bash
docker compose up -d postgres
# ou utilisez un PostgreSQL local et adaptez DATABASE_URL
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run prisma:seed   # crée un compte admin, un client, des produits de démo
npm run start:dev
```

L'API est disponible sur `http://localhost:3000/api`.

Comptes créés par le seed :

| Rôle | Email | Mot de passe |
|------|-------|---------------|
| Super admin | `admin@betesetfrais.bj` | `Admin123!` |
| Client | `client@betesetfrais.bj` | `Client123!` |

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # optionnel, défaut = http://localhost:3000/api
npm run dev
```

L'application est disponible sur `http://localhost:5173`. Connectez-vous avec le compte admin ci-dessus puis ouvrez `/admin` pour accéder au back-office.

## 📊 Modèle de données

Voir `backend/prisma/schema.prisma` pour le schéma complet. Entités principales :

- **User** (rôles : SUPER_ADMIN, ADMIN, MANAGER, PREPARATEUR, LIVREUR, CUSTOMER, RESTAURANT_OWNER), **CustomerProfile**
- **Product**, **Category**, **Animal**, **CutOption**, **PackagingOption**, **InventoryItem**
- **Cart**, **CartItem**, **Order**, **OrderItem**, **Payment**
- **Address**, **DeliveryZone**, **Delivery**
- **Restaurant**, **Review**, **Coupon**, **Notification**, **AuditLog**

### Règles métier appliquées

| ID | Règle | Où |
|----|-------|----|
| RB-01 | Le prix final est calculé côté backend | `cart.service.ts`, `orders.service.ts` |
| RB-02 / RB-03 | Disponibilité produit revalidée à l'ajout au panier / à la commande | `cart.service.ts`, `orders.service.ts` |
| RB-04 | Le poids réel et le montant final sont saisis et tracés séparément de l'estimation | `orders.service.updateWeight` |
| RB-06 | `estimatedAmount` distingue explicitement montant estimatif et final | schéma `Order` |
| RB-11 | Toute opération sensible exige authentification + rôle (guards `JwtAuthGuard` + `RolesGuard`) | tous les contrôleurs admin |
| RB-13 | Le frontend consomme l'API, jamais source de vérité (prix/stock recalculés serveur) | services frontend |

## 🔐 Sécurité

- JWT + RBAC appliqués de façon cohérente sur toutes les routes sensibles (guard `RolesGuard` explicitement branché partout où `@Roles` est utilisé)
- Un client ne peut consulter/annuler que ses propres commandes ; le staff peut tout voir
- Aucun hash de mot de passe n'est jamais renvoyé par l'API (sélection explicite des champs utilisateur)
- Helmet (headers de sécurité), CORS restreint à l'origine du frontend, rate limiting global
- Validation des payloads (`class-validator`) sur les endpoints d'authentification

Ce qui reste à durcir avant une mise en production (voir TDR §14/15) : intégration réelle d'un fournisseur Mobile Money (le module `payments` gère aujourd'hui l'espèce et une confirmation manuelle par le staff), refresh tokens, tableau réglementaire versionné (produits d'origine animale), politique de confidentialité.

## 🗺️ Périmètre couvert vs TDR

Cette session a livré le **Phase 1 — MVP** du TDR (catalogue, fiche produit, panier, compte, adresse, commande, paiement basique, livraison de base, administration, stock basique) plus une bonne partie de la Phase 2 (poids variable, découpe, lots, avis).

Non couvert dans cette session (Phase 1B / 2+ du TDR) : constructeur de repas multi-étapes (viande + assaisonnement + accompagnement + boisson), carte de livraison interactive avec géolocalisation, créneaux de livraison programmée avec verrouillage transactionnel, PWA (manifest/service worker), application Flutter, notifications push/SMS, IA de recommandation.

## 🧪 Vérifications effectuées

- `npx prisma validate` / `migrate dev` contre une vraie base PostgreSQL
- `npm run build` backend (NestJS/TypeScript) et frontend (`tsc -b && vite build`) sans erreur
- Parcours bout en bout testé dans un navigateur (Playwright) : catalogue → fiche produit → connexion admin → création produit → commandes admin → connexion client → panier → checkout ; contrôle RBAC (403 pour un client sur les routes admin) ; contraste clair/sombre

## 📄 Licence

Propriétaire — tous droits réservés.

---

**Document de référence** : TDR v1.0/v1.1 — 16 septembre 2026.
