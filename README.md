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

## 🚀 Déploiement local

Cette section suffit à elle seule pour faire tourner toute la stack (base de données + API + frontend) sur votre machine, du clonage jusqu'à un compte admin fonctionnel.

### Prérequis

| Outil | Version | Vérifier |
|-------|---------|----------|
| Node.js | 20 ou plus | `node -v` |
| npm | fourni avec Node | `npm -v` |
| PostgreSQL | 14+ | via Docker (recommandé) ou une installation locale |
| Docker + Docker Compose | pour l'option base de données conteneurisée | `docker -v` |

Aucune autre dépendance (pas de Redis, pas de compte cloud) n'est nécessaire pour faire tourner le MVP en local.

### Vue d'ensemble

Trois processus tournent en parallèle, chacun dans son propre terminal :

1. **PostgreSQL** — port `5432`
2. **API backend (NestJS)** — port `3000`, exposée sous `http://localhost:3000/api`
3. **Frontend (Vite/React)** — port `5173`, exposé sous `http://localhost:5173`

### Étape 1 — Cloner et se placer sur la branche

```bash
git clone https://github.com/Hop-Syder/app-projet.git
cd app-projet
```

### Étape 2 — Base de données PostgreSQL

**Option A — Docker (recommandé, aucune configuration)**

```bash
docker compose up -d postgres
docker compose ps   # doit afficher "healthy" après quelques secondes
```

Cela crée une base `betes_frais` accessible via `postgresql://postgres:postgres@localhost:5432/betes_frais`, avec les données persistées dans un volume Docker nommé (`postgres_data`) qui survit aux redémarrages du conteneur.

**Option B — PostgreSQL installé localement**

Créez manuellement la base et adaptez `DATABASE_URL` à l'étape suivante :

```bash
sudo -u postgres psql -c "CREATE DATABASE betes_frais;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"   # ou un mot de passe de votre choix
```

### Étape 3 — Backend (API NestJS)

```bash
cd backend
npm install
cp .env.example .env
```

Variables du fichier `.env` (valeurs par défaut déjà correctes pour l'option Docker ci-dessus) :

| Variable | Rôle | Défaut |
|----------|------|--------|
| `DATABASE_URL` | Connexion PostgreSQL | `postgresql://postgres:postgres@localhost:5432/betes_frais?schema=public` |
| `JWT_SECRET` | Signature des tokens JWT | à changer en production |
| `JWT_EXPIRES_IN` | Durée de validité du token | `7d` |
| `PORT` | Port d'écoute de l'API | `3000` |
| `CORS_ORIGIN` | Origine autorisée à appeler l'API | `http://localhost:5173` |

Puis, toujours dans `backend/` :

```bash
npx prisma migrate dev      # crée les tables dans la base
npm run prisma:seed         # crée un compte admin, un client et des produits de démo
npm run start:dev           # démarre l'API en mode watch
```

Vous devez voir en fin de log `Bêtes & Frais API listening on http://localhost:3000/api`. Vérifiez rapidement :

```bash
curl http://localhost:3000/api/products
```

→ doit renvoyer un tableau JSON avec 4 produits de démonstration (bœuf, mouton, poulet, tilapia).

Comptes créés par le seed :

| Rôle | Email | Mot de passe |
|------|-------|---------------|
| Super admin | `admin@betesetfrais.bj` | `Admin123!` |
| Client | `client@betesetfrais.bj` | `Client123!` |

### Étape 4 — Frontend (ouvrir un second terminal)

```bash
cd frontend
npm install
cp .env.example .env.local   # optionnel : défaut déjà = http://localhost:3000/api
npm run dev
```

Ouvrez `http://localhost:5173` dans votre navigateur.

### Étape 5 — Vérifier que tout fonctionne

1. La page d'accueil affiche le catalogue avec les 4 produits de démo.
2. Connectez-vous sur `/connexion` avec `admin@betesetfrais.bj` / `Admin123!` → vous êtes redirigé vers `/admin` avec un tableau de bord.
3. Déconnectez-vous, reconnectez-vous avec `client@betesetfrais.bj` / `Client123!`, ajoutez un produit au panier depuis une fiche produit, allez sur `/panier` puis `/checkout` pour passer une commande.
4. Retournez sur `/admin/commandes` avec le compte admin : la commande passée à l'étape précédente doit apparaître.

### Commandes utiles

```bash
# Backend
npx prisma studio          # interface graphique pour explorer/éditer la base
npx prisma migrate reset   # réinitialise la base et rejoue les migrations (⚠️ efface les données)
npm run build               # build de production (nest build)
npm run test                # tests unitaires

# Frontend
npm run build                # build de production (tsc -b && vite build)
npm run preview              # sert le build de production en local
```

### Résolution de problèmes courants

| Symptôme | Cause probable | Solution |
|----------|-----------------|----------|
| `Error: P1001` au démarrage du backend | PostgreSQL n'est pas accessible | Vérifiez `docker compose ps` ou que votre PostgreSQL local tourne bien sur le port 5432 |
| Le catalogue reste vide | Le seed n'a pas été exécuté | `cd backend && npm run prisma:seed` |
| Erreur CORS dans la console du navigateur | `CORS_ORIGIN` du backend ne correspond pas à l'URL du frontend | Vérifiez `backend/.env` (`CORS_ORIGIN=http://localhost:5173`) et redémarrez l'API |
| `EADDRINUSE` sur le port 3000 ou 5173 | Un processus précédent tourne encore | `lsof -i :3000` (ou `:5173`) puis `kill <PID>`, ou changez `PORT` / le port Vite |
| 401/403 en boucle après connexion | Jeton expiré ou `JWT_SECRET` changé après coup | Déconnectez-vous (efface le `localStorage`) puis reconnectez-vous |

### Arrêter la stack

```bash
# Ctrl+C dans les terminaux backend et frontend, puis :
docker compose down          # arrête PostgreSQL (les données restent dans le volume)
docker compose down -v       # arrête PostgreSQL et supprime aussi les données
```

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
