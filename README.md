# Orientys API

**API REST** pour l’application mobile d’orientation scolaire Orientys.  
Permet aux étudiants de gérer leur parcours, de saisir leurs notes, d’obtenir des recommandations personnalisées grâce à
l’IA, et aux équipes pédagogiques d’administrer les séries/matières.

---

## 🧩 Fonctionnalités principales

- **Authentification sécurisée** (JWT, refresh token)
- **Gestion des séries et matières** (CRUD, association)
- **Saisie et suivi des notes** (batch, par utilisateur/série)
- **Recommandations personnalisées** (génération IA)
- **Documentation interactive** via Swagger

---

## 🚀 Installation rapide

```bash
# Clone le projet
git clone https://github.com/Darrylwin/orientys-api.git
cd orientys-api

# Installe les dépendances
npm install

# Configure ton .env
cp .env.example .env
# Modifie le fichier .env avec tes infos
```

---

## 🛠️ Configuration

### Variables d’environnement (.env)

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=orientys_db
GROQ_API_KEY=ta_cle_groq
JWT_ACCESS_SECRET=ta_cle_jwt_access
JWT_REFRESH_SECRET=ta_cle_jwt_refresh
NODE_ENV=ton_environnement (development/production)
```

### Base de données

```bash
# Crée la base avec le SQL fourni
mysql -u root -p < config/database/db.sql

# (Optionnel) Insère des données de test
node config/database/seed.js
```

---

## 🏃‍♂️ Démarrage

```bash
npm run dev
# Serveur sur http://localhost:3000
```

---

## 📚 Documentation API

Swagger UI disponible : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🔗 Endpoints principaux

| Méthode | Endpoint                                 | Description                                     |
|---------|------------------------------------------|-------------------------------------------------|
| POST    | /api/auth/login                          | Connexion utilisateur                           |
| POST    | /api/auth/register                       | Inscription utilisateur                         |
| POST    | /api/auth/refresh                        | Rafraîchir le token                             |
| POST    | /api/auth/logout                         | Déconnexion (token requis)                      |
| GET     | /api/series                              | Toutes les séries                               |
| GET     | /api/series/{id}                         | Détail d'une série                              |
| POST    | /api/series                              | Créer une série                                 |
| PUT     | /api/series/{id}                         | Modifier une série                              |
| DELETE  | /api/series/{id}                         | Supprimer une série                             |
| GET     | /api/subjects                            | Toutes les matières                             |
| GET     | /api/subjects/{id}                       | Détail d'une matière                            |
| POST    | /api/subjects                            | Créer une matière                               |
| PUT     | /api/subjects/{id}                       | Modifier une matière                            |
| DELETE  | /api/subjects/{id}                       | Supprimer une matière                           |
| GET     | /api/subjects/serie/{serieId}            | Matières d'une série                            |
| GET     | /api/subjects/{id}/coefficients          | Coeffs d'une matière par série                  |
| GET     | /api/notes                               | Toutes les notes                                |
| GET     | /api/notes/{id}                          | Détail d'une note                               |
| POST    | /api/notes/save                          | Sauvegarder des notes (batch)                   |
| PUT     | /api/notes/{id}                          | Modifier une note                               |
| DELETE  | /api/notes/{id}                          | Supprimer une note                              |
| GET     | /api/notes/user/{userId}                 | Notes d'un user                                 |
| GET     | /api/notes/serie/{serieId}               | Notes d'une série                               |
| GET     | /api/notes/user/{userId}/serie/{serieId} | Notes d'un user pour une série                  |
| POST    | /api/recommendations/save                | Sauvegarder une reco manuelle                   |
| POST    | /api/recommendations/generate            | Générer une reco IA                             |
| GET     | /api/recommendations                     | Historique des recommandations de l'utilisateur |
| GET     | /api/recommendations/{id}                | Détail d'une recommandation                     |
| DELETE  | /api/recommendations/{id}                | Supprimer une recommandation                    |

---

## 📝 Exemples de payloads

### Auth - Login

```json
{
  "email": "user@email.com",
  "password": "motdepasse"
}
```

### Auth - Register

```json
{
  "email": "user@email.com",
  "password": "motdepasse",
  "name": "John Doe"
}
```

### Sauvegarder des notes (batch)

```json
[
  {
    "userId": "<id_user>",
    "subjectId": "<id_matiere>",
    "serieId": "<id_serie>",
    "value": 15
  },
  {
    "userId": "<id_user>",
    "subjectId": "<id_matiere>",
    "serieId": "<id_serie>",
    "value": 12
  }
]
```

### Générer une recommandation IA

```json
{
  "serieId": "<id_serie>",
  "notes": [
    {
      "id": "<id_note>",
      "subjectId": "<id_matiere>",
      "value": 15
    }
  ]
}
```

---

## 💡 Conseils & astuces

- Toutes les routes (hors login/register/refresh) sont protégées par token (Bearer dans l'Authorization header).
- Les IDs sont en INT auto increment.
- Si tu veux reset la base, relance le seed : `node config/database/seed.js`
- Swagger UI te permet de tester tous les endpoints facilement.

---

## 👥 Contribution

Les PRs sont bienvenues!  
Pour contribuer: fork le repo, crée une branche, propose tes modifications et soumets une PR.

---

## 📬 Contact & À propos

Développé par Darrylwin.  
Pour toute question, problème ou suggestion: ouvre une issue sur GitHub.

---

**Orientys API**: Ta boussole numérique pour l’orientation scolaire, propulsée par l’intelligence artificielle.