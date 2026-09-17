# 🚀 Guide de Démarrage — Bêtes & Frais

## État Actuel du Projet (v1.0)

### ✅ Backend NestJS — Complet

**Modules implémentés:**
- ✅ Authentification JWT (login, register, guards, strategies)
- ✅ Utilisateurs (CRUD complet avec rôles RBAC)
- ✅ Produits (catalogue, options de découpe, conservation, poids variables)
- ✅ Catégories (hiérarchie parent/enfant)
- ✅ Commandes (flexible: viande seule, avec assaisonnement, accompagnement, repas complet)
- ✅ Restaurants (mode sur place, tables, QR code)
- ✅ Livraison (zones, adresses, géolocalisation)
- ✅ Stocks & Lots (traçabilité, dates de péremption)
- ✅ Prisma ORM configuré avec schéma complet

**Fichiers clés:**
```
backend/
├── prisma/schema.prisma        # Schéma de base de données complet
├── src/auth/                   # Authentification JWT
├── src/users/                  # Gestion utilisateurs
├── src/products/               # Catalogue produits
├── src/categories/             # Catégories hiérarchiques
├── src/orders/                 # Commandes flexibles
├── src/restaurants/            # Mode restaurant
├── src/delivery/               # Livraison
├── src/inventory/              # Stocks
└── .env                        # Variables d'environnement
```

### ✅ Frontend Next.js — Structure de Base

**Composants créés:**
- ✅ `ProductCard` — Carte produit avec sélecteur de poids et options de découpe
- ✅ `CartDrawer` — Panier dynamique avec gestion des poids variables
- ✅ Stores Zustand (panier, authentification)
- ✅ Types TypeScript complets
- ✅ Utilitaires (formatage prix, poids, dates)
- ✅ Client API

**Fichiers clés:**
```
frontend/
├── src/components/
│   ├── product-card.tsx        # Carte produit interactive
│   └── cart-drawer.tsx         # Panier utilisateur
├── src/stores/
│   ├── cart-store.ts           # État du panier (Zustand)
│   └── auth-store.ts           # État d'authentification
├── src/types/
│   └── index.ts                # Types TypeScript complets
├── src/lib/
│   ├── api.ts                  # Client API
│   └── utils.ts                # Utilitaires
└── .env.local                  # Configuration frontend
```

### ✅ Infrastructure Docker

**Services configurés:**
- ✅ PostgreSQL 16
- ✅ Backend NestJS
- ✅ Frontend Next.js
- ✅ Volumes persistants
- ✅ Health checks
- ✅ Variables d'environnement

---

## 🎯 Prochaines Étapes Immédiates

### 1. Lancer la Base de Données

```bash
cd /workspace/betes-frais

# Option A: Avec Docker Compose (recommandé)
docker-compose up -d postgres

# Attendre que la DB soit prête (environ 10 secondes)
docker-compose ps

# Option B: PostgreSQL local
# Si vous avez déjà PostgreSQL installé, configurez simplement .env
```

### 2. Initialiser la Base de Données

```bash
cd /workspace/betes-frais/backend

# Générer le client Prisma (déjà fait)
npx prisma generate

# Créer et appliquer les migrations
npx prisma migrate dev --name init

# (Optionnel) Ouvrir Prisma Studio pour visualiser les données
npx prisma studio
```

### 3. Lancer le Backend

```bash
cd /workspace/betes-frais/backend

# Installation des dépendances (si pas encore fait)
npm install

# Lancer en mode développement
npm run start:dev

# Le serveur sera disponible sur http://localhost:3001
# Swagger API: http://localhost:3001/api/docs
```

### 4. Lancer le Frontend

```bash
cd /workspace/betes-frais/frontend

# Installation des dépendances (si pas encore fait)
npm install

# Lancer en mode développement
npm run dev

# L'application sera disponible sur http://localhost:3000
```

### 5. Alternative: Tout Lancer avec Docker Compose

```bash
cd /workspace/betes-frais

# Lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

---

## 📝 Tâches Restantes à Développer

### Backend — À Compléter

1. **Seed Database** — Créer un script de seed pour peupler la DB avec:
   - Catégories (Bœuf, Mouton, Chèvre, Porc, Volailles, Poissons)
   - Produits exemples avec images
   - Options de découpe
   - Zones de livraison (Bénin)
   - Utilisateur admin par défaut

2. **Upload de Fichiers** — Implémenter le module uploads pour:
   - Images produits (Cloudflare R2 / AWS S3 / local)
   - Validation MIME, taille, dimensions
   - Génération de thumbnails

3. **Paiements** — Intégrer un provider de paiement:
   - Mobile Money (MTN, Moov)
   - Carte bancaire
   - Cash on delivery
   - Webhooks pour synchronisation

4. **Notifications** — Système de notifications:
   - Email (SendGrid, Resend)
   - SMS (Twilio, provider local)
   - Push (futur pour mobile)

5. **Tests** — Ajouter des tests:
   - Unitaires (services, calculs)
   - Integration (API endpoints)
   - E2E (flux complets)

### Frontend — À Développer

1. **Pages Principales:**
   - `/` — Accueil avec catégories, produits populaires
   - `/catalogue` — Liste produits avec filtres
   - `/produit/[slug]` — Fiche produit détaillée
   - `/panier` — Page panier (si pas drawer)
   - `/checkout` — Tunnel de commande
   - `/compte` — Espace client
   - `/restaurants` — Liste restaurants (mode restaurant)

2. **Composants Manquants:**
   - Header responsive avec navigation
   - Bottom navigation mobile
   - Search bar avec autocomplétion
   - Filtres bottom sheet
   - Formulaire de checkout
   - Suivi de commande
   - Dashboard admin

3. **PWA:**
   - manifest.json
   - Service worker
   - Offline strategy
   - Icônes et splash screen

4. **Design System:**
   - Configuration Tailwind complète
   - Composants shadcn/ui
   - Tokens de design (couleurs, typo)

---

## 🧪 Données de Test

Après avoir lancé les migrations, vous pouvez créer un premier utilisateur admin:

```typescript
// Via Prisma Studio ou script
{
  email: "admin@betesfrais.bj",
  password: "Admin123!", // hachée bien sûr
  firstName: "Admin",
  lastName: "Bêtes & Frais",
  role: "super_admin"
}
```

---

## 📊 Architecture des Commandes Flexibles

Le système supporte 4 modes de commande:

1. **Viande seule**
   ```json
   {
     "productId": "...",
     "weight": 1000,
     "cutOption": "morceaux"
   }
   ```

2. **Viande + assaisonnement**
   ```json
   {
     "productId": "...",
     "weight": 1000,
     "seasoningId": "...",
     "cutOption": "entier"
   }
   ```

3. **Viande + accompagnement**
   ```json
   {
     "productId": "...",
     "weight": 500,
     "accompanimentIds": ["riz", "legumes"]
   }
   ```

4. **Repas complet**
   ```json
   {
     "productId": "...",
     "weight": 750,
     "seasoningId": "...",
     "accompanimentIds": ["riz", "sauce"],
     "beverageId": "...",
     "extras": ["sauce_supplement"]
   }
   ```

---

## 🔐 Sécurité

- ✅ JWT avec refresh tokens
- ✅ RBAC (rôles: customer, restaurant_owner, staff, admin, super_admin)
- ✅ Validation Zod côté backend
- ✅ Protection CORS
- ✅ Rate limiting (à configurer)
- ✅ HTTPS (en production)

---

## 📞 Support

Pour toute question ou problème:
- Consulter le README.md principal
- Vérifier les logs Docker: `docker-compose logs -f [service]`
- Examiner la documentation API: http://localhost:3001/api/docs

---

**Projet généré automatiquement — Version 1.0**  
**Dernière mise à jour:** Septembre 2026
