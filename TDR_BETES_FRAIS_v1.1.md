# TERMES DE RÉFÉRENCE — BÊTES & FRAIS v1.1
## Plateforme WebApp de Commerce de Produits Animaux

**Design utilisateur 2026 • Mobile-first • PWA • Android/iOS • Backend métier sécurisé**

- **Pays prioritaire :** Bénin
- **Périmètre initial :** Web App + PWA
- **Évolution :** Android + iOS via Flutter
- **Stack cible :** Next.js / NestJS / PostgreSQL / Prisma
- **Version :** 1.1 — Mise à jour fonctionnelle (parcours de commande flexible + mode restaurant)
- **Date de référence :** 16 septembre 2026

---

## Sommaire opérationnel

| Ref. | Bloc |
|------|------|
| 01 | Vision, contexte et problématique |
| 02 | Objectifs et proposition de valeur |
| 03 | Périmètre fonctionnel |
| 04 | Utilisateurs et personas |
| 05 | User journeys et parcours clés **(MIS À JOUR)** |
| 06 | Principes UX/UI 2026 |
| 07 | Design system et composants |
| 08 | Responsive & mobile-first |
| 09 | Spécifications fonctionnelles détaillées **(MIS À JOUR)** |
| 10 | Règles métier |
| 11 | Architecture fonctionnelle et technique **(MIS À JOUR)** |
| 12 | Données, stockage et API **(MIS À JOUR)** |
| 13 | PWA, Android et iOS |
| 14 | Sécurité et protection des données |
| 15 | Réglementation au Bénin — cadre de vérification |
| 16 | SEO, performance et analytics |
| 17 | Tests, QA et critères d'acceptation |
| 18 | DevOps, CI/CD, déploiement et maintenance |
| 19 | Roadmap, budget, risques |
| 20 | Checklist de mise en production |

**Principe directeur :** Le client doit pouvoir « découvrir → rechercher → comprendre → choisir → personnaliser → commander → payer → suivre → recevoir → évaluer » avec le minimum d'étapes, sans ambiguïté sur le produit, le prix ou la livraison. **Aucune option obligatoire inutile.**

---

## 01 — Vision, contexte et problématique

### 1.1 Contexte
Le projet vise la création d'une solution numérique professionnelle de commercialisation en ligne de produits animaux et alimentaires d'origine animale, prioritairement pour le marché béninois et, à moyen terme, pour un déploiement progressif dans d'autres pays d'Afrique de l'Ouest.

Le catalogue doit couvrir plusieurs familles : viande de bœuf, mouton, chèvre, porc, lapin, volailles, poissons, autres produits autorisés et, sous réserve de conformité réglementaire, animaux vivants.

### 1.2 Problématique
Le commerce de produits animaux impose des contraintes particulières : diversité des unités de vente, poids variable, choix de découpe, stock périssable, traçabilité, conservation, chaîne du froid, livraison, paiement et conformité réglementaire. Une interface e-commerce classique n'est donc pas suffisante : le produit doit être compréhensible, mesurable et traçable avant la confirmation de commande.

De plus, les habitudes de consommation varient : certains clients souhaitent acheter uniquement de la viande, d'autres veulent un repas complet prêt à consommer, et d'autres encore souhaitent commander depuis un restaurant physique. La plateforme doit supporter cette flexibilité sans complexifier le parcours.

### 1.3 Vision produit
Construire une expérience proche d'un commerce moderne : visuelle, rassurante, rapide, simple sur smartphone, mais suffisamment robuste côté administration pour gérer les opérations réelles de préparation, découpe, pesée, conditionnement et livraison.

**Nouvelle orientation :** Un système de commande flexible qui s'adapte aux besoins du client, du simple achat de viande au repas complet en passant par le mode restaurant.

### 1.4 Principes non négociables
- Backend + PostgreSQL = source de vérité.
- Aucune commande ni aucun paiement ne sont considérés confirmés sur la seule base du frontend ou du mode hors-ligne.
- Les frais de livraison ne sont pas cachés.
- Les montants liés au poids variable sont explicitement présentés comme estimatifs jusqu'à validation du poids réel.
- Une exigence réglementaire n'est pas présentée comme obligatoire sans source et date de vérification.
- L'interface privilégie la compréhension et la vitesse plutôt que la densité fonctionnelle.
- **Aucune étape obligatoire inutile dans le parcours de commande.**

---

## 02 — Objectifs et proposition de valeur

### 2.1 Objectif principal
Permettre à un client de découvrir, rechercher, comprendre, choisir, personnaliser, commander, payer, suivre et évaluer des produits animaux avec une expérience numérique simple et fiable, **en construisant uniquement ce dont il a besoin**.

### 2.2 Objectifs utilisateurs

| Objectif | Résultat attendu |
|----------|------------------|
| Trouver vite | Recherche, catégories, filtres et suggestions accessibles immédiatement. |
| Comprendre | Prix, unité, poids, origine, conservation, découpe et disponibilité lisibles. |
| Commander sans friction | Panier clair et checkout court, options facultatives clairement identifiées. |
| Savoir ce qui se passe | Statuts de commande et notifications compréhensibles. |
| Être rassuré | Informations qualité, hygiène, conservation et provenance présentées sans surcharge. |
| Être autonome | Compte client simple, réutilisation des adresses/favoris et historique. |
| Personnaliser librement | Construire son panier : viande seule, avec assaisonnement, avec accompagnement, ou repas complet. |
| Consommer où il veut | Sur place (restaurant), à emporter, ou livraison géolocalisée. |

### 2.3 Proposition de valeur
Une place de marché / boutique digitale orientée produits animaux, conçue pour rendre l'achat plus transparent : le client sait ce qu'il achète, à quelle unité, à quel prix, dans quelles conditions il sera préparé et livré. **Le client compose uniquement ce qu'il souhaite, sans étapes obligatoires inutiles.**

---

## 03 — Périmètre fonctionnel

### 3.1 Front-office
- Accueil
- Catalogue et catégories
- Recherche intelligente
- Filtres et tri
- Fiches produits
- **Personnalisation flexible : viande seule, viande + assaisonnement, viande + accompagnement, repas complet**
- Panier
- Checkout
- **Modes de consommation : Sur place / À emporter / Livraison**
- **Mode restaurant : consultation d'établissement, association table/espace, QR code**
- **Livraison géolocalisée : carte, point précis, créneau, estimation**
- Compte client
- Adresses
- Favoris
- Suivi de commande
- Notifications
- Avis et notation
- Promotions
- Aide / support
- Mentions légales et politique de confidentialité

### 3.2 Back-office
- Dashboard opérationnel
- Gestion produits et catégories
- Gestion animaux / lots
- Gestion prix et règles de poids
- Gestion stocks et lots
- Gestion commandes et pesée réelle
- Gestion découpe
- Gestion conditionnement et conservation
- **Gestion restaurants, tables, espaces**
- **Gestion assaisonnements, préparations, accompagnements, boissons, extras**
- Gestion livraisons et zones
- Gestion clients
- Gestion paiements / remboursements
- Gestion promotions
- Gestion avis / modération
- Notifications
- Rapports
- Utilisateurs et rôles RBAC
- Audit logs
- Paramètres

### 3.3 Hors périmètre initial / phases ultérieures
Les applications natives Android/iOS, la fidélité avancée, les recommandations avancées, la prévision de demande et les assistants IA complets sont positionnés en phases ultérieures selon le backlog validé.

---

## 04 — Utilisateurs et personas

| Persona | Besoins principaux |
|---------|-------------------|
| P01 — Client urbain | Achète pour le foyer. Utilise principalement smartphone. Veut comparer, comprendre le prix et être livré sans appels inutiles. |
| P02 — Client professionnel | Restaurant, traiteur, maquis ou commerce. Besoin de récurrence, quantité, facturation et visibilité sur les stocks/disponibilités. |
| P03 — Préparateur | Gère découpe, pesée, conditionnement, disponibilité et transmission des informations réelles. |
| P04 — Gestionnaire stock | Suit lots, stock disponible/réservé/vendu/perdu/ajusté, dates et rotation des produits périssables. |
| P05 — Responsable commandes | Valide les commandes, gère statuts, poids réels, montant final et coordination livraison. |
| P06 — Livreur | Interface ultra-simple : tournée, client, téléphone, adresse, commande, statut de livraison. |
| P07 — Administrateur | Pilote catalogue, prix, opérations, utilisateurs, conformité documentaire et reporting. |
| P08 — Super Admin | Contrôle global, rôles, sécurité, audit et paramètres sensibles. |
| **P09 — Gérant restaurant** | **Gère menu, tables, espaces, commandes sur place, association QR code.** |
| **P10 — Client restaurant** | **Consulte menu sur place, commande via QR code, choisit consommation sur place.** |

---

## 05 — User journeys et parcours clés **(MIS À JOUR)**

### 5.1 Parcours achat standard
Accueil → recherche/catégorie → liste produits → fiche produit → options → ajout panier → adresse → livraison → créneau → récapitulatif → paiement → confirmation → préparation → livraison → avis.

### 5.2 Parcours produit au kilogramme
Fiche produit → affichage « prix/kg » → sélection d'un poids (ex. 500 g, 1 kg, 1,5 kg) → calcul instantané du sous-total → contrôle du minimum/maximum → panier.

### 5.3 Parcours poids variable
Commande d'un poids souhaité → affichage du montant estimatif → préparation/découpe → saisie du poids réel par le back-office → calcul du montant final → règle de tolérance → validation éventuelle du client → solde / remboursement → facture mise à jour → audit.

### 5.4 Parcours livraison
Commande confirmée → préparation → découpe → conditionnement → prête → affectation livreur → en livraison → livrée ou échec → notification et journalisation.

### 5.5 Parcours administration produit
Créer brouillon → renseigner caractéristiques → ajouter médias → définir unité/poids/prix → options de découpe → conservation → stock → publier → vérifier rendu client.

### 5.6 **NOUVEAU — Parcours de commande flexible**

#### 5.6.1 Viande seule
Sélectionner une viande → définir quantité/poids → type de découpe (optionnel) → ajouter au panier → choisir mode de consommation (retrait / sur place / livraison) → checkout → confirmation.

#### 5.6.2 Viande + assaisonnement / préparation
Sélectionner une viande → définir quantité/poids → choisir assaisonnement/préparation (si disponible, **facultatif**) → ajouter au panier → choisir mode de consommation → checkout → confirmation.

#### 5.6.3 Viande + accompagnement
Sélectionner une viande → définir quantité/poids → ajouter accompagnement(s) : riz, pâte rouge, pâte blanche, frites, légumes, etc. (**facultatif**) → ajouter au panier → choisir mode de consommation → checkout → confirmation.

#### 5.6.4 Repas personnalisé complet
Sélectionner une viande → définir quantité/poids → choisir assaisonnement/préparation (**facultatif**) → ajouter accompagnement(s) (**facultatif**) → ajouter boisson(s) (**facultatif**) → ajouter sauces/extras (**facultatif**) → ajouter au panier → choisir mode de consommation → checkout → confirmation.

**Principe UX :** Aucune option n'est obligatoire sauf la viande elle-même. Le client construit uniquement ce dont il a besoin.

### 5.7 **NOUVEAU — Parcours mode restaurant**

#### 5.7.1 Consultation d'un restaurant
Accès restaurant (via liste, recherche ou QR code) → consultation du menu → sélection de la viande → ajout options facultatives (assaisonnement, accompagnement, boisson, extras) → choix du mode de consommation :
- **Sur place** → association à une table/espace (via QR code, identifiant ou sélection manuelle)
- **À emporter** → retrait au comptoir
- **Livraison** → géolocalisation, adresse, créneau, estimation

#### 5.7.2 Commande via QR code
Scan QR code sur table → ouverture directe du menu du restaurant → pré-remplissage table/espace → sélection produits → ajout options → mode de consommation pré-sélectionné « Sur place » → panier → paiement → confirmation.

### 5.8 **NOUVEAU — Parcours livraison géolocalisée**
Choix du mode « Livraison » → sélection ou création d'adresse → localisation sur carte (intégration map) → ajustement point précis (pin drop) → instructions de livraison (optionnel) → sélection date/heure ou créneau → **estimation du temps de livraison affichée** → récapitulatif dynamique (prix options + frais livraison + total) → paiement → confirmation immédiate → suivi du statut.

---

## 06 — Principes UX/UI 2026

### 6.1 Direction artistique proposée

| Dimension | Règle 2026 |
|-----------|------------|
| Positionnement visuel | Marché frais moderne : propre, humain, premium accessible, jamais « boucherie sombre ». |
| Fond | Priorité aux surfaces claires et légèrement chaudes ; éviter les fonds noirs dominants. |
| Couleur primaire | Vert profond naturel pour les actions et marqueurs de confiance. |
| Couleur d'accent | Terracotta / rouge alimentaire pour alertes, disponibilité critique ou actions secondaires ; usage parcimonieux. |
| Accent premium | Doré discret pour éléments de valeur ou labels, jamais comme couleur dominante. |
| Photographie | Images produit nettes, lumineuses, cadrage cohérent ; montrer le produit avant les décorations. |
| Style des cartes | Rayons modérés 12–16 px, bordures très légères, ombres faibles. |
| Mouvement | Micro-interactions 120–220 ms, sans animation décorative qui ralentit l'achat. |
| Densité | Une information principale par zone ; éviter les dashboards compacts illisibles sur mobile. |

### 6.2 Hiérarchie d'écran
Chaque écran suit une hiérarchie constante : 1) objectif de page, 2) action principale, 3) contenu essentiel, 4) informations secondaires, 5) aide / contexte. Le bouton primaire doit rester identifiable sans chercher dans la page.

### 6.3 Navigation mobile
Pour le smartphone, la navigation principale privilégie une barre basse à 4–5 destinations maximum : Accueil, Rechercher, Catégories/Shop, Commandes, Compte. Le panier est un élément persistant visible depuis le header et/ou sous forme de mini-barre de panier quand des produits sont présents.

### 6.4 Zone de confort du pouce
Les actions critiques — Ajouter au panier, Continuer, Payer, Confirmer — doivent être accessibles dans la zone basse de l'écran. Les commandes destructives ou secondaires ne doivent pas concurrencer l'action principale.

### 6.5 États obligatoires pour chaque composant métier
- Default
- Hover (desktop uniquement)
- Focus clavier
- Pressed
- Disabled
- Loading / skeleton
- Success
- Warning
- Error
- Empty state
- Offline / service indisponible
- Permission / accès refusé

### 6.6 Écriture UX
- Dire ce qui va arriver : « Montant estimatif » plutôt que « Total » si le poids est variable.
- Expliquer les frais au moment où ils apparaissent.
- Éviter les messages techniques : préférer une action claire et rassurante.
- Utiliser des phrases courtes et un vocabulaire commercial compréhensible au Bénin.
- Ne jamais utiliser une couleur seule pour transmettre une information importante.
- **Indiquer clairement les options facultatives vs obligatoires.**

---

## 07 — Design system et composants

### 7.1 Tokens

| Token | Valeur proposée | Usage |
|-------|-----------------|-------|
| Primary | Vert #176B52 | CTA, liens importants, états positifs |
| Primary Soft | #EAF6F0 | fonds contextualisés |
| Text | #27313A | texte principal |
| Muted | #64717B | texte secondaire |
| Danger | #B94B3D | erreurs / actions sensibles |
| Accent | #C8943D | labels premium / points d'attention |
| Surface | #FFFFFF | cartes / formulaires |
| Background | #F7F8F7 | fond principal |

### 7.2 Typographie
Proposition : une grotesque moderne et très lisible, par exemple Inter, Manrope ou équivalent variable. H1 28–36 px, H2 22–28 px, H3 18–22 px, texte 15–17 px mobile / 15–18 px desktop, labels 13–14 px. Line-height autour de 1,4–1,6 selon la taille.

### 7.3 Grille et espacements
Base d'espacement 4 px, avec pas courants 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 px. Conteneur desktop recommandé : 1200–1280 px avec marges fluides. Les cartes produits doivent conserver une largeur permettant de lire le nom et le prix sans retour excessif à la ligne.

### 7.4 Composants minimum

| Famille | Composants |
|---------|------------|
| Commerce | App shell, Header responsive, Bottom navigation, Search bar, Search suggestions, Category chip, Product card, Product gallery, Price block, Weight selector, Cut selector, Quantity stepper, Cart item |
| **Personnalisation** | **Meat selector, Seasoning selector, Side dish selector, Drink selector, Extras selector, Optional badge, Required badge** |
| **Restaurant** | **Restaurant card, Table selector, Space selector, QR scanner, Dine-in toggle, Takeaway toggle, Delivery toggle** |
| **Livraison** | **Map picker, Address creator, Delivery slot estimator, Time estimate badge, Location pin, Instructions field** |
| Checkout / compte | Delivery slot selector, Address card, Payment method card, Order timeline, Status badge, Toast, Modal / bottom sheet |
| Back-office | Skeleton, Empty state, Error state, Data table, Filter drawer, Date/lot picker, Confirmation dialog |

---

## 08 — Responsive & mobile-first

Le design doit fonctionner sur petits smartphones, smartphones standards, grands smartphones, tablettes, laptops, desktop et écrans larges, sans dépendre du hover.

| Palier | Largeur indicative | Règle UX |
|--------|-------------------|----------|
| XS | 320–359 px | 1 colonne, CTA pleine largeur, informations essentielles |
| SM | 360–479 px | 1 colonne, bottom navigation, filtres en bottom sheet |
| MD | 480–767 px | 2 colonnes lorsque pertinent, galerie adaptée |
| Tablet | 768–1023 px | navigation compacte, grilles 2–3 colonnes |
| Desktop | 1024–1439 px | header complet, grilles 3–4 colonnes, dashboard multi-colonnes |
| Wide | ≥1440 px | contenu contraint à une largeur lisible, pas d'étirement excessif |

### 8.1 Règles d'adaptation
- Aucune donnée essentielle n'apparaît uniquement au survol.
- Les tableaux admin basculent vers cartes, lignes scrollables ou vues compactes sur mobile.
- Les filtres deviennent un panneau modal/bottom sheet.
- Le checkout reste monotâche : une décision importante par écran ou bloc.
- Les images utilisent responsive srcset/next/image et lazy loading hors contenu prioritaire.
- Les contrôles tactiles respectent une taille confortable et un espacement anti-erreur.
- **Les options facultatives sont clairement distinguées des obligatoires sur tous les écrans.**

---

## 09 — Spécifications fonctionnelles détaillées **(MIS À JOUR)**

### 9.1 Accueil

| Bloc | Exigence |
|------|----------|
| Header | Logo, recherche, accès compte et panier. |
| Recherche | Champ très visible avec autocomplétion. |
| Catégories | Bœuf, mouton, chèvre, porc, lapin, volailles, poissons, autres produits autorisés. |
| Produits populaires | Cartes avec prix, unité, disponibilité et CTA. |
| Produits du moment | Sélection promotionnelle ou saisonnière configurable. |
| Comment ça marche | Découvrir → choisir → commander → recevoir. |
| Garanties | Qualité, préparation, conservation, livraison — informations vérifiables. |
| Avis | Avis clients modérés. |
| CTA | Accès direct au catalogue. |
| **Mode restaurant** | **Accès rapide aux restaurants partenaires, scan QR code.** |

### 9.2 Catalogue, recherche et filtres
- Recherche tolérante aux fautes, autocomplétion et suggestions.
- Filtres : animal, catégorie, prix, prix/kg, poids, découpe, disponibilité, vivant/préparé, origine, conservation, **type de commande (viande seule / avec options / repas complet)**.
- Tri : pertinence, prix, popularité, nouveauté, disponibilité.
- Pagination ou chargement progressif ; éviter un chargement massif.

### 9.3 Modèle produit

**Champs minimum :**
- nom, slug, descriptions
- catégorie, sous-catégorie, animal
- origine, mode de vente, poids/unité, prix, prix/kg
- stock, photos/vidéos, disponibilité
- conditionnement, découpe, conservation, température
- date de disponibilité, informations réglementaires
- nutrition, allergènes si pertinents
- instructions de conservation et préparation
- **options disponibles : assaisonnement, accompagnement, boisson, extras**
- **type de produit : viande seule / plat composé / produit restaurant**
- **restaurant associé (si applicable)**

### 9.4 Vente au kg et poids variable
Supporter 100 g, 250 g, 500 g, 750 g, 1 kg, 1,5 kg, 2 kg et règles configurables. Pour les produits à poids variable, distinguer techniquement « montant estimatif » et « montant final » et conserver l'historique des modifications.

### 9.5 Animaux vivants
Module séparé, désactivable par zone/pays/catégorie, avec espèce, race, sexe, âge approximatif, poids, origine, lieu, prix, disponibilité, conditions de retrait/transport, documents requis et restrictions géographiques. Activation conditionnée à la conformité réglementaire.

### 9.6 **NOUVEAU — Système de personnalisation flexible**

#### 9.6.1 Niveaux de personnalisation
La plateforme doit supporter 4 niveaux de composition de commande :

1. **Viande seule**
   - Sélection du type de viande
   - Définition de la quantité/poids
   - Type de découpe (optionnel)
   - Mode de consommation : retrait / sur place / livraison

2. **Viande + assaisonnement / préparation**
   - Tous les éléments du niveau 1
   - Choix de l'assaisonnement/préparation (facultatif, si disponible)
   - Exemples : marinade, épices spécifiques, mode de cuisson

3. **Viande + accompagnement**
   - Tous les éléments du niveau 1
   - Ajout d'accompagnement(s) (facultatif)
   - Options : riz, pâte rouge, pâte blanche, frites, légumes, autres configurables

4. **Repas complet personnalisé**
   - Viande + quantité + découpe
   - Assaisonnement/préparation (facultatif)
   - Accompagnement(s) (facultatif)
   - Boisson(s) (facultatif)
   - Sauces/condiments/extras (facultatif)
   - Mode de consommation

#### 9.6.2 Règles de configuration
- **Aucune option n'est obligatoire sauf la viande.**
- Les options disponibles dépendent du produit et du restaurant (si applicable).
- Le prix total est recalculé dynamiquement à chaque ajout/suppression d'option.
- Le récapitulatif affiche clairement : prix viande + prix options + frais (si livraison) = total.

### 9.7 **NOUVEAU — Mode restaurant**

#### 9.7.1 Fonctionnalités restaurant
- **Consultation d'établissement :** page dédiée par restaurant avec menu, horaires, localisation.
- **Sélection de viande et options :** même système de personnalisation flexible.
- **Modes de consommation :**
  - **Sur place :** association à une table ou un espace
  - **À emporter :** retrait au comptoir
  - **Livraison :** géolocalisation, adresse, créneau

#### 9.7.2 Gestion des tables et espaces
- Création et gestion des tables/espaces par restaurant.
- Association commande ↔ table/espace.
- Génération de QR codes par table/espace.
- Scan QR code → ouverture directe du menu avec table pré-sélectionnée.

#### 9.7.3 Commande via QR code
- QR code unique par table/espace.
- Scan → redirection vers menu du restaurant.
- Table/espace automatiquement renseigné.
- Mode de consommation pré-sélectionné : « Sur place ».
- Parcours simplifié : sélection → options → panier → paiement → confirmation.

### 9.8 **NOUVEAU — Livraison géolocalisée**

#### 9.8.1 Processus de livraison
1. **Choix du lieu de livraison**
   - Sélection d'une adresse enregistrée
   - Création d'une nouvelle adresse
   - Localisation automatique (géolocalisation navigateur)

2. **Localisation sur carte**
   - Intégration d'une carte interactive (Google Maps, Mapbox, OpenStreetMap)
   - Affichage du point de livraison (pin)
   - Ajustement manuel de la position (drag & drop)
   - Précision du point enregistrée

3. **Point précis et instructions**
   - Adresse textuelle auto-remplie depuis la carte
   - Compléments d'adresse (étage, porte, code, etc.)
   - Instructions de livraison (optionnel) : « Sonner 2 fois », « Gardien », etc.

4. **Date/heure ou créneau**
   - Sélection de la date de livraison
   - Choix d'un créneau horaire ou heure précise
   - Créneaux disponibles calculés en fonction de la capacité

5. **Estimation de livraison**
   - **Calcul du temps estimé affiché avant validation**
   - Facteurs : distance, trafic, capacité de préparation
   - Mise à jour dynamique si changement d'adresse/créneau

6. **Récapitulatif dynamique**
   - Détail des produits et options
   - Prix unitaires et sous-totaux
   - Frais de livraison calculés
   - **Montant total clair**

7. **Paiement et confirmation**
   - Sélection du mode de paiement
   - Validation finale
   - Confirmation immédiate avec numéro de commande
   - Notification envoyée

#### 9.8.2 Suivi de livraison
- Statuts visibles : commande reçue, préparation, en livraison, livrée.
- Estimation de l'heure d'arrivée mise à jour en temps réel.
- Contact livreur (téléphone masqué si nécessaire).
- Historique des livraisons dans le compte client.

### 9.9 Panier et checkout
- Panier : produit, options, poids, quantité, prix unitaire, prix/kg, sous-total, frais, total.
- **Affichage clair des options ajoutées (assaisonnement, accompagnement, boisson, extras).**
- **Distinction visuelle entre options obligatoires et facultatives.**
- Checkout : adresse → livraison → créneau → récapitulatif → paiement → confirmation.
- Afficher les frais et les éventuelles estimations de manière explicite.
- **Mode de consommation sélectionné visible tout au long du processus.**

### 9.10 Livraison
- Zones et quartiers configurables ; frais ; minimum de commande ; créneaux ; disponibilité ; instructions ; téléphone ; géolocalisation facultative.
- Statuts : commande reçue, paiement confirmé, préparation, découpe, conditionnement, prête, en livraison, livrée, annulée.
- **Estimation de temps de livraison calculée et affichée.**
- **Suivi en temps réel pour le client.**

### 9.11 Avis, favoris, promotions
- Favoris par produit/catégorie/**restaurant**.
- Avis après livraison ; modération admin.
- Codes promo, prix promo, promotions par produit/catégorie/**restaurant**, durée limitée et quantité limitée.

---

## 10 — Règles métier

| ID | Règle |
|----|-------|
| RB-01 | Le prix final est calculé côté backend. |
| RB-02 | Le stock réel est validé côté backend au moment de la commande. |
| RB-03 | Un produit indisponible ne peut pas être commandé. |
| RB-04 | Toute variation de poids final est tracée. |
| RB-05 | Une tolérance de poids est paramétrable par produit/règle. |
| RB-06 | Le montant estimatif n'est pas présenté comme montant final. |
| RB-07 | Les remboursements/compléments dépendent du mode de paiement et des règles métier validées. |
| RB-08 | Toute modification sensible admin est journalisée. |
| RB-09 | Les animaux vivants sont activables uniquement après vérification de conformité. |
| RB-10 | Les zones et frais de livraison sont configurables, jamais codés en dur. |
| RB-11 | Les opérations critiques exigent authentification et permissions. |
| RB-12 | L'IA, si activée, ne peut jamais inventer prix, stock, disponibilité, origine ou information sanitaire. |
| RB-13 | Le frontend est un client de l'API, jamais la source de vérité. |
| RB-14 | Les données réglementaires publiées doivent porter une référence interne et une date de revue. |
| **RB-15** | **Aucune option de personnalisation n'est obligatoire sauf la viande elle-même.** |
| **RB-16** | **Le mode de consommation (sur place / à emporter / livraison) doit être explicitement sélectionné.** |
| **RB-17** | **L'estimation de livraison doit être calculée et affichée avant validation du paiement.** |
| **RB-18** | **Une commande restaurant sur place doit être associée à une table ou un espace (via QR code ou sélection).** |
| **RB-19** | **Le prix total affiché inclut toujours : prix viande + prix options + frais (si applicables).** |

---

## 11 — Architecture fonctionnelle et technique **(MIS À JOUR)**

### 11.1 Architecture cible
Web / PWA (Next.js) → API Backend (NestJS) → PostgreSQL / Prisma + Object Storage + Paiements + Notifications + **Services de géolocalisation**. Application Flutter Android/iOS partageant le même backend et les mêmes règles métier.

### 11.2 Modules backend

| Bloc | Modules |
|------|---------|
| Core | Auth, Users, Customers, Products, Categories, Animals, Inventory, Pricing |
| Commerce | Orders, Cart, Payments, Delivery, Addresses, Coupons, Reviews, Notifications |
| **Restaurant** | **Restaurants, Tables, Spaces, QRCode, DineInOrders** |
| **Personnalisation** | **Seasonings, SideDishes, Drinks, Extras, CustomizationRules** |
| **Livraison** | **DeliveryZones, GeoLocation, TimeSlots, Estimations** |
| Pilotage | Promotions, Admin, Reports, AuditLogs, Settings |

### 11.3 Stack recommandée

| Couche | Technologie |
|--------|-------------|
| Web | Next.js récent + TypeScript + React + Tailwind CSS + shadcn/ui |
| Formulaires | React Hook Form + Zod |
| Data fetching | TanStack Query lorsque pertinent |
| **Carte / Géolocalisation** | **Leaflet / Mapbox GL / Google Maps API** |
| **QR Code** | **qrcode.react (génération), html5-qrcode (lecture)** |
| Mobile | Flutter |
| Backend | NestJS + TypeScript + REST/OpenAPI |
| DB | PostgreSQL + Prisma |
| Fichiers | S3-compatible : Cloudflare R2 / AWS S3 / Supabase Storage |
| Infra | Docker / Docker Compose dev / CI-CD |
| Monitoring | Logs structurés + monitoring + alerting |

---

## 12 — Données, stockage et API **(MIS À JOUR)**

### 12.1 Entités principales

**Entités existantes :**
Product, Category, Animal, Lot, Weight, Price, CutOption, Packaging, StorageRule, InventoryItem, Customer, Address, Cart, Order, OrderItem, Payment, Delivery, DeliveryZone, Coupon, Review, Notification, User, Role, Permission, AuditLog.

**Nouvelles entités :**

| Entité | Description |
|--------|-------------|
| **Restaurant** | Établissement partenaire : nom, description, localisation, horaires, contact. |
| **Table** | Table physique dans un restaurant : numéro, capacité, restaurant_id, QR_code. |
| **Space** | Espace générique (terrasse, salon, etc.) : nom, capacité, restaurant_id. |
| **Seasoning** | Assaisonnement/préparation disponible : nom, description, prix, compatibilités. |
| **SideDish** | Accompagnement : nom, type (riz, pâte, frites, légumes), prix, disponibilité. |
| **Drink** | Boisson : nom, type, volume, prix, stock. |
| **Extra** | Extra/sauce/condiment : nom, description, prix, unité. |
| **CustomizationRule** | Règles de personnalisation : produits compatibles, options obligatoires/facultatives. |
| **DeliveryEstimation** | Historique des estimations : adresse, distance, temps_calculé, temps_réel. |
| **QRCodeSession** | Session de commande via QR : token, table_id, timestamp, statut. |

### 12.2 API REST minimale

**Endpoints existants :**
- GET /products — Liste / recherche produits
- GET /products/:slug — Fiche produit
- GET /categories — Catégories
- POST /cart — Ajouter / créer panier
- PATCH /cart — Modifier panier
- POST /orders — Créer commande
- GET /orders/:id — Suivre commande
- POST /payments — Initier / confirmer flux paiement
- GET /deliveries — Livraisons
- POST /admin/products — Créer produit
- PATCH /admin/products/:id — Modifier produit
- GET /admin/orders — Lister commandes
- PATCH /admin/orders/:id/status — Modifier statut
- GET /admin/dashboard — KPI opérationnels

**Nouveaux endpoints :**

| Méthode | Endpoint | Objet |
|---------|----------|-------|
| GET | /restaurants | Liste des restaurants |
| GET | /restaurants/:id | Détails d'un restaurant |
| GET | /restaurants/:id/menu | Menu d'un restaurant |
| GET | /restaurants/:id/tables | Tables disponibles (admin) |
| POST | /restaurants/:id/tables | Créer une table |
| GET | /qr/:token | Validation session QR code |
| POST | /qr/:token/order | Commander via QR (table pré-remplie) |
| GET | /seasonings | Liste des assaisonnements |
| GET | /side-dishes | Liste des accompagnements |
| GET | /drinks | Liste des boissons |
| GET | /extras | Liste des extras |
| POST | /delivery/estimate | Calcul estimation livraison (adresse, créneau) |
| GET | /delivery/slots | Créneaux disponibles |
| POST | /orders/:id/table | Associer commande à une table (sur place) |
| GET | /customization-rules | Règles de personnalisation par produit |

### 12.3 Médias
Images : WebP/AVIF, tailles multiples, compression, lazy loading et CDN. Les uploads admin passent par validation MIME, taille, dimensions et nommage sécurisé.

---

## 13 — PWA, Android et iOS

### 13.1 PWA
- manifest
- icônes
- splash screen
- service worker
- cache contrôlé
- installation mobile
- stratégie offline adaptée
- notifications si compatibles
- deep links / ouverture de routes produit et commande
- **support géolocalisation navigateur**
- **scan QR code via caméra (si API compatible)**

### 13.2 Android — état de référence 2026
Au 16 septembre 2026, Google Play indique que les nouvelles applications et les mises à jour doivent cibler Android 16 (API 36) ou supérieur depuis le 31 août 2026, avec une possibilité d'extension jusqu'au 1er novembre 2026. Cette exigence doit être recontrôlée au moment de la soumission. [Source Google Play, vérifiée le 16/09/2026]

### 13.3 iOS
L'application doit respecter les App Store Review Guidelines, App Privacy, permissions, certificats, provisioning, App Store Connect et exigences techniques en vigueur. Pour les biens physiques consommés hors de l'app, Apple prévoit des méthodes de paiement autres que l'achat intégré, telles qu'Apple Pay ou carte, selon les conditions applicables. [Source Apple, vérifiée le 16/09/2026]

---

## 14 — Sécurité et protection des données

### 14.1 Sécurité applicative
- HTTPS partout
- JWT ou sessions sécurisées
- Refresh token sécurisé
- RBAC
- Validation backend
- Rate limiting
- Protection CSRF selon architecture
- Protection XSS
- ORM / Prisma contre injection SQL
- Security headers
- Gestion des secrets
- Audit logs
- Backups
- Monitoring

### 14.2 Données personnelles
Le projet doit appliquer une logique de minimisation : ne collecter que ce qui est utile au service, définir une finalité, limiter la conservation, protéger les données et documenter les droits des personnes. Au Bénin, l'APDP référence la loi n° 2017-20 du 20 avril 2018 portant Code du numérique ; l'APDP rappelle notamment les droits d'accès, opposition et rectification ainsi que des principes de finalité, pertinence, conservation limitée, sécurité/confidentialité et respect des droits. [Source APDP — Loi n°2017-20] [Source APDP — Protection des données]

**Nouvelles considérations :**
- **Données de géolocalisation :** finalité limitée à la livraison, consentement explicite, suppression après livraison sauf obligation légale.
- **QR codes :** tokens temporaires, expiration automatique, pas de données personnelles dans le token.
- **Tables/restaurants :** association commande-table journalisée pour traçabilité, accès restreint.

### 14.3 Matrice des données

| Donnée | Finalité | Accès | Conservation |
|--------|----------|-------|--------------|
| Identité client | Compte / commande | Client + rôles autorisés | À définir selon obligations et besoin métier |
| Téléphone | Livraison / support / OTP si retenu | Client + livraison + rôles autorisés | À définir |
| Adresse | Livraison | Client + livraison + rôles autorisés | À définir |
| **Coordonnées GPS** | **Précision livraison** | **Client + livreur + rôles autorisés** | **Supprimées après livraison (sauf litige)** |
| **Table/Espace** | **Commande sur place** | **Restaurant + rôles autorisés** | **Durée de la session + archivage commande** |
| Paiement | Transaction / rapprochement | Paiement + rôles autorisés | Selon prestataire / obligations |
| Logs | Sécurité / audit | Admin restreint | Politique de conservation |
| Analytics | Mesure produit | Analystes autorisés | Durée documentée |

---

## 15 — Réglementation au Bénin : cadre de vérification

Le présent TDR distingue ce qui est vérifié de ce qui doit encore faire l'objet d'une validation administrative ou juridique. Aucune contrainte métier spécifique ci-dessous ne doit être interprétée comme avis juridique.

### 15.1 Données personnelles — vérifié

| Exigence | Source / organisme | Date de vérification | Niveau | Impact technique / métier |
|----------|-------------------|---------------------|--------|--------------------------|
| Cadre de protection des données personnelles | Loi n°2017-20 / APDP — Code du numérique | 16/09/2026 | Cadre légal applicable | Registre des traitements, politique confidentialité, gestion des droits, sécurité, revue des formalités applicables |
| Droits des personnes | APDP — informations de protection | 16/09/2026 | Cadre légal | Écrans et procédures d'accès / opposition / rectification / suppression selon applicabilité |

### 15.2 Produits alimentaires / origine animale — à confirmer par source officielle compétente avant production

Le prompt exige une revue des règles béninoises portant sur commercialisation des produits d'origine animale, hygiène, abattage, découpe, conservation, chaîne du froid, transport, traçabilité, étiquetage, poids et mesures, vente en ligne, protection du consommateur, paiement électronique et animaux vivants. Ces exigences doivent être inventoriées puis documentées par texte officiel, organisme compétent, date de vérification, niveau d'obligation et impact.

| Domaine | Statut TDR | Action |
|---------|-----------|--------|
| Abattage / découpe | À confirmer | Identifier textes officiels MAEP / services vétérinaires compétents et exigences par catégorie. |
| Hygiène / conservation | À confirmer | Valider les obligations sanitaires, température et chaîne du froid applicables. |
| Transport | À confirmer | Valider conditions de transport des produits frais et animaux vivants. |
| Traçabilité | À confirmer | Déterminer données obligatoires et durée de conservation. |
| Étiquetage | À confirmer | Valider mentions obligatoires par type de produit. |
| Animaux vivants | À confirmer | Valider autorisations, documents, zones, transport et restrictions. |
| Vente en ligne / consommateur | À confirmer | Valider règles commerciales, information client, facturation et recours. |
| **Restauration sur place** | **À confirmer** | **Valider exigences sanitaires pour consommation sur place, agréments restaurant.** |
| **Livraison de nourriture** | **À confirmer** | **Valider règles de transport des plats préparés, chaîne du froid.** |

**Règle de gouvernance :** un tableau réglementaire versionné doit accompagner le projet. Chaque ligne comporte : source officielle, organisme, article/section si disponible, date de vérification, responsable de revue, statut, exigence technique et exigence opérationnelle.

---

## 16 — SEO, performance et analytics

### 16.1 SEO
- SSR/SSG lorsque pertinent
- Metadata
- Open Graph
- Sitemap
- robots.txt
- URLs propres
- Schema.org Product / Offer / BreadcrumbList / Organization / LocalBusiness / **Restaurant** si pertinent
- Pages indexables
- Core Web Vitals

### 16.2 Performance

| Axe | Règle |
|-----|-------|
| Images | WebP/AVIF, dimensions adaptées, lazy loading hors LCP, CDN |
| JS | Réduire JavaScript inutile et charger à la demande |
| Données | Pagination, cache, indexes SQL, API ciblées |
| Réseau | Optimiser pour connexions variables ; états offline explicites |
| UX perçue | Skeletons, transitions courtes, réponse immédiate aux interactions |
| **Carte** | **Chargement différé de la carte, fallback statique si lenteur** |

### 16.3 Analytics
Mesurer : visites, recherche, produits consultés, ajout panier, abandon panier, commandes, conversion, produits populaires, zones de livraison, **restaurants consultés, modes de consommation choisis, options ajoutées (assaisonnement, accompagnement, etc.)**. Les événements analytics doivent respecter la politique de confidentialité et la base légale applicable.

---

## 17 — Tests, QA et critères d'acceptation

### 17.1 Stratégie de tests
- Unit tests : services, calculs, poids, prix, stock, permissions, **estimations livraison, règles de personnalisation**.
- Integration tests : commande, paiement, stock, livraison, **association table, QR code**.
- E2E : visiteur → produit → panier → commande → paiement → confirmation → préparation → livraison.
- **E2E restaurant :** scan QR → menu → commande sur place → paiement → confirmation table.
- **E2E livraison :** sélection adresse → carte → ajustement pin → estimation → paiement → suivi.
- Tests mobiles : Android + iOS.
- Tests responsive : plusieurs largeurs et orientations.
- Tests sécurité : authentification, autorisations, entrées malveillantes, upload, rate limiting.
- Tests accessibilité : clavier, contraste, labels, focus, lecteur d'écran sur parcours critiques.

### 17.2 Critères d'acceptation généraux
Une fonctionnalité n'est « Done » que si elle fonctionne sur desktop et mobile, possède ses états loading/error/empty, est sécurisée, testée, accessible, conforme au design system, conforme aux règles métier et documentée.

### 17.3 Matrice de recette

| ID | Critère | Résultat attendu |
|----|---------|------------------|
| AC-01 | Ajouter produit | Produit ajouté, stock revalidé, prix calculé backend. |
| AC-02 | Poids variable | Montant estimatif clairement séparé du final. |
| AC-03 | Poids réel | Recalcul traçable et gestion de l'écart. |
| AC-04 | Paiement | Statut synchronisé backend et idempotence prévue. |
| AC-05 | Livraison | Statut visible client + back-office. |
| AC-06 | Responsive | Aucune fonctionnalité critique perdue de 320 px à écran large. |
| AC-07 | Accessibilité | Parcours critiques utilisables au clavier et avec contrastes conformes. |
| AC-08 | Sécurité | Aucun endpoint sensible accessible sans permission. |
| AC-09 | Offline | Aucune confirmation frauduleuse de commande/paiement hors ligne. |
| AC-10 | Audit | Actions sensibles journalisées. |
| **AC-11** | **Personnalisation flexible** | **Le client peut commander viande seule sans aucune option obligatoire.** |
| **AC-12** | **Options facultatives** | **Toutes les options (assaisonnement, accompagnement, boisson, extras) sont clairement marquées facultatives.** |
| **AC-13** | **Mode restaurant** | **Commande sur place associée correctement à une table via QR code ou sélection.** |
| **AC-14** | **Livraison géolocalisée** | **Point de livraison précisément localisable sur carte, estimation affichée avant paiement.** |
| **AC-15** | **Récapitulatif dynamique** | **Le total met à jour en temps réel avec chaque ajout/suppression d'option ou changement de mode.** |

---

## 18 — DevOps, CI/CD, déploiement et maintenance

### 18.1 Git et environnements
GitHub, branches protégées, revues de code, environnements dev / staging / production, variables d'environnement hors dépôt, migrations Prisma contrôlées.

### 18.2 Pipeline
Push → lint → type checking → unit tests → integration tests → build → security checks → deploy staging → validation → production.

### 18.3 Hébergement

| Option | Architecture |
|--------|-------------|
| MVP économique | Vercel frontend + serveur cloud backend + PostgreSQL managé + object storage + CDN. |
| Production scalable | CDN + API + DB managée + object storage + monitoring + backups + Redis si besoin réel. |

### 18.4 Maintenance
- Surveillance disponibilité/API/DB
- Sauvegardes testées et non seulement configurées
- Patchs de sécurité
- Suivi des erreurs et logs
- Revue mensuelle des performances
- Revue trimestrielle des exigences réglementaires et store policies
- Versionnage des contrats API
- **Revue des APIs de géolocalisation (coûts, quotas, alternatives)**

---

## 19 — Roadmap, budget et risques

### 19.1 Roadmap

| Phase | Contenu |
|-------|---------|
| Phase 1 — MVP | Catalogue, recherche, fiche produit, panier, compte, adresse, commande, paiement, livraison, admin, stock basique. |
| **Phase 1.5 — Personnalisation** | **Système de personnalisation flexible (viande seule → repas complet), options assaisonnement/accompagnement/boisson/extras.** |
| **Phase 2 — Restaurant & Livraison avancée** | **Mode restaurant, tables, QR codes, livraison géolocalisée avec carte et estimation, suivi temps réel.** |
| Phase 2 (suite) | Poids variable, découpe avancée, lots, traçabilité, livreur, notifications, promotions, avis. |
| Phase 3 | Android, iOS, push, fidélité, recommandations, analytics avancés. |
| Phase 4 | IA de recommandation, assistant client, commande vocale, prévision de demande, optimisation stocks. |

### 19.2 Budget estimatif — méthode
Le prompt de référence demande une rubrique budget mais ne fournit pas de chiffrage projet. Le budget doit donc être produit après découpage en lots et estimation de charge ; il ne serait pas fiable d'inventer un montant à ce stade.

| Lot budgétaire | Unité de chiffrage |
|----------------|-------------------|
| UX research + UI design | Jours/homme + ateliers |
| Frontend Web/PWA | Jours/homme / sprint |
| Backend/API/DB | Jours/homme / sprint |
| **Intégration carte/géolocalisation** | **Jours/homme / licence API** |
| **Système QR code & restaurant** | **Jours/homme / sprint** |
| Mobile Flutter | Jours/homme / sprint |
| QA / sécurité | Jours/homme + tests |
| Cloud | Coût mensuel |
| Paiements / SMS / WhatsApp | Coût à la transaction / abonnement |
| **API carte (Google Maps / Mapbox)** | **Coût mensuel selon usage** |
| Maintenance | Forfait mensuel ou annuel |

### 19.3 Risques

| Risque | Impact | Mesure |
|--------|--------|--------|
| Réglementation mal documentée | Très élevé | Revue officielle avant activation des fonctionnalités concernées. |
| Poids variable mal géré | Élevé | Modèle métier séparant estimation/final + audit. |
| Stock périssable | Élevé | Lots, dates, règles de rotation et alertes. |
| Paiement asynchrone | Élevé | Statuts backend, webhooks, idempotence. |
| Réseau instable | Moyen/élevé | PWA, cache, états offline, aucune écriture critique offline. |
| UX trop complexe | Moyen | Tests utilisateurs sur smartphone et itérations Figma. |
| Permissions admin excessives | Élevé | RBAC minimal + audit + principe du moindre privilège. |
| **Complexité personnalisation** | **Moyen** | **Tests utilisateurs pour valider la clarté des options facultatives.** |
| **Coûts API géolocalisation** | **Moyen** | **Évaluation des alternatives (OpenStreetMap, Mapbox) et mise en place de quotas.** |
| **Adoption mode restaurant** | **Moyen** | **Partenariats restaurants, formation, support QR code.** |

---

## 20 — Checklist de mise en production

| Domaine | Avant go-live |
|---------|---------------|
| Produit | Nom/logo final validés ; catalogue réel ; prix ; unités ; stocks ; règles de poids ; découpe ; zones livraison. |
| **Personnalisation** | **Options assaisonnement/accompagnement/boisson/extras configurées ; règles de compatibilité testées.** |
| **Restaurant** | **Restaurants partenaires onboardés ; tables créées ; QR codes générés et testés.** |
| **Livraison** | **API géolocalisation configurée ; estimation de temps calibrée ; zones de livraison définies.** |
| UX/UI | Design system ; responsive 320 px+ ; états ; accessibilité ; contenus ; erreurs compréhensibles. |
| Technique | Build production ; migrations ; variables ; secrets ; monitoring ; backups ; CDN. |
| Paiement | Webhooks ; idempotence ; gestion échec/remboursement ; rapprochement. |
| Sécurité | HTTPS ; RBAC ; rate limiting ; headers ; audit ; tests sécurité. |
| Données | Politique confidentialité ; droits ; conservation ; flux tiers documentés. |
| Réglementation | Matrice officielle validée ; fonctionnalités conditionnelles verrouillées si statut non confirmé. |
| Stores | Android target API 36+ à la soumission 2026 ; Apple checklist et App Privacy revalidées. |
| SEO | Metadata ; sitemap ; robots ; données structurées ; pages produits indexables. |
| QA | Tests unitaires/intégration/E2E ; recette smartphone ; tests erreurs ; tests paiement et livraison. |
| **QA Restaurant** | **Test QR code sur device réel ; test association table ; test mode sur place.** |
| **QA Livraison** | **Test géolocalisation navigateur ; test ajustement pin carte ; test estimation temps.** |
| Exploitation | Runbook incidents ; contacts ; procédures remboursement ; support client ; maintenance. |

---

## Annexe A — Écrans UX/UI à concevoir dans Figma

| Famille | Écran |
|---------|-------|
| Public | Accueil desktop/mobile |
| Public | Catalogue / recherche / résultats |
| Public | Filtre mobile bottom sheet |
| Commerce | Fiche produit standard |
| Commerce | Fiche produit au kg |
| Commerce | Fiche produit poids variable |
| Commerce | Choix de découpe |
| **Commerce** | **Sélecteur de personnalisation (assaisonnement, accompagnement, boisson, extras)** |
| **Commerce** | **Fiche produit restaurant avec options** |
| Commerce | Panier vide / panier rempli |
| Checkout | Adresse / livraison / créneau |
| **Checkout** | **Sélecteur mode de consommation (Sur place / À emporter / Livraison)** |
| **Checkout** | **Carte de géolocalisation avec pin ajustable** |
| **Checkout** | **Estimation de temps de livraison** |
| Checkout | Récapitulatif et paiement |
| Checkout | Confirmation + suivi |
| Compte | Connexion / inscription / récupération |
| Compte | Commandes / détail commande |
| Compte | Favoris / adresses / notifications / avis |
| **Restaurant** | **Page restaurant (menu, infos, localisation)** |
| **Restaurant** | **Sélecteur de table/espace** |
| **Restaurant** | **Vue QR code scan → menu pré-rempli** |
| Admin | Dashboard |
| Admin | Produits / création / modification |
| Admin | Stock / lots / dates |
| Admin | Commande / préparation / pesée |
| Admin | Livraison / affectation |
| **Admin** | **Restaurants / tables / espaces / QR codes** |
| **Admin** | **Assaisonnements / accompagnements / boissons / extras** |
| Admin | Utilisateurs / rôles |
| Admin | Audit logs / paramètres |
| Livreur | Tournée / détail / statut / échec |

---

## Annexe B — Checklist UX de chaque écran

- Quel est le but de l'écran en une phrase ?
- Quelle est l'action principale ?
- Quel contenu doit être visible sans scroll ?
- Que se passe-t-il pendant le chargement ?
- Que se passe-t-il si aucune donnée n'existe ?
- Que se passe-t-il en cas d'erreur ?
- Que se passe-t-il hors connexion ?
- L'écran est-il compréhensible sur 320–360 px ?
- Peut-on tout utiliser au clavier ?
- Les focus sont-ils visibles ?
- Les contrastes et labels sont-ils adaptés ?
- Y a-t-il une action destructrice sans confirmation ?
- Le texte est-il compréhensible par un utilisateur non technique ?
- Le back-end revalide-t-il toute donnée critique ?
- **Les options facultatives sont-elles clairement identifiées ?**
- **Le mode de consommation est-il explicitement sélectionné ?**
- **L'estimation de livraison (si applicable) est-elle visible avant paiement ?**

---

## Annexe C — Sources externes vérifiées

Sources utilisées pour les points réglementaires/plateformes qui nécessitent une vérification actuelle :

- Google Play — Target API level requirements (consulté le 16/09/2026) : support.google.com/googleplay/android-developer/answer/11926878
- Apple — App Review Guidelines, section biens et services physiques (consulté le 16/09/2026) : developer.apple.com/app-store/review/guidelines/fr/
- APDP Bénin — Loi n°2017-20 / Code du numérique : archive.apdp.bj/lois/la-loi-n-2017-20-portant-code-du-numerique-en-republique-du-benin/
- APDP Bénin — Protection des données / droits : archive.apdp.bj/proteger/
- Gouvernement du Bénin — exemple de politique de confidentialité renvoyant à la loi n°2017-20 : gouv.bj/pages/politique-confidentialite/

**Nota :** les URL ci-dessus sont des références de travail ; les exigences de store et les textes réglementaires doivent être recontrôlés au moment de la conception détaillée, de l'intégration et de la soumission.

---

## Annexe D — Glossaire des nouveaux termes

| Terme | Définition |
|-------|------------|
| **Personnalisation flexible** | Système permettant au client de composer sa commande librement, de la viande seule au repas complet. |
| **Assaisonnement** | Préparation ou marinade appliquée à la viande (épices, sauce, mode de cuisson). |
| **Accompagnement** | Plat d'accompagnement : riz, pâte (rouge/blanche), frites, légumes, etc. |
| **Extras** | Sauces, condiments, suppléments ajoutables à la commande. |
| **Mode de consommation** | Choix entre : Sur place, À emporter, Livraison. |
| **Mode restaurant** | Fonctionnalité permettant de commander depuis un établissement partenaire. |
| **Table/Espace** | Emplacement physique dans un restaurant auquel une commande sur place peut être associée. |
| **QR code session** | Token unique généré par table, permettant d'ouvrir le menu avec table pré-sélectionnée. |
| **Livraison géolocalisée** | Processus de livraison utilisant une carte interactive pour préciser le point exact de remise. |
| **Estimation de livraison** | Temps estimé d'arrivée calculé avant validation, basé sur distance, trafic et capacité. |

---

*Document version 1.1 — Mis à jour avec les nouvelles fonctionnalités de personnalisation flexible, mode restaurant et livraison géolocalisée.*
