# PermisSN — plateforme complète

PermisSN est une plateforme Angular + Laravel 12 + MySQL pour gérer le parcours d'un candidat au Code de la route : comptes, dossiers, rendez-vous, sessions, convocations, QR Code, présence et résultats.

## Comptes initiaux

Ces comptes sont créés uniquement lors de `php artisan migrate:fresh --seed` :

| Rôle | Identifiant | Email | Mot de passe |
|---|---|---|---|
| Administrateur | `ADM-CAST-001` | `admin@permis.sn` | `Adm@2026!` |
| Agent | `AGT-CAST-001` | `agent.castors@permis.sn` | `Agt@2026!` |
| Candidat | `CND-2026-00001` | `moussa.diop@permis.sn` | `Cnd@2026!` |

Chaque compte possède son propre identifiant. L'administrateur peut ensuite créer les autres comptes depuis **Administration → Comptes utilisateurs**.

## Rôles

### Administrateur
Accès global : candidats, agents, comptes, sessions, salles, réservations, statistiques, supervision et administration.

### Agent
Accès opérationnel : sessions qui lui sont destinées, contrôle QR Code, présence/émargement et saisie des résultats.

### Candidat
Accès uniquement à son espace : profil, dossier, documents, réservation, convocation, QR Code et résultats.

Les contrôles de rôle sont réalisés **côté Laravel** avec Sanctum + middleware `role`, et côté Angular avec les guards. Cacher un bouton dans Angular ne suffit donc pas à obtenir un accès administrateur.

## Installation Windows / XAMPP

### 1. Prérequis
- PHP 8.2+
- Composer
- Node.js + npm
- MySQL/MariaDB (XAMPP recommandé)

### 2. Base MySQL
Créer une base vide nommée :

`permissn_db`

Le compte XAMPP par défaut est généralement :
- utilisateur : `root`
- mot de passe : vide

Si ton MySQL utilise un autre mot de passe, modifier `backend/.env`.

### 3. Installation
Double-cliquer sur :

`setup.bat`

Le script installe Composer/npm, génère la clé Laravel et exécute les migrations + seeders.

### 4. Démarrage
Double-cliquer sur :

`start-backend.bat`

puis :

`start-frontend.bat`

Application : `http://localhost:4200`
API : `http://127.0.0.1:8000`

## Important

Le ZIP ne contient ni `vendor` ni `node_modules`. Ils sont générés par `setup.bat`.

Pour repartir de zéro en développement :

```bash
cd backend
php artisan migrate:fresh --seed
```

Cette commande recrée la base et les trois comptes initiaux.
