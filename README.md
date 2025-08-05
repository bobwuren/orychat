# Orientys Dashboard Admin

Dashboard d'administration pour la plateforme Orientys - un système de gestion d'orientation scolaire qui aide les étudiants à faire des choix éclairés pour leur avenir académique.

## Description

Cette application d'administration permet de gérer :
- Les utilisateurs (étudiants, administrateurs)
- Les données académiques (séries, matières, universités, diplômes)  
- Les recommandations d'orientation
- Les notes et évaluations

## Technologies utilisées

- **Next.js 15.4.2** - Framework React avec App Router
- **React 19.1.0** - Bibliothèque UI
- **TypeScript 5** - Langage de programmation typé
- **Tailwind CSS 4** - Framework CSS utilitaire
- **Shadcn UI** - Composants UI accessibles
- **Axios** - Client HTTP
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas

## Installation

1. Cloner le repository
```bash
git clone https://github.com/Darrylwin/orientys-dashboard-admin.git
cd orientys-dashboard-admin
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer l'environnement
Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
```

4. Lancer le serveur de développement
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3005](http://localhost:3005).

## Structure du projet

```
├── app/                    # Pages (App Router)
│   ├── (dashboard)/       # Routes protégées
│   │   ├── users/        # Gestion des utilisateurs
│   │   ├── series/       # Gestion des séries
│   │   ├── subjects/     # Gestion des matières
│   │   ├── universities/ # Gestion des universités
│   │   ├── degrees/      # Gestion des diplômes
│   │   └── recommendations/ # Gestion des recommandations
│   └── login/            # Page de connexion
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI de base
│   ├── auth/            # Authentification
│   └── [feature]/       # Composants par fonctionnalité
├── lib/                 # Utilitaires et services
│   ├── services/        # Services API
│   ├── cache.ts         # Gestion du cache
│   └── utils.ts         # Utilitaires
├── types/               # Types TypeScript
└── hooks/               # Hooks personnalisés
```

## Fonctionnalités

### Authentification
- Connexion sécurisée avec JWT
- Protection des routes avec middleware
- Gestion automatique des tokens

### Gestion des données
- **Utilisateurs** : Liste, filtres, actions CRUD
- **Séries académiques** : Gestion des filières d'études
- **Matières** : Gestion des matières avec coefficients
- **Universités** : Base de données des établissements
- **Diplômes** : Catalogue des formations
- **Recommandations** : Suivi des orientations

### Interface utilisateur
- Design responsive avec Tailwind CSS
- Composants accessibles (Radix UI)
- Tables de données avancées avec tri et filtres
- Graphiques interactifs
- Mode sombre/clair

## Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production  
npm run start    # Serveur de production
npm run lint     # Vérification du code
```

## Architecture

L'application utilise une architecture en couches :
- **Pages** : Interface utilisateur et routing
- **Components** : Composants réutilisables
- **Services** : Logique métier et API
- **Types** : Définitions TypeScript

### Services API
- Service générique CRUD avec TypeScript
- Services spécialisés par entité
- Gestion centralisée des erreurs
- Cache intelligent avec TTL

## Déploiement

1. Build de production
```bash
npm run build
```

2. Variables d'environnement pour production
```env
NEXT_PUBLIC_API_URL=https://api.orientys.com
NEXT_PUBLIC_APP_ENV=production
```

3. Plateformes recommandées : Vercel, Netlify

## Contribution

1. Fork du projet
2. Créer une branche feature
3. Commiter les changements
4. Créer une Pull Request
