# Orientys

Application d'orientation scolaire développée avec Next.js qui aide les étudiants à obtenir des recommandations d'orientation basées sur leurs notes et leur filière académique.

## Description

Orientys permet aux étudiants de saisir leurs notes par matière selon leur série (filière) et génère des recommandations personnalisées pour leurs études supérieures en tenant compte des coefficients des matières.

Le projet utilise une interface moderne et responsive, avec une gestion efficace des données utilisateur et une communication sécurisée avec le backend via API REST.

## Fonctionnalités principales

- Authentification (connexion/inscription)
- Sélection de série académique
- Saisie des notes par matière
- Génération de recommandations d'orientation
- Historique des recommandations

## Technologies

- Next.js 15.4.4 (React 19.1.0)
- TypeScript
- Tailwind CSS 4.1.11
- Shadcn UI Components
- Axios pour les appels API
- JWT pour l'authentification

## Structure du projet

```
orientys/
├── app/                    # Pages et routes (Next.js App Router)
│   ├── dashboard/          # Sélection de série
│   ├── login/              # Authentification
│   ├── notes-entering/     # Saisie des notes
│   ├── recommendation/     # Affichage des recommandations
│   └── summary/            # Récapitulatif des notes
├── components/             # Composants React réutilisables
│   ├── auth/               # Composants d'authentification
│   ├── custom-comps/       # Composants personnalisés
│   ├── navigation/         # Barre de navigation
│   └── ui/                 # Composants UI génériques
├── hooks/                  # Hooks personnalisés
├── lib/                    # Utilitaires et services
│   └── services/           # Services API
├── public/                 # Fichiers statiques
└── types/                  # Types TypeScript
```

## Installation et configuration

```bash
# Cloner le dépôt
git clone https://github.com/Darrylwin/orientys-web.git
cd orientys-web

# Installation des dépendances
npm install

# Configuration des variables d'environnement
# Créer un fichier .env.local avec:
# NEXT_PUBLIC_API_URL=<URL_DE_VOTRE_API_BACKEND>

# Lancement du serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Une API backend compatible (voir la documentation API)

## Déploiement

```bash
# Construction pour la production
npm run build

# Lancement en mode production
npm start
```

## Architecture et services

L'application est construite avec une architecture client-serveur et comprend les services suivants:

- **apiService**: Gestion des requêtes HTTP et tokens JWT avec refresh automatique
- **serieService**: Gestion des filières académiques
- **noteService**: Enregistrement et récupération des notes
- **recommendationService**: Génération et consultation des recommandations

## Modèle de données

L'application utilise quatre types principaux:
- `Serie` : Filière académique avec ses matières
- `Subject` : Matière avec coefficient
- `Note` : Note d'un étudiant pour une matière
- `Recommendation` : Recommandation d'orientation générée avec parcours suggérés

## Fonctionnalités de sécurité

- Authentification par token JWT (accès et rafraîchissement)
- Protection des routes côté client
- Gestion automatique des sessions expirées
- Stockage sécurisé des informations utilisateur
