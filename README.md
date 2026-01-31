# Plateforme de Billetterie & Fan Engagement (Cameroun)

## PRD (Product Requirements Document)

### 1. Vision du Produit
**Objectif** : Creer l'ecosysteme numerique leader au Cameroun pour le sport et le divertissement, en commencant par une solution de billetterie mobile ultra-fiable.  
**Probleme resolu** : Difficulte d'acces aux billets physiques, fraude, et manque de donnees sur les fans a Douala et Yaounde.  
**Valeur Unique** : Une interface premium "look europeen", mais optimisee techniquement pour les realites locales (Paiement Mobile Money, usage offline, faible consommation de data).

### 2. Public Cible (Personas)
- **Le Fan (15-35 ans)** : Reside a Douala/Yaounde, passionne de foot et de musique, utilise principalement son smartphone et le Mobile Money.
- **L'Organisateur** : Promoteur de concerts ou clubs de football (Elite One) cherchant a securiser ses recettes et connaitre son audience.
- **L'Administrateur (Controleur)** : Personnel a l'entree des stades/salles devant scanner les billets rapidement, meme avec une connexion instable.

### 3. Specifications Fonctionnelles (MVP)
**A. Module Utilisateur (Fan)**  
- Onboarding : Authentification via numero de telephone (+237) avec verification OTP.  
- Catalogue : Navigation fluide entre les evenements Sport, Art et Divertissement.  
- Achat : Selecteur de categorie (VIP, Tribune, Classique) et integration du flux de paiement Orange/MTN Money.  
- Wallet Numerique : Stockage des billets avec QR Code securise genere localement.  
- Mode Offline : Possibilite d'afficher son billet et son QR Code sans connexion internet.  

**B. Module Securite & Anti-Fraude**  
- QR Code Dynamique : Empeche la reutilisation d'un billet deja scanne.  
- Protection Capture d'ecran : (Optionnel/Technique) Filigrane mouvant ou blocage systeme des screenshots.  

**C. Module Organisateur (Admin)**  
- Scanner integre : Utilisation de la camera du smartphone pour valider les entrees.  
- Dashboard temps reel : Suivi du nombre d'entrees validees vs billets vendus.  

### 4. Specifications Techniques (Stack)
| Composant | Technologie |
| --- | --- |
| Frontend | React Native (Expo) + TypeScript |
| UI/UX | NativeWind (Tailwind CSS) |
| Icons | Lucide React Native |
| Base de donnees | Supabase (PostgreSQL) |
| QR Code | react-native-qrcode-svg |
| Paiement | Mock API (Futur : CinetPay / Monetbil) |

### 5. Feuille de Route de Developpement (Roadmap Cursor)
**Etape 1 : Fondations (Semaine 1) - Actuel**  
- Initialisation de la structure avec le Prompt Maitre.  
- Design des ecrans principaux (Home, Auth, Ticket).  
- Mise en place de la navigation (React Navigation).  

**Etape 2 : Moteur Transactionnel (Semaine 2)**  
- Developpement du service de paiement Mobile Money simule.  
- Gestion des etats de commande (Success / Pending / Failed).  
- Generation et stockage du QR Code dans le telephone.  

**Etape 3 : Optimisation Locale (Semaine 3)**  
- Mise en cache des images pour economiser le forfait data.  
- Tests de performance en condition de reseau "3G degradee".  
- Finalisation du mode "Scanner" pour l'admin.  

### 6. Indicateurs de Succes (KPIs)
- Temps de transaction : Moins de 45 secondes pour acheter un billet.  
- Poids de l'application : Moins de 25 Mo (pour faciliter le telechargement au pays).  
- Fiabilite offline : 100% des billets achetes doivent etre accessibles sans reseau.  
