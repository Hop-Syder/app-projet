# TERMES DE RÉFÉRENCE — TDR / CAHIER DES CHARGES
## PLATEFORME WEBAPP DE COMMERCE DE PRODUITS ANIMAUX
### BÊTES & FRAIS

**Version :** 1.1 — Intégration commande flexible & mode restaurant  
**Date de référence :** 16 septembre 2026  
**Pays prioritaire :** Bénin  
**Stack cible :** Next.js / NestJS / PostgreSQL / Prisma / Flutter (futur)  

---

## Sommaire opérationnel

| Ref. | Bloc |
|------|------|
| 01 | Vision, contexte et problématique |
| 02 | Objectifs et proposition de valeur |
| 03 | Périmètre fonctionnel |
| 04 | Utilisateurs et personas |
| 05 | User journeys et parcours clés |
| 06 | Principes UX/UI 2026 |
| 07 | Design system et composants |
| 08 | Responsive & mobile-first |
| 09 | Spécifications fonctionnelles détaillées |
| 10 | Règles métier |
| 11 | Architecture fonctionnelle et technique |
| 12 | Données, stockage et API |
| 13 | PWA, Android et iOS |
| 14 | Sécurité et protection des données |
| 15 | Réglementation au Bénin — cadre de vérification |
| 16 | SEO, performance et analytics |
| 17 | Tests, QA et critères d'acceptation |
| 18 | DevOps, CI/CD, déploiement et maintenance |
| 19 | Roadmap, budget, risques |
| 20 | Checklist de mise en production |

**Principe directeur :** Le client doit pouvoir « découvrir → rechercher → comprendre → choisir → personnaliser → commander → payer → suivre → recevoir → évaluer » avec le minimum d'étapes, sans ambiguïté sur le produit, le prix ou la livraison.

---

## 01 — Vision, contexte et problématique

### 1.1 Contexte
Le projet vise la création d'une solution numérique professionnelle de commercialisation en ligne de produits animaux et alimentaires d'origine animale, prioritairement pour le marché béninois et, à moyen terme, pour un déploiement progressif dans d'autres pays d'Afrique de l'Ouest.

Le catalogue doit couvrir plusieurs familles : viande de bœuf, mouton, chèvre, porc, lapin, volailles, poissons, autres produits autorisés et, sous réserve de conformité réglementaire, animaux vivants.

La plateforme évolue vers un système de **commande flexible et personnalisable**, intégrant également un véritable **parcours restaurant** permettant aux clients de commander depuis un établissement partenaire.

### 1.2 Problématique
Le commerce de produits animaux impose des contraintes particulières : diversité des unités de vente, poids variable, choix de découpe, stock périssable, traçabilité, conservation, chaîne du froid, livraison, paiement et conformité réglementaire. Une interface e-commerce classique n'est donc pas suffisante : le produit doit être compréhensible, mesurable et traçable avant la confirmation de commande.

L'évolution vers un modèle hybride (commerce + restaurant) ajoute la nécessité de gérer :
- Des modes de consommation multiples (sur place, à emporter, livraison)
- Des compositions de repas flexibles (viande seule, avec accompagnement, repas complet)
- La géolocalisation précise pour la livraison
- L'association de commandes à des tables/espaces dans les restaurants partenaires

### 1.3 Vision produit
Construire une expérience proche d'un commerce moderne : visuelle, rassurante, rapide, simple sur smartphone, mais suffisamment robuste côté administration pour gérer les opérations réelles de préparation, découpe, pesée, conditionnement et livraison.

Intégrer un écosystème où le client peut :
- Commander de la viande pour préparation à domicile
- Composer un repas complet avec options facultatives
- Commander depuis un restaurant partenaire avec service sur place
- Bénéficier d'une livraison géolocalisée précise avec estimation temporelle

### 1.4 Principes non négociables
- **Backend + PostgreSQL = source de vérité.**
- Aucune commande ni aucun paiement ne sont considérés confirmés sur la seule base du frontend ou du mode hors-ligne.
- Les frais de livraison ne sont pas cachés.
- Les montants liés au poids variable sont explicitement présentés comme estimatifs jusqu'à validation du poids réel.
- Une exigence réglementaire n'est pas présentée comme obligatoire sans source et date de vérification.
- L'interface privilégie la compréhension et la vitesse plutôt que la densité fonctionnelle.
- **Aucune option obligatoire inutile** : le client construit uniquement ce qu'il souhaite.

---

## 02 — Objectifs et proposition de valeur

### 2.1 Objectif principal
Permettre à un client de découvrir, rechercher, comprendre, choisir, personnaliser, commander, payer, suivre et évaluer des produits animaux et des repas avec une expérience numérique simple et fiable, que ce soit pour consommation à domicile ou dans un restaurant partenaire.

### 2.2 Objectifs utilisateurs

| Objectif | Résultat attendu |
|----------|------------------|
| Trouver vite | Recherche, catégories, filtres et suggestions accessibles immédiatement. |
| Comprendre | Prix, unité, poids, origine, conservation, découpe et disponibilité lisibles. |
| Personnaliser librement | Options facultatives (assaisonnement, accompagnement, boisson) ajoutées selon besoin. |
| Commander sans friction | Panier clair et checkout court, mode de consommation choisi simplement. |
| Savoir ce qui se passe | Statuts de commande et notifications compréhensibles. |
| Être rassuré | Informations qualité, hygiène, conservation et provenance présentées sans surcharge. |
| Être autonome | Compte client simple, réutilisation des adresses/favoris et historique. |
| Commander depuis un restaurant | Consultation du menu, association à une table, paiement simplifié. |

### 2.3 Proposition de valeur
Une place de marché / boutique digitale orientée produits animaux, conçue pour rendre l'achat plus transparent : le client sait ce qu'il achète, à quelle unité, à quel prix, dans quelles conditions il sera préparé et livré.

**Nouveauté 2026 :** Intégration d'un mode restaurant permettant de composer des repas flexibles (viande seule → repas complet) et de commander depuis des établissements partenaires avec service sur place, à emporter ou livraison.

---

## 03 — Périmètre fonctionnel

### 3.1 Front-office

#### Commerce traditionnel
- Accueil
- Catalogue et catégories
- Recherche intelligente
- Filtres et tri
- Fiches produits
- Personnalisation : poids, découpe, conditionnement lorsque disponible
- Panier
- Checkout (adresse → livraison → créneau → récapitulatif → paiement → confirmation)
- Compte client
- Adresses
- Favoris
- Suivi de commande
- Notifications
- Avis et notation
- Promotions
- Aide / support
- Mentions légales et politique de confidentialité

#### Mode restaurant (nouveau)
- Consultation d'établissements partenaires
- Menu par restaurant (viandes, options, accompagnements, boissons)
- Sélection du mode de consommation : **Sur place / À emporter / Livraison**
- Association à une table ou un espace (via QR code ou identifiant)
- Composition flexible de repas (viande seule → repas complet)
- Commande depuis QR code ou interface restaurant
- Paiement intégré

#### Livraison avancée (nouveau)
- Choix ou création de l'adresse de livraison
- Localisation sur carte interactive
- Position précise du lieu de livraison (pin drop)
- Instructions de livraison détaillées
- Date et heure / créneau de livraison
- Estimation du temps de livraison avant validation
- Suivi en temps réel du statut de livraison

### 3.2 Back-office

#### Gestion commerciale
- Dashboard opérationnel
- Gestion produits et catégories
- Gestion animaux / lots
- Gestion prix et règles de poids
- Gestion stocks et lots
- Gestion commandes et pesée réelle
- Gestion découpe
- Gestion conditionnement et conservation
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

#### Gestion restaurant (nouveau)
- Gestion des établissements partenaires
- Configuration des menus par restaurant
- Gestion des tables et espaces
- Suivi des commandes sur place
- Association commandes ↔ tables
- Statistiques par restaurant

#### Gestion livraison avancée (nouveau)
- Configuration des zones de livraison étendues
- Gestion des créneaux et disponibilités
- Suivi des livreurs en temps réel
- Calcul des estimations de temps
- Gestion des échecs de livraison

### 3.3 Hors périmètre initial / phases ultérieures
Les applications natives Android/iOS, la fidélité avancée, les recommandations avancées, la prévision de demande et les assistants IA complets sont positionnés en phases ultérieures selon le backlog validé.

---

## 04 — Utilisateurs et personas

| Persona | Besoins principaux |
|---------|-------------------|
| **P01 — Client urbain** | Achète pour le foyer. Utilise principalement smartphone. Veut comparer, comprendre le prix et être livré sans appels inutiles. Souhaite composer son repas librement. |
| **P02 — Client professionnel** | Restaurant, traiteur, maquis ou commerce. Besoin de récurrence, quantité, facturation et visibilité sur les stocks/disponibilités. |
| **P03 — Client restaurant** | Consulte un établissement partenaire, veut commander rapidement sur place via QR code, ou choisir à emporter/livraison depuis le restaurant. |
| **P04 — Préparateur** | Gère découpe, pesée, conditionnement, disponibilité et transmission des informations réelles. |
| **P05 — Gestionnaire stock** | Suit lots, stock disponible/réservé/vendu/perdu/ajusté, dates et rotation des produits périssables. |
| **P06 — Responsable commandes** | Valide les commandes, gère statuts, poids réels, montant final et coordination livraison. |
| **P07 — Livreur** | Interface ultra-simple : tournée, client, téléphone, adresse, commande, statut de livraison, navigation GPS. |
| **P08 — Administrateur** | Pilote catalogue, prix, opérations, utilisateurs, conformité documentaire et reporting. |
| **P09 — Super Admin** | Contrôle global, rôles, sécurité, audit et paramètres sensibles. |
| **P10 — Gérant restaurant** | Gère le menu de son établissement, suit les commandes sur place, associe les commandes aux tables, consulte les statistiques. |

---

## 05 — User journeys et parcours clés

### 5.1 Parcours achat standard (commerce)
Accueil → recherche/catégorie → liste produits → fiche produit → options → ajout panier → adresse → livraison → créneau → récapitulatif → paiement → confirmation → préparation → livraison → avis.

### 5.2 Parcours produit au kilogramme
Fiche produit → affichage « prix/kg » → sélection d'un poids (ex. 500 g, 1 kg, 1,5 kg) → calcul instantané du sous-total → contrôle du minimum/maximum → panier.

### 5.3 Parcours poids variable
Commande d'un poids souhaité → affichage du montant estimatif → préparation/découpe → saisie du poids réel par le back-office → calcul du montant final → règle de tolérance → validation éventuelle du client → solde / remboursement → facture mise à jour → audit.

### 5.4 Parcours livraison
Commande confirmée → préparation → découpe → conditionnement → prête → affectation livreur → en livraison → livrée ou échec → notification et journalisation.

### 5.5 Parcours administration produit
Créer brouillon → renseigner caractéristiques → ajouter médias → définir unité/poids/prix → options de découpe → conservation → stock → publier → vérifier rendu client.

### 5.6 Parcours commande flexible (NOUVEAU)

#### Option 1 : Viande seule
Accueil/catalogue → fiche produit viande → sélection poids/découpe → ajout panier → choix mode (retrait/emporter/livraison) → si livraison : adresse + géolocalisation → récapitulatif → paiement → confirmation.

#### Option 2 : Viande + assaisonnement/préparation
Fiche produit viande → sélection poids/découpe → **option facultative** : choisir assaisonnement/préparation → ajout panier → mode de consommation → récapitulatif → paiement → confirmation.

#### Option 3 : Viande + accompagnement
Fiche produit viande → sélection poids/découpe → **option facultative** : choisir accompagnement (riz, pâte rouge, pâte blanche, frites, légumes, etc.) → ajout panier → mode de consommation → récapitulatif → paiement → confirmation.

#### Option 4 : Repas personnalisé complet
Fiche produit ou menu restaurant → sélection viande → **options facultatives en cascade** : assaisonnement → accompagnement → boisson → sauces/extras → ajout panier → mode de consommation → récapitulatif dynamique → paiement → confirmation.

### 5.7 Parcours restaurant (NOUVEAU)

#### Sur place
Scan QR code ou accès restaurant → consultation menu → sélection viande → options facultatives (assaisonnement, accompagnement, boisson, extras) → **association à une table** (manuel ou via QR) → récapitulatif → paiement → préparation → service en table.

#### À emporter depuis restaurant
Accès restaurant → consultation menu → sélection produits → options facultatives → choix "À emporter" → récapitulatif → paiement → retrait au comptoir.

#### Livraison depuis restaurant
Accès restaurant → consultation menu → sélection produits → options facultatives → choix "Livraison" → **géolocalisation adresse** → estimation temps livraison → récapitulatif avec frais → paiement → préparation → livraison → suivi.

### 5.8 Parcours livraison géolocalisée (NOUVEAU)
Choix livraison → sélection adresse existante ou nouvelle → **ouverture carte interactive** → pin drop position précise → confirmation localisation → instructions complémentaires → sélection créneau → **calcul estimation temps** → affichage estimation avant paiement → récapitulatif avec frais détaillés → paiement → confirmation avec suivi.

---

## 06 — Principes UX/UI 2026

### 6.1 Direction artistique proposée

| Dimension | Règle 2026 |
|-----------|-----------|
| Positionnement visuel | Marché frais moderne : propre, humain, premium accessible, jamais « boucherie sombre ». |
| Fond | Priorité aux surfaces claires et légèrement chaudes ; éviter les fonds noirs dominants. |
| Couleur primaire | Vert profond naturel (#176B52) pour les actions et marqueurs de confiance. |
| Couleur d'accent | Terracotta / rouge alimentaire (#C8943D accent, #B94B3D danger) pour alertes, disponibilité critique ou actions secondaires ; usage parcimonieux. |
| Accent premium | Doré discret pour éléments de valeur ou labels, jamais comme couleur dominante. |
| Photographie | Images produit nettes, lumineuses, cadrage cohérent ; montrer le produit avant les décorations. |
| Style des cartes | Rayons modérés 12–16 px, bordures très légères, ombres faibles. |
| Mouvement | Micro-interactions 120–220 ms, sans animation décorative qui ralentit l'achat. |
| Densité | Une information principale par zone ; éviter les dashboards compacts illisibles sur mobile. |

### 6.2 Hiérarchie d'écran
Chaque écran suit une hiérarchie constante : 1) objectif de page, 2) action principale, 3) contenu essentiel, 4) informations secondaires, 5) aide / contexte. Le bouton primaire doit rester identifiable sans chercher dans la page.

### 6.3 Navigation mobile
Pour le smartphone, la navigation principale privilégie une barre basse à 4–5 destinations maximum : **Accueil, Rechercher, Catégories/Shop, Restaurants (nouveau), Commandes, Compte**. Le panier est un élément persistant visible depuis le header et/ou sous forme de mini-barre de panier quand des produits sont présents.

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
- **Principe clé :** « Vous pouvez ajouter... » pour les options facultatives, jamais « Vous devez choisir... ».

---

## 07 — Design system et composants

### 7.1 Tokens

| Token | Valeur proposée | Usage |
|-------|-----------------|-------|
| Primary | Vert #176B52 | CTA, liens importants, états positifs |
| Primary Soft | #EAF6F0 | Fonds contextualisés |
| Text | #27313A | Texte principal |
| Muted | #64717B | Texte secondaire |
| Danger | #B94B3D | Erreurs / actions sensibles |
| Accent | #C8943D | Labels premium / points d'attention |
| Surface | #FFFFFF | Cartes / formulaires |
| Background | #F7F8F7 | Fond principal |

### 7.2 Typographie
Proposition : une grotesque moderne et très lisible, par exemple Inter, Manrope ou équivalent variable. H1 28–36 px, H2 22–28 px, H3 18–22 px, texte 15–17 px mobile / 15–18 px desktop, labels 13–14 px. Line-height autour de 1,4–1,6 selon la taille.

### 7.3 Grille et espacements
Base d'espacement 4 px, avec pas courants 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 px. Conteneur desktop recommandé : 1200–1280 px avec marges fluides. Les cartes produits doivent conserver une largeur permettant de lire le nom et le prix sans retour excessif à la ligne.

### 7.4 Composants minimum

#### Famille Commerce
- App shell
- Header responsive
- Bottom navigation (avec onglet Restaurants)
- Search bar
- Search suggestions
- Category chip
- Product card
- Product gallery
- Price block
- Weight selector
- Cut selector
- **Option selector (nouveau)** : pour assaisonnement, accompagnement, boisson, extras
- **Meal composer (nouveau)** : interface de composition de repas flexible
- Quantity stepper
- Cart item

#### Famille Restaurant (nouveau)
- Restaurant card
- Restaurant detail view
- Menu section
- Table selector
- QR code scanner/viewer
- Dine-in mode toggle
- Takeaway mode toggle
- Delivery from restaurant toggle

#### Famille Livraison avancée (nouveau)
- Address selector with map
- Interactive map component
- Pin drop interface
- Delivery time estimator
- Delivery instructions input
- Real-time tracking view
- Courier location indicator

#### Famille Checkout / compte
- Delivery slot selector
- Address card
- Payment method card
- Order timeline
- Status badge
- Toast
- Modal / bottom sheet
- **Consumption mode selector (nouveau)** : Sur place / À emporter / Livraison

#### Famille Back-office
- Skeleton
- Empty state
- Error state
- Data table
- Filter drawer
- Date/lot picker
- Confirmation dialog
- **Restaurant management UI (nouveau)**
- **Table assignment UI (nouveau)**
- **Delivery map view (nouveau)**

---

## 08 — Responsive & mobile-first

Le design doit fonctionner sur petits smartphones, smartphones standards, grands smartphones, tablettes, laptops, desktop et écrans larges, sans dépendre du hover.

| Palier | Largeur indicative | Règle UX |
|--------|-------------------|----------|
| XS | 320–359 px | 1 colonne, CTA pleine largeur, informations essentielles |
| SM | 360–479 px | 1 colonne, bottom navigation, filtres en bottom sheet |
| MD | 480–767 px | 2 colonnes lorsque pertinent, galerie adaptée |
| Tablet | 768–1023 px | Navigation compacte, grilles 2–3 colonnes |
| Desktop | 1024–1439 px | Header complet, grilles 3–4 colonnes, dashboard multi-colonnes |
| Wide | ≥1440 px | Contenu contraint à une largeur lisible, pas d'étirement excessif |

### 8.1 Règles d'adaptation
- Aucune donnée essentielle n'apparaît uniquement au survol.
- Les tableaux admin basculent vers cartes, lignes scrollables ou vues compactes sur mobile.
- Les filtres deviennent un panneau modal/bottom sheet.
- Le checkout reste monotâche : une décision importante par écran ou bloc.
- Les images utilisent responsive srcset/next/image et lazy loading hors contenu prioritaire.
- Les contrôles tactiles respectent une taille confortable et un espacement anti-erreur.
- **La carte interactive de livraison doit être utilisable sur 320px de large** (zoom, pan, pin drop adaptés).
- **Le sélecteur de mode de consommation (Sur place/À emporter/Livraison) doit être visible immédiatement.**

---

## 09 — Spécifications fonctionnelles détaillées

### 9.1 Accueil

| Bloc | Exigence |
|------|----------|
| Header | Logo, recherche, accès compte et panier. |
| Recherche | Champ très visible avec autocomplétion. |
| Catégories | Bœuf, mouton, chèvre, porc, lapin, volailles, poissons, autres produits autorisés. |
| **Restaurants partenaires (nouveau)** | Section dédiée avec cartes des établissements, accès rapide. |
| Produits populaires | Cartes avec prix, unité, disponibilité et CTA. |
| Produits du moment | Sélection promotionnelle ou saisonnière configurable. |
| Comment ça marche | Découvrir → choisir → commander → recevoir (avec variantes restaurant). |
| Garanties | Qualité, préparation, conservation, livraison — informations vérifiables. |
| Avis | Avis clients modérés. |
| CTA | Accès direct au catalogue et aux restaurants. |

### 9.2 Catalogue, recherche et filtres
- Recherche tolérante aux fautes, autocomplétion et suggestions.
- Filtres : animal, catégorie, prix, prix/kg, poids, découpe, disponibilité, vivant/préparé, origine, conservation.
- Tri : pertinence, prix, popularité, nouveauté, disponibilité.
- Pagination ou chargement progressif ; éviter un chargement massif.
- **Filtre additionnel :** Produits disponibles en mode restaurant.

### 9.3 Modèle produit
Champs minimum : nom, slug, descriptions, catégorie, sous-catégorie, animal, origine, mode de vente, poids/unité, prix, prix/kg, stock, photos/vidéos, disponibilité, conditionnement, découpe, conservation, température, date de disponibilité, informations réglementaires, nutrition, allergènes si pertinents, instructions de conservation et préparation.

**Champs additionnels pour mode restaurant :**
- Disponible en restaurant (booléen)
- Restaurants associés (liste)
- Options d'assaisonnement compatibles
- Accompagnements compatibles
- Temps de préparation estimé

### 9.4 Vente au kg et poids variable
Supporter 100 g, 250 g, 500 g, 750 g, 1 kg, 1,5 kg, 2 kg et règles configurables. Pour les produits à poids variable, distinguer techniquement « montant estimatif » et « montant final » et conserver l'historique des modifications.

### 9.5 Animaux vivants
Module séparé, désactivable par zone/pays/catégorie, avec espèce, race, sexe, âge approximatif, poids, origine, lieu, prix, disponibilité, conditions de retrait/transport, documents requis et restrictions géographiques. Activation conditionnée à la conformité réglementaire.

### 9.6 Système de commande flexible (NOUVEAU)

#### Niveaux de personnalisation
1. **Viande seule** : Sélection de la viande, poids, découpe → commande directe.
2. **Viande + assaisonnement** : Option facultative d'ajouter un assaisonnement/préparation lorsque disponible.
3. **Viande + accompagnement** : Option facultative d'ajouter un ou plusieurs accompagnements (riz, pâte rouge, pâte blanche, frites, légumes, etc.).
4. **Repas complet** : Composition libre avec viande + assaisonnement + accompagnement + boisson + sauces/extras.

#### Règles de fonctionnement
- Toutes les options sont **facultatives** sauf la viande elle-même.
- Le client peut ajouter/supprimer des options à tout moment avant validation.
- Le prix s'update dynamiquement à chaque ajout/suppression.
- Affichage clair : « Optionnel » sur chaque sélecteur d'option.
- Possibilité de sauvegarder des combinaisons favorites.

#### Accompagnements configurables
- Riz (blanc, gras, aromatisé)
- Pâte rouge
- Pâte blanche
- Frites
- Légumes (variétés configurables)
- Salades
- Autres accompagnements définis par l'admin/restaurant

#### Boissons et extras
- Boissons (eau, jus, sodas, bières si autorisé)
- Sauces (pimentée, tomate, moutarde, etc.)
- Condiments
- Extras proposés par le restaurant (pain, banane plantain, etc.)

### 9.7 Mode restaurant (NOUVEAU)

#### Consultation d'établissement
- Page dedicated par restaurant avec :
  - Photos, description, horaires, localisation
  - Menu complet (viandes, options, accompagnements, boissons)
  - Modes de consommation disponibles (Sur place / À emporter / Livraison)
  - Avis et notations
  - Informations pratiques (parking, accès, etc.)

#### Sélection et personnalisation
- Même système de commande flexible que le commerce traditionnel
- Options spécifiques au restaurant (préparations signature, accompagnements maison)
- Possibilité de voir les recommandations du chef

#### Modes de consommation

**Sur place :**
- Association à une table via :
  - Scan QR code sur la table
  - Saisie manuelle du numéro de table
  - Sélection sur plan interactif
- Commande envoyée directement en cuisine
- Service en table
- Possibilité de commander plusieurs fois (apéritif, plat, dessert)
- Addition unique ou fractionnée

**À emporter :**
- Sélection des produits
- Choix de l'heure de retrait
- Paiement en ligne
- Notification de prêtitude
- Retrait au comptoir

**Livraison depuis restaurant :**
- Même parcours que la livraison traditionnelle
- Point de départ : le restaurant
- Estimation basée sur la distance restaurant → client
- Frais de livraison spécifiques au restaurant

### 9.8 Livraison géolocalisée avancée (NOUVEAU)

#### Sélection d'adresse
- Choix parmi les adresses enregistrées
- Création d'une nouvelle adresse
- **Localisation sur carte interactive :**
  - Affichage carte (Google Maps, Mapbox, ou alternative)
  - Pin drop pour position précise
  - Ajustement manuel de la position
  - Validation de la localisation

#### Instructions de livraison
- Champ texte pour instructions complémentaires
- Exemples : « Porte bleue », « 3ème étage », « Sonner deux fois », etc.
- Possibilité d'ajouter une photo du lieu (optionnel)

#### Créneau et estimation
- Sélection de la date et de l'heure ou d'un créneau
- **Calcul de l'estimation de livraison :**
  - Basé sur la distance
  - Temps de préparation
  - Trafic (si données disponibles)
  - Disponibilité des livreurs
- Affichage clair : « Livraison estimée entre 18h30 et 19h00 »
- **L'estimation doit être visible AVANT le paiement**

#### Récapitulatif avant paiement
- Détail des produits
- Prix des options
- Frais de livraison (calculés selon distance/zone)
- Délai estimé
- Adresse complète avec lien vers carte
- Instructions de livraison
- **Montant total TTC**

#### Suivi de livraison
- Statuts : « En préparation » → « Prête » → « En livraison » → « Livrée »
- **Carte de suivi en temps réel** (si techniquement faisable)
- Position du livreur (approximative ou précise selon RGPD/local)
- ETA mise à jour en temps réel
- Contact livreur (bouton appel/SMS)

### 9.9 Panier et checkout
Panier : produit, options, poids, quantité, prix unitaire, prix/kg, sous-total, frais, total. 

**Checkout adaptatif selon le mode :**

**Commerce traditionnel :**
- Adresse → Livraison → Créneau → Récapitulatif → Paiement → Confirmation

**Restaurant Sur place :**
- Sélection table → Récapitulatif → Paiement → Confirmation (numéro de table)

**Restaurant À emporter :**
- Choix heure retrait → Récapitulatif → Paiement → Confirmation (code retrait)

**Restaurant Livraison :**
- Géolocalisation → Instructions → Créneau → Estimation → Récapitulatif → Paiement → Confirmation

Afficher les frais et les éventuelles estimations de manière explicite.

### 9.10 Avis, favoris, promotions
- Favoris par produit/catégorie/restaurant
- Avis après livraison/consommation
- Modération admin
- Codes promo, prix promo, promotions par produit/catégorie/restaurant, durée limitée et quantité limitée
- **Fidélité restaurant** (phase ultérieure)

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
| **RB-15 (nouveau)** | **Toutes les options de personnalisation (assaisonnement, accompagnement, boisson, extras) sont facultatives.** |
| **RB-16 (nouveau)** | **Le mode de consommation (Sur place / À emporter / Livraison) doit être sélectionné avant le paiement.** |
| **RB-17 (nouveau)** | **Pour une commande Sur place, l'association à une table est obligatoire.** |
| **RB-18 (nouveau)** | **Pour une commande en livraison, la géolocalisation précise de l'adresse est obligatoire.** |
| **RB-19 (nouveau)** | **L'estimation du temps de livraison doit être calculée et affichée avant validation du paiement.** |
| **RB-20 (nouveau)** | **Un restaurant peut configurer ses propres options, accompagnements et boissons indépendamment du catalogue global.** |

---

## 11 — Architecture fonctionnelle et technique

### 11.1 Architecture cible
Web / PWA (Next.js) → API Backend (NestJS) → PostgreSQL / Prisma + Object Storage + Paiements + Notifications + **Services de géolocalisation**. Application Flutter Android/iOS partageant le même backend et les mêmes règles métier.

### 11.2 Modules backend

| Bloc | Modules |
|------|---------|
| Core | Auth, Users, Customers, Products, Categories, Animals, Inventory, Pricing |
| Commerce | Orders, Cart, Payments, Delivery, Addresses, Coupons, Reviews, Notifications |
| **Restaurant (nouveau)** | Restaurants, Menus, Tables, TableAssignments, RestaurantStaff, RestaurantOrders |
| **Géolocalisation (nouveau)** | Geocoding, DistanceCalculation, ETAEstimation, LiveTracking |
| Pilotage | Promotions, Admin, Reports, AuditLogs, Settings |

### 11.3 Stack recommandée

| Couche | Technologie |
|--------|-------------|
| Web | Next.js récent + TypeScript + React + Tailwind CSS + shadcn/ui |
| Formulaires | React Hook Form + Zod |
| Data fetching | TanStack Query lorsque pertinent |
| **Cartes/Géo** | **Mapbox GL JS / Leaflet / Google Maps API (à sélectionner)** |
| Mobile | Flutter |
| Backend | NestJS + TypeScript + REST/OpenAPI |
| DB | PostgreSQL + Prisma |
| Fichiers | S3-compatible : Cloudflare R2 / AWS S3 / Supabase Storage |
| Infra | Docker / Docker Compose dev / CI-CD |
| Monitoring | Logs structurés + monitoring + alerting |
| **Temps réel** | **Socket.io / WebSocket pour suivi livraison en direct** |

---

## 12 — Données, stockage et API

### 12.1 Entités principales

#### Entités existantes
Product, Category, Animal, Lot, Weight, Price, CutOption, Packaging, StorageRule, InventoryItem, Customer, Address, Cart, Order, OrderItem, Payment, Delivery, DeliveryZone, Coupon, Review, Notification, User, Role, Permission, AuditLog.

#### Nouvelles entités (v1.1)

**Restaurant & Mode de consommation :**
- `Restaurant` : id, nom, slug, description, adresse, géolocalisation, horaires, téléphone, email, logo, images, statut, configurations
- `RestaurantMenu` : id, restaurantId, productId, disponible, prixSpécifique, optionsAssociées
- `Table` : id, restaurantId, numéro, capacité, statut, qrCode, position (optionnel)
- `TableAssignment` : id, orderId, tableId, timestamp, statut
- `ConsumptionMode` : enum [SUR_PLACE, A_EMPORTER, LIVRAISON]

**Personnalisation de commande :**
- `SeasoningOption` : id, nom, description, prix, compatibleProducts, restaurants
- `SideDish` : id, nom, type (riz, pâte, frites, légumes, autre), prix, disponible
- `Beverage` : id, nom, type, volume, prix, alcoolisé (bool), disponible
- `ExtraItem` : id, nom, description, prix, catégorie, disponible
- `OrderCustomization` : id, orderId, seasoningId, sideDishId, beverageId, extraItems (JSON), prixTotalOptions

**Livraison avancée :**
- `DeliveryAddress` : id, customerId, label, adresseTexte, latitude, longitude, précision, instructions, isDefault
- `DeliveryEstimate` : id, orderId, distanceKm, tempsPreparation, tempsTrajet, etaMin, etaMax, calculéÀ
- `CourierLocation` : id, courierId, latitude, longitude, timestamp, orderId (si en course)
- `DeliveryInstruction` : id, orderId, instructions, photoUrl (optionnel), contactAlternatif

### 12.2 API REST minimale

#### Endpoints existants
| Méthode | Endpoint | Objet |
|---------|----------|-------|
| GET | `/products` | Liste / recherche produits |
| GET | `/products/:slug` | Fiche produit |
| GET | `/categories` | Catégories |
| POST | `/cart` | Ajouter / créer panier |
| PATCH | `/cart` | Modifier panier |
| POST | `/orders` | Créer commande |
| GET | `/orders/:id` | Suivre commande |
| POST | `/payments` | Initier / confirmer flux paiement |
| GET | `/deliveries` | Livraisons |
| POST | `/admin/products` | Créer produit |
| PATCH | `/admin/products/:id` | Modifier produit |
| GET | `/admin/orders` | Lister commandes |
| PATCH | `/admin/orders/:id/status` | Modifier statut |
| GET | `/admin/dashboard` | KPI opérationnels |

#### Nouveaux endpoints (v1.1)

**Restaurants :**
| Méthode | Endpoint | Objet |
|---------|----------|-------|
| GET | `/restaurants` | Liste des restaurants partenaires |
| GET | `/restaurants/:slug` | Détail d'un restaurant |
| GET | `/restaurants/:id/menu` | Menu d'un restaurant |
| POST | `/admin/restaurants` | Créer un restaurant |
| PATCH | `/admin/restaurants/:id` | Modifier un restaurant |
| GET | `/admin/restaurants/:id/tables` | Tables d'un restaurant |
| POST | `/admin/restaurants/:id/tables` | Ajouter une table |
| PATCH | `/admin/tables/:id` | Modifier une table |

**Personnalisation :**
| Méthode | Endpoint | Objet |
|---------|----------|-------|
| GET | `/customization/options` | Options de personnalisation disponibles |
| GET | `/customization/sides` | Accompagnements disponibles |
| GET | `/customization/beverages` | Boissons disponibles |
| GET | `/customization/extras` | Extras disponibles |
| POST | `/admin/customization/seasonings` | Gérer assaisonnements |
| POST | `/admin/customization/sides` | Gérer accompagnements |
| POST | `/admin/customization/beverages` | Gérer boissons |

**Livraison avancée :**
| Méthode | Endpoint | Objet |
|---------|----------|-------|
| POST | `/delivery/geocode` | Géocoder une adresse |
| POST | `/delivery/calculate` | Calculer distance et estimation |
| GET | `/delivery/estimate/:orderId` | Obtenir estimation pour une commande |
| PATCH | `/orders/:id/delivery-address` | Mettre à jour l'adresse de livraison |
| POST | `/orders/:id/delivery-instructions` | Ajouter instructions de livraison |
| GET | `/delivery/tracking/:orderId` | Suivi en temps réel d'une livraison |
| POST | `/courier/location` | Livreurs : envoyer position |

**Mode restaurant :**
| Méthode | Endpoint | Objet |
|---------|----------|-------|
| POST | `/orders/:id/assign-table` | Associer une commande à une table |
| GET | `/restaurant/:id/tables/status` | Statut des tables d'un restaurant |
| POST | `/qr/validate` | Valider un QR code de table |
| GET | `/orders/table/:tableId` | Commandes associées à une table |

### 12.3 Médias
Images : WebP/AVIF, tailles multiples, compression, lazy loading et CDN. Les uploads admin passent par validation MIME, taille, dimensions et nommage sécurisé.

**Ajout v1.1 :** Possibilité d'uploader des photos de lieu de livraison (instructions), photos de restaurants, plans de salle.

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
- **Support des QR codes (scanner et affichage)**
- **Cartes interactives fonctionnelles en mode limité offline**

### 13.2 Android — état de référence 2026
Au 16 septembre 2026, Google Play indique que les nouvelles applications et les mises à jour doivent cibler Android 16 (API 36) ou supérieur depuis le 31 août 2026, avec une possibilité d'extension jusqu'au 1er novembre 2026. Cette exigence doit être recontrôlée au moment de la soumission. [Source Google Play, vérifiée le 16/09/2026]

**Permissions additionnelles requises :**
- `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION` : pour géolocalisation livraison
- `CAMERA` : pour scan QR code tables
- `POST_NOTIFICATIONS` : pour notifications de suivi

### 13.3 iOS
L'application doit respecter les App Store Review Guidelines, App Privacy, permissions, certificats, provisioning, App Store Connect et exigences techniques en vigueur. Pour les biens physiques consommés hors de l'app, Apple prévoit des méthodes de paiement autres que l'achat intégré, telles qu'Apple Pay ou carte, selon les conditions applicables. [Source Apple, vérifiée le 16/09/2026]

**Permissions additionnelles requises :**
- `NSLocationWhenInUseUsageDescription` : pour géolocalisation
- `NSCameraUsageDescription` : pour scan QR code
- Notifications push pour suivi livraison

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

**Ajouts v1.1 :**
- Sécurisation des APIs de géolocalisation (rate limiting spécifique)
- Protection des données de localisation des clients et livreurs (RGPD/APDP)
- Validation des QR codes de table (token signé, expiration)
- Chiffrement des coordonnées GPS en base de données

### 14.2 Données personnelles
Le projet doit appliquer une logique de minimisation : ne collecter que ce qui est utile au service, définir une finalité, limiter la conservation, protéger les données et documenter les droits des personnes. Au Bénin, l'APDP référence la loi n° 2017-20 du 20 avril 2018 portant Code du numérique ; l'APDP rappelle notamment les droits d'accès, opposition et rectification ainsi que des principes de finalité, pertinence, conservation limitée, sécurité/confidentialité et respect des droits. [Source APDP — Loi n°2017-20] [Source APDP — Protection des données]

**Données de géolocalisation :**
- Finalité : uniquement pour la livraison et l'estimation de temps
- Conservation : limitée à la durée nécessaire + archive légale
- Consentement : explicite avant activation
- Anonymisation : possible pour les statistiques agrégées

### 14.3 Matrice des données

| Donnée | Finalité | Accès | Conservation |
|--------|----------|-------|--------------|
| Identité client | Compte / commande | Client + rôles autorisés | À définir selon obligations et besoin métier |
| Téléphone | Livraison / support / OTP si retenu | Client + livraison + rôles autorisés | À définir |
| Adresse | Livraison | Client + livraison + rôles autorisés | À définir |
| **Coordonnées GPS** | **Géolocalisation livraison** | **Client + livreur + rôles autorisés** | **Durée de la livraison + 30 jours max** |
| Paiement | Transaction / rapprochement | Paiement + rôles autorisés | Selon prestataire / obligations |
| **QR Code table** | **Association commande/table** | **Restaurant + admin** | **Durée d'occupation + 1 an** |
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
| **Données de géolocalisation** | **Loi n°2017-20 / APDP** | **16/09/2026** | **À confirmer** | **Consentement explicite, durée de conservation limitée, anonymisation possible** |

### 15.2 Produits alimentaires / origine animale — à confirmer par source officielle compétente avant production

| Domaine | Statut TDR | Action |
|---------|-----------|--------|
| Abattage / découpe | À confirmer | Identifier textes officiels MAEP / services vétérinaires compétents et exigences par catégorie. |
| Hygiène / conservation | À confirmer | Valider les obligations sanitaires, température et chaîne du froid applicables. |
| Transport | À confirmer | Valider conditions de transport des produits frais et animaux vivants. |
| Traçabilité | À confirmer | Déterminer données obligatoires et durée de conservation. |
| Étiquetage | À confirmer | Valider mentions obligatoires par type de produit. |
| Animaux vivants | À confirmer | Valider autorisations, documents, zones, transport et restrictions. |
| Vente en ligne / consommateur | À confirmer | Valider règles commerciales, information client, facturation et recours. |
| **Restauration commerciale** | **À confirmer** | **Valider exigences pour les restaurants partenaires (hygiène, licences, affichage prix)** |
| **Livraison de repas** | **À confirmer** | **Valider règles spécifiques à la livraison de produits alimentaires préparés** |

### 15.3 Règle de gouvernance
Un tableau réglementaire versionné doit accompagner le projet. Chaque ligne comporte : source officielle, organisme, article/section si disponible, date de vérification, responsable de revue, statut, exigence technique et exigence opérationnelle.

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

**Ajouts v1.1 :**
- Schema.org `Restaurant` pour les établissements partenaires
- Schema.org `Menu` pour les menus de restaurant
- Balisage local pour les restaurants (adresse, horaires, téléphone)

### 16.2 Performance

| Axe | Règle |
|-----|-------|
| Images | WebP/AVIF, dimensions adaptées, lazy loading hors LCP, CDN |
| JS | Réduire JavaScript inutile et charger à la demande |
| Données | Pagination, cache, indexes SQL, API ciblées |
| Réseau | Optimiser pour connexions variables ; états offline explicites |
| UX perçue | Skeletons, transitions courtes, réponse immédiate aux interactions |
| **Cartes** | **Chargement différé des cartes, fallback statique si lent** |
| **Géolocalisation** | **Cache des positions, debounce des updates** |

### 16.3 Analytics
Mesurer : visites, recherche, produits consultés, ajout panier, abandon panier, commandes, conversion, produits populaires, zones de livraison.

**Nouvelles métriques v1.1 :**
- Taux d'utilisation du mode restaurant
- Répartition des modes de consommation (Sur place / À emporter / Livraison)
- Taux d'ajout d'options (assaisonnement, accompagnement, boisson)
- Panier moyen avec/sans options
- Temps moyen de livraison réel vs estimé
- Taux de succès des livraisons
- Restaurants les plus consultés/commandés
- Utilisation de la géolocalisation précise

Les événements analytics doivent respecter la politique de confidentialité et la base légale applicable.

---

## 17 — Tests, QA et critères d'acceptation

### 17.1 Stratégie de tests
- Unit tests : services, calculs, poids, prix, stock, permissions.
- Integration tests : commande, paiement, stock, livraison.
- E2E : visiteur → produit → panier → commande → paiement → confirmation → préparation → livraison.
- Tests mobiles : Android + iOS.
- Tests responsive : plusieurs largeurs et orientations.
- Tests sécurité : authentification, autorisations, entrées malveillantes, upload, rate limiting.
- Tests accessibilité : clavier, contraste, labels, focus, lecteur d'écran sur parcours critiques.

**Nouveaux tests v1.1 :**
- Tests de personnalisation de commande (toutes combinaisons)
- Tests du mode restaurant (Sur place / À emporter / Livraison)
- Tests de géolocalisation (pin drop, calcul distance, estimation)
- Tests QR code (scan, validation, association table)
- Tests de suivi de livraison en temps réel
- Tests de performance des cartes interactives sur réseaux lents

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
| **AC-11 (nouveau)** | **Personnalisation flexible** | **Le client peut commander viande seule, avec options, ou repas complet sans étape obligatoire.** |
| **AC-12 (nouveau)** | **Mode restaurant** | **Un client peut consulter un restaurant, commander et choisir Sur place/À emporter/Livraison.** |
| **AC-13 (nouveau)** | **Association table** | **Une commande Sur place est correctement associée à une table via QR code ou manuel.** |
| **AC-14 (nouveau)** | **Géolocalisation** | **Un client peut positionner précisément son adresse sur une carte avant commande.** |
| **AC-15 (nouveau)** | **Estimation livraison** | **Le temps de livraison estimé est affiché avant paiement et correspond à la réalité (+/- 15%).** |
| **AC-16 (nouveau)** | **Suivi en temps réel** | **Le client peut suivre la position de son livreur pendant la livraison.** |
| **AC-17 (nouveau)** | **Options facultatives** | **Toutes les options (assaisonnement, accompagnement, boisson, extras) peuvent être ignorées.** |

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

**Considérations v1.1 :**
- Service de géolocalisation (Mapbox/Google Maps) : coût à surveiller
- WebSocket pour suivi en temps réel : infrastructure adaptée (Socket.io, Pusher, ou solution maison)
- Stockage des photos de lieux/QR codes : object storage avec CDN

### 18.4 Maintenance
- Surveillance disponibilité/API/DB
- Sauvegardes testées et non seulement configurées
- Patchs de sécurité
- Suivi des erreurs et logs
- Revue mensuelle des performances
- Revue trimestrielle des exigences réglementaires et store policies
- Versionnage des contrats API
- **Surveillance des coûts APIs de géolocalisation**
- **Revue des performances des cartes sur réseaux lents**

---

## 19 — Roadmap, budget et risques

### 19.1 Roadmap

| Phase | Contenu |
|-------|---------|
| **Phase 1 — MVP** | Catalogue, recherche, fiche produit, panier, compte, adresse, commande, paiement, livraison basique, admin, stock basique. |
| **Phase 1.5 — Personnalisation flexible** | Système de commande flexible (viande seule → repas complet), options facultatives, assaisonnements, accompagnements, boissons, extras. |
| **Phase 2 — Mode restaurant & Livraison avancée** | Consultation restaurants, menus, modes de consommation (Sur place/À emporter/Livraison), association tables, QR codes, géolocalisation précise, estimation temps livraison, suivi en temps réel. |
| Phase 3 | Android, iOS, push, fidélité, recommandations, analytics avancés. |
| Phase 4 | IA de recommandation, assistant client, commande vocale, prévision de demande, optimisation stocks. |

### 19.2 Budget estimatif — méthode
Le prompt de référence demande une rubrique budget mais ne fournit pas de chiffrage projet. Le budget doit donc être produit après découpage en lots et estimation de charge ; il ne serait pas fiable d'inventer un montant à ce stade.

| Lot budgétaire | Unité de chiffrage |
|----------------|-------------------|
| UX research + UI design | Jours/homme + ateliers |
| Frontend Web/PWA | Jours/homme / sprint |
| Backend/API/DB | Jours/homme / sprint |
| **Intégration cartes/géolocalisation** | **Jours/homme + coûts APIs** |
| **Développement mode restaurant** | **Jours/homme / sprint** |
| Mobile Flutter | Jours/homme / sprint |
| QA / sécurité | Jours/homme + tests |
| Cloud | Coût mensuel |
| **APIs géolocalisation** | **Coût mensuel (volume dépendant)** |
| Paiements / SMS / WhatsApp | Coût à la transaction / abonnement |
| Maintenance | Forfait mensuel ou annuel |

### 19.3 Risques

| Risque | Impact | Mesure |
|--------|--------|--------|
| Réglementation mal documentée | Très élevé | Revue officielle avant activation des fonctionnalités concernées. |
| Poids variable mal géré | Élevé | Modèle métier séparant estimation/final + audit. |
| Stock périssable | Élevé | Lots, dates, règles de rotation et alertes. |
| Paiement asynchrone | Élevé | Statuts backend, webhooks, idempotence prévue. |
| Réseau instable | Moyen/élevé | PWA, cache, états offline, aucune écriture critique offline. |
| UX trop complexe | Moyen | Tests utilisateurs sur smartphone et itérations Figma. |
| Permissions admin excessives | Élevé | RBAC minimal + audit + principe du moindre privilège. |
| **Coûts APIs géolocalisation imprévus** | **Moyen/élevé** | **Monitoring des volumes, caching agressif, alternatives open-source.** |
| **Adoption mode restaurant faible** | **Moyen** | **Partenariats qualifiés, formation des restaurateurs, marketing ciblé.** |
| **Complexité UX personnalisation** | **Moyen** | **Tests utilisateurs intensifs, progression révélée, defaults intelligents.** |
| **Suivi livraison en temps réel (technique)** | **Moyen** | **WebSocket robuste, fallback polling, gestion déconnexion.** |

---

## 20 — Checklist de mise en production

| Domaine | Avant go-live |
|---------|--------------|
| Produit | Nom/logo final validés ; catalogue réel ; prix ; unités ; stocks ; règles de poids ; découpe ; zones livraison. |
| **Personnalisation** | **Toutes les options configurées (assaisonnements, accompagnements, boissons, extras) ; tests de toutes combinaisons.** |
| **Mode restaurant** | **Restaurants partenaires onboardés ; menus configurés ; tables créées ; QR codes générés ; staff formé.** |
| **Livraison avancée** | **API géolocalisation configurée ; zones de livraison étendues ; estimateurs calibrés ; suivi temps réel testé.** |
| UX/UI | Design system ; responsive 320 px+ ; états ; accessibilité ; contenus ; erreurs compréhensibles. |
| Technique | Build production ; migrations ; variables ; secrets ; monitoring ; backups ; CDN. |
| Paiement | Webhooks ; idempotence ; gestion échec/remboursement ; rapprochement. |
| Sécurité | HTTPS ; RBAC ; rate limiting ; headers ; audit ; tests sécurité. |
| Données | Politique confidentialité ; droits ; conservation ; flux tiers documentés. |
| Réglementation | Matrice officielle validée ; fonctionnalités conditionnelles verrouillées si statut non confirmé. |
| Stores | Android target API 36+ à la soumission 2026 ; Apple checklist et App Privacy revalidées. |
| SEO | Metadata ; sitemap ; robots ; données structurées ; pages produits indexables. |
| QA | Tests unitaires/intégration/E2E ; recette smartphone ; tests erreurs ; tests paiement et livraison. |
| **Nouveaux tests** | **Tests personnalisation ; tests mode restaurant ; tests géolocalisation ; tests QR codes ; tests suivi temps réel.** |
| Exploitation | Runbook incidents ; contacts ; procédures remboursement ; support client ; maintenance. |

---

## Annexe A — Écrans UX/UI à concevoir dans Figma

| Famille | Écran |
|---------|-------|
| Public | Accueil desktop/mobile |
| Public | Catalogue / recherche / résultats |
| Public | Filtre mobile bottom sheet |
| **Public (nouveau)** | **Page restaurant / liste des restaurants** |
| **Public (nouveau)** | **Détail restaurant avec menu** |
| Commerce | Fiche produit standard |
| Commerce | Fiche produit au kg |
| Commerce | Fiche produit poids variable |
| Commerce | Choix de découpe |
| **Commerce (nouveau)** | **Interface de personnalisation (assaisonnement, accompagnement, boisson, extras)** |
| **Commerce (nouveau)** | **Sélecteur de mode de consommation (Sur place / À emporter / Livraison)** |
| Commerce | Panier vide / panier rempli |
| Checkout | Adresse / livraison / créneau |
| **Checkout (nouveau)** | **Géolocalisation sur carte avec pin drop** |
| **Checkout (nouveau)** | **Instructions de livraison avec photo optionnelle** |
| **Checkout (nouveau)** | **Affichage estimation temps livraison avant paiement** |
| Checkout | Récapitulatif et paiement |
| Checkout | Confirmation + suivi |
| **Restaurant (nouveau)** | **Scan QR code table** |
| **Restaurant (nouveau)** | **Sélection manuelle de table** |
| **Restaurant (nouveau)** | **Confirmation commande Sur place avec numéro de table** |
| Compte | Connexion / inscription / récupération |
| Compte | Commandes / détail commande |
| Compte | Favoris / adresses / notifications / avis |
| Admin | Dashboard |
| Admin | Produits / création / modification |
| Admin | Stock / lots / dates |
| Admin | Commande / préparation / pesée |
| Admin | Livraison / affectation |
| **Admin (nouveau)** | **Gestion des restaurants partenaires** |
| **Admin (nouveau)** | **Configuration des menus par restaurant** |
| **Admin (nouveau)** | **Gestion des tables et QR codes** |
| **Admin (nouveau)** | **Vue carte des livraisons en cours** |
| Admin | Utilisateurs / rôles |
| Admin | Audit logs / paramètres |
| Livreur | Tournée / détail / statut / échec |
| **Livreur (nouveau)** | **Navigation GPS vers point de livraison** |
| **Livreur (nouveau)** | **Envoi position en temps réel** |

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
- **Les options sont-elles clairement marquées comme facultatives ?**
- **Le mode de consommation est-il évident et facile à changer ?**
- **La carte de géolocalisation est-elle utilisable sur petit écran ?**
- **L'estimation de livraison est-elle visible avant engagement de paiement ?**

---

## Annexe C — Sources externes vérifiées

Sources utilisées pour les points réglementaires/plateformes qui nécessitent une vérification actuelle :

- **Google Play — Target API level requirements** (consulté le 16/09/2026) : https://support.google.com/googleplay/android-developer/answer/11926878
- **Apple — App Review Guidelines**, section biens et services physiques (consulté le 16/09/2026) : https://developer.apple.com/app-store/review/guidelines/fr/
- **APDP Bénin — Loi n°2017-20 / Code du numérique** : https://archive.apdp.bj/lois/la-loi-n-2017-20-portant-code-du-numerique-en-republique-du-benin/
- **APDP Bénin — Protection des données / droits** : https://archive.apdp.bj/proteger/
- **Gouvernement du Bénin — exemple de politique de confidentialité renvoyant à la loi n°2017-20** : https://gouv.bj/pages/politique-confidentialite/

**Nota :** Les URL ci-dessus sont des références de travail ; les exigences de store et les textes réglementaires doivent être recontrôlés au moment de la conception détaillée, de l'intégration et de la soumission.

---

## Historique des versions

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 16/09/2026 | Version initiale issue du prompt maître |
| **1.1** | **16/09/2026** | **Ajout commande flexible, mode restaurant, livraison géolocalisée avancée** |

---

*Document produit à partir du prompt maître fourni. Les éléments réglementaires explicitement marqués « à confirmer » restent soumis à validation juridique/administrative avant mise en production.*
