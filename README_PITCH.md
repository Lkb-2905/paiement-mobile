## Résumé technique (Pitch)

Plateforme mobile de billetterie et fan engagement conçue pour le Cameroun :
interface premium, performance locale et sécurité anti-fraude.

### Points forts
- **Architecture Supabase** : Postgres + Auth + RLS pour sécuriser l’accès
  aux profils, transactions et billets.
- **Flux d’achat robuste** : transaction `pending` → confirmation → création du
  billet, traçabilité complète par utilisateur et moyen de paiement.
- **QR dynamique anti‑fraude** : le QR change toutes les 30s et est validé
  côté serveur via `qr_code_hash`.
- **Mode offline contrôlé** : billets accessibles localement, synchronisés dès
  que la connexion revient.
- **Admin scanning sécurisé** : seul un profil `admin` peut passer
  `is_scanned = true` en base, empêchant la réutilisation.

### Évolutivité long terme
- Ajout facile de nouveaux modules (merchandising, publicité, contenus VIP).
- Le modèle de données (events → categories → transactions → tickets) reste
  stable et extensible sur 10 ans.

### Données & Analytics
- Historique précis des ventes, validation d’entrée et comportement utilisateur.
- Base fiable pour KPI, partenariats et monétisation.
