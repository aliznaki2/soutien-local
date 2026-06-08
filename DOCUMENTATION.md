# Documentation de l'Architecture du Projet

Ce document décrit en détail la structure des dossiers et l'utilité des fichiers principaux pour l'ensemble du projet (Frontend en React et Backend en Laravel). Ce guide est très utile pour comprendre l'architecture globale, que ce soit pour vous ou pour intégrer dans un rapport de stage.

---

## 1. Architecture Globale

Le projet est divisé en deux grandes parties :
- **`backend/`** : Contient l'API développée en PHP avec le framework Laravel. Il gère la base de données, la logique métier et l'authentification.
- **`frontend/`** : Contient l'application côté client développée en JavaScript avec la bibliothèque React.js. Il gère l'interface utilisateur.

---

## 2. Le Frontend (React.js)
Dossier racine : `frontend/`

Ce dossier suit la structure classique générée par `Create React App`.

### Fichiers à la racine de `frontend/`
- **`package.json`** : Liste toutes les dépendances (bibliothèques) du projet React (ex: react, react-router-dom, axios) et définit les scripts (`npm start`, `npm build`, `npm test`).
- **`public/`** : Contient les fichiers statiques de base (index.html, favicon.ico). C'est le point d'entrée du navigateur.

### Le dossier `frontend/src/`
C'est ici que se trouve tout votre code source React.

#### A. Les fichiers de base
- **`index.js`** : Le point d'entrée principal de l'application React. C'est lui qui attache l'application React au fichier `index.html`.
- **`App.js`** : Le composant racine qui englobe toute l'application. C'est généralement ici qu'on configure les routes (navigation) avec React Router.
- **`index.css` & `App.css`** : Les fichiers de style globaux.

#### B. Les sous-dossiers
- **`components/`** : Contient tous les **composants réutilisables** de l'interface (les "briques" de l'application).
  - *Exemples : `Header.js`, `SearchBar.js`, `BookingModal.js`...*
  - Ce dossier permet de ne pas dupliquer le code. Si on a besoin d'un bouton de recherche sur plusieurs pages, on importe simplement le composant `SearchBar`.
  - On y trouve aussi des fichiers `.test.js` (ex: `SearchBar.test.js`) pour tester ces composants.

- **`pages/`** : Contient les **vues complètes** de l'application. Chaque fichier correspond généralement à une URL spécifique.
  - *Exemples : `HomePage.js` (Accueil), `ProfilePage.js` (Profil), `ChatPage.js`.*
  - Ce dossier est souvent organisé en sous-dossiers :
    - `auth/` : Pages de connexion et d'inscription (`LoginPage.js`, `RegisterPage.js`).
    - `admin/` : Pages réservées à l'administrateur.

- **`context/`** : Contient la **gestion d'état global** de l'application (React Context API).
  - *Exemple : `AuthContext.js`* : Conserve l'état de l'utilisateur connecté (ses infos, son token) pour qu'elles soient accessibles partout sans avoir à les passer de parent à enfant.
  - *Exemple : `ToastContext.js`* : Gère l'affichage des petites notifications flash.

- **`services/`** : Gère les **communications avec le backend**.
  - Contient généralement des fichiers avec des fonctions utilisant `axios` ou `fetch` pour faire des requêtes HTTP (GET, POST, PUT, DELETE) vers l'API Laravel.

- **`data/`** : Contient parfois des données statiques (fichiers JSON) pour simuler une base de données ou stocker des listes (ex: liste des villes).

---

## 3. Le Backend (Laravel)
Dossier racine : `backend/`

C'est une application PHP basée sur l'architecture MVC (Modèle-Vue-Contrôleur).

### Fichiers importants à la racine
- **`.env`** : Fichier extrêmement critique. Il contient les variables d'environnement locales (identifiants de la base de données MySQL, clés secrètes, configuration email). *Il ne doit jamais être partagé sur GitHub.*
- **`composer.json`** : L'équivalent de `package.json` mais pour PHP. Liste les dépendances installées via le gestionnaire Composer.
- **`artisan`** : Un script en ligne de commande propre à Laravel qui permet de générer des fichiers, lancer des migrations, etc. (ex: `php artisan serve`).

### Les sous-dossiers principaux

- **`app/`** : Le cœur de l'application backend.
  - **`Http/Controllers/`** : Contient les **Contrôleurs**. Ce sont eux qui reçoivent les requêtes du Frontend, interrogent la base de données, et renvoient une réponse (souvent au format JSON).
  - **`Models/`** : Contient les **Modèles**. Chaque modèle représente une table de la base de données (ex: `User.php` correspond à la table `users`).
  - **`Http/Middleware/`** : Filtres de requêtes (ex: vérifier si un utilisateur a bien un token valide avant de le laisser accéder à une route).

- **`routes/`** : Définit les URL (points d'accès) de l'API.
  - **`api.php`** : C'est ici que vous définissez les routes API (ex: `Route::post('/login', [AuthController::class, 'login'])`) que le Frontend va appeler.

- **`database/`** : Gère la base de données.
  - **`migrations/`** : Fichiers qui créent ou modifient les tables de la base de données de manière versionnée (comme un historique).
  - **`seeders/`** : Scripts pour remplir la base de données avec des fausses données de test.

- **`config/`** : Tous les fichiers de configuration globale (base de données, CORS, authentification).

- **`storage/`** : Contient les fichiers générés par Laravel, comme les logs d'erreurs (`storage/logs/laravel.log`) ou les images uploadées par les utilisateurs (`storage/app/public/`).

- **`tests/`** : Contient les tests automatisés pour le backend (Tests unitaires PHPUnit ou Pest).

- **`vendor/`** : L'équivalent de `node_modules`. Contient toutes les bibliothèques PHP téléchargées par Composer.

---

### Résumé du flux d'information (Comment ça marche ensemble ?)

1. L'utilisateur clique sur "Se connecter" sur le site (**Frontend - `pages/auth/LoginPage.js`**).
2. Le frontend utilise un service HTTP (**`services/api.js`**) pour envoyer une requête POST à `http://127.0.0.1:8000/api/login`.
3. Le backend reçoit la requête via **`routes/api.php`**.
4. La route dirige la requête vers un contrôleur (**`app/Http/Controllers/AuthController.php`**).
5. Le contrôleur interroge le modèle (**`app/Models/User.php`**) pour vérifier l'email et le mot de passe dans la base de données.
6. Le backend renvoie une réponse JSON (succès avec un Token, ou erreur).
7. Le frontend reçoit la réponse, enregistre l'utilisateur dans le **`context/AuthContext.js`** et le redirige vers la page d'accueil.

---

## 4. Comment exécuter le projet en local

Puisque le projet est composé de deux parties distinctes, vous devez lancer **deux terminaux** (invites de commande) en même temps.

### Étape 1 : Lancer le Backend (Serveur API)
Ouvrez un premier terminal et tapez ces commandes :
```bash
# 1. Allez dans le dossier backend
cd backend

# 2. Démarrez le serveur Laravel
php artisan serve
```
Le backend va tourner sur `http://127.0.0.1:8000`. Laissez ce terminal ouvert en arrière-plan.

### Étape 2 : Lancer le Frontend (Interface Client)
Ouvrez un **deuxième** terminal (sans fermer le premier) et tapez ces commandes :
```bash
# 1. Allez dans le dossier frontend
cd frontend

# 2. Démarrez le serveur React
npm start
```
Le frontend va s'ouvrir automatiquement dans votre navigateur sur `http://localhost:3000`.

**Note importante :** Le frontend a besoin que le backend soit allumé pour fonctionner. C'est pourquoi le terminal du `php artisan serve` doit toujours rester ouvert pendant que vous codez ou que vous testez l'application.
