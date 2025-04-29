# NoteFlex - Application de prise de notes avec canevas interactif

NoteFlex est une application web de prise de notes qui permet aux utilisateurs de créer et d'organiser des notes dans un canevas interactif. Chaque note peut contenir des éléments déplaçables comme du texte avec mise en forme, des liens web/YouTube et des images.

## Fonctionnalités

- **Authentification sécurisée** : Inscription, connexion et réinitialisation de mot de passe
- **Liste des notes** : Affichage des notes avec aperçu (titre, date)
- **Éditeur de note avec canevas** : Ajout, édition, déplacement (drag-and-drop) et suppression d'éléments
- **Texte** : Mise en forme (gras, italique, taille, couleur)
- **Liens** : Aperçu YouTube (iframe) ou lien cliquable
- **Images** : Upload (jpg/png, max 5MB) et affichage redimensionnable
- **Interface responsive** : Adaptation pour mobile (éléments empilés)
- **Suppression des données utilisateur** : Conformité RGPD

## Technologies utilisées

- **Frontend** : React.js, Next.js, Tailwind CSS
- **Backend** : Node.js (via Next.js API routes)
- **Base de données** : MySQL
- **Authentification** : JWT (JSON Web Tokens)

## Installation

### Prérequis

- Node.js (v14 ou supérieur)
- MySQL

### Configuration de la base de données

1. Créez une base de données MySQL
2. Exécutez le script SQL fourni dans `db-schema.sql` pour créer les tables et insérer des données de test

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```bash
DB_HOST=localhost
DB_USER=votre_utilisateur_mysql
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=noteflex
JWT_SECRET=votre_cle_secrete
```

### Installation des dépendances

```bash
npm install
```

### Démarrage de l'application

```bash
npm run dev
```

L'application sera accessible à l'adresse http://localhost:3000

## Structure du projet

- `/app` - Pages et routes de l'application Next.js
- `/components` - Composants React réutilisables
- `/lib` - Utilitaires et fonctions d'aide
- `/public` - Fichiers statiques

## API REST

L'API REST est implémentée via les API routes de Next.js :

### Authentification

- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion d'un utilisateur
- `POST /api/auth/logout` - Déconnexion d'un utilisateur
- `GET /api/auth/session` - Vérification de la session utilisateur
- `POST /api/auth/forgot-password` - Demande de réinitialisation de mot de passe

### Notes

- `GET /api/notes` - Récupération de toutes les notes de l'utilisateur
- `POST /api/notes` - Création d'une nouvelle note
- `GET /api/notes/:id` - Récupération d'une note spécifique
- `PUT /api/notes/:id` - Mise à jour d'une note
- `DELETE /api/notes/:id` - Suppression d'une note

## Données de test

L'application est préchargée avec deux utilisateurs de test :

1. **Jean Dupont**
   - Email: jean@example.com
   - Mot de passe: password123

2. **Marie Martin**
   - Email: marie@example.com
   - Mot de passe: password123

## Licence

Ce projet est sous licence MIT.
