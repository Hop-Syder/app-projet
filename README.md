# BÊTES & FRAIS

Plateforme web de commerce de produits animaux - Bénin

## 🎯 Vision

Solution numérique professionnelle pour la commercialisation en ligne de produits animaux et alimentaires d'origine animale, conçue pour le marché béninois avec une expansion prévue en Afrique de l'Ouest.

## 📋 Fonctionnalités Clés

- **Catalogue produits** : Viande (bœuf, mouton, chèvre, porc), volailles, poissons, lapins
- **Vente au kg** : Gestion des poids variables avec montants estimatifs/finaux
- **Options de découpe** : Entier, morceaux, tranches fines/épaisses
- **Traçabilité** : Suivi des lots, dates de péremption, chaîne du froid
- **Livraison** : Zones configurables, créneaux horaires, suivi en temps réel
- **Paiement** : Mobile Money (MTN, Moov), carte, cash à la livraison
- **PWA** : Installation mobile, fonctionnement offline partiel

## 🏗️ Architecture Technique

### Stack

| Couche | Technologie |
|--------|-------------|
| Frontend Web/PWA | Next.js 14 + TypeScript + Tailwind CSS |
| Backend API | NestJS + TypeScript + REST/OpenAPI |
| Base de données | PostgreSQL + Prisma ORM |
| Mobile (Phase 3) | Flutter (Android/iOS) |
| Stockage fichiers | S3-compatible (Cloudflare R2 / AWS S3) |
| Hébergement | Vercel (frontend) + Cloud (backend) |

### Structure du Projet

```
/workspace
├── frontend/          # Next.js Web App + PWA
│   ├── src/
│   │   ├── app/       # Routes & pages
│   │   ├── components/# Composants UI
│   │   ├── lib/       # Utilities & hooks
│   │   └── styles/    # Tailwind & design tokens
│   └── public/
├── backend/           # NestJS API
│   ├── src/
│   │   ├── modules/   # Modules métier
│   │   ├── prisma/    # Schema & migrations
│   │   └── common/    # Guards, filters, pipes
│   └── test/
└── docs/              # Documentation & TDR
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configurer DATABASE_URL
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

L'API sera disponible sur `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📊 Modèle de Données

### Entités Principales

- **User** : Utilisateurs avec rôles (SUPER_ADMIN, ADMIN, MANAGER, PREPARATEUR, LIVREUR, CUSTOMER)
- **Product** : Produits avec prix, unités, options de découpe/conditionnement
- **Category** : Catégories hiérarchiques (Bœuf, Mouton, Volaille, etc.)
- **Order** : Commandes avec statuts, poids réels, livraison
- **InventoryItem** : Lots avec traçabilité (dates, quantités, statut)
- **DeliveryZone** : Zones de livraison avec frais et quartiers

### Règles Métier Importantes

| ID | Règle |
|----|-------|
| RB-01 | Le prix final est calculé côté backend |
| RB-02 | Le stock réel est validé côté backend |
| RB-04 | Toute variation de poids final est tracée |
| RB-06 | Le montant estimatif ≠ montant final (poids variable) |
| RB-08 | Toute modification admin est journalisée (audit logs) |

## 🔐 Sécurité & Conformité

### Protection des Données (Bénin)

- Loi n°2017-20 portant Code du numérique
- APDP (Autorité de Protection des Données Personnelles)
- Droits : accès, opposition, rectification, suppression

### Mesures Techniques

- HTTPS obligatoire
- JWT avec refresh tokens sécurisés
- RBAC (Role-Based Access Control)
- Rate limiting & protection CSRF/XSS
- Audit logs pour actions sensibles
- Backups réguliers

## 📱 Parcours Utilisateurs

### Client

```
Accueil → Recherche → Fiche produit → Panier → Checkout → Paiement → Suivi → Avis
```

### Préparation

```
Commande reçue → Découpe → Pesée réelle → Conditionnement → Prêt
```

### Livraison

```
Affectation → En tournée → Livrée (ou échec) → Notification
```

## 🗺️ Roadmap

| Phase | Contenu | Statut |
|-------|---------|--------|
| **MVP** | Catalogue, panier, commande, paiement, admin | ✅ En cours |
| **Phase 2** | Poids variable, découpe, lots, livreur, notifications | 📋 Planifié |
| **Phase 3** | Android, iOS, push, fidélité | 🔮 Futur |
| **Phase 4** | IA recommandations, assistant vocal, prévision | 🔮 Long terme |

## 🧪 Tests & QA

```bash
# Backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests

# Frontend
npm run test          # Vitest
npm run test:e2e      # Playwright
```

### Critères d'Acceptation

- [x] Responsive 320px → desktop
- [x] États loading/error/empty
- [x] Accessibilité (clavier, contrastes)
- [x] Sécurité (RBAC, validation backend)
- [x] Audit logs pour actions critiques

## 📄 Licence

Propriétaire - Tous droits réservés

---

**Document de référence** : Termes de Référence v1.0 - 16 septembre 2026
