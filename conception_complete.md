
# Conception UML Complète - Écosystème Orientys (Description Textuelle)

Ce document contient la modélisation UML complète de l'écosystème Orientys, décrite entièrement en texte, conformément à l'analyse du code source et des exigences.

---

## 1. Diagramme de Cas d'Utilisation

Ce diagramme identifie les acteurs du système et les actions qu'ils peuvent accomplir.

*   **Acteurs :**
    *   **Étudiant :** L'utilisateur principal de l'application mobile.
    *   **Administrateur :** L'utilisateur de l'application de gestion.
    *   **Service d'IA (Groq) :** Le système externe qui fournit les recommandations.

*   **Cas d'utilisation pour l'Étudiant :**
    *   **S'authentifier :** Se connecter à son compte.
    *   **Saisir ses notes :** Enregistrer ses notes pour une série donnée.
    *   **Obtenir une recommandation IA :** Lancer l'analyse de ses notes pour recevoir des suggestions. Ce cas d'utilisation dépend de la saisie préalable des notes.
    *   **Consulter son historique :** Revoir les recommandations passées.

*   **Cas d'utilisation pour l'Administrateur :**
    *   **S'authentifier :** Se connecter à son compte d'administration.
    *   **Gérer les Séries :** Créer, lire, mettre à jour et supprimer les séries d'études (ex: "Terminale D").
    *   **Gérer les Matières :** Créer, lire, mettre à jour et supprimer les matières, et définir leurs coefficients par série.
    *   **Gérer les Universités :** Créer, lire, mettre à jour et supprimer les universités partenaires et leurs informations.

---

## 2. Diagramme de Classes (Architecture Backend)

Ce diagramme décrit les principales briques logicielles du serveur backend et leurs relations.

*   **Couche API (API Layer) :**
    *   **Routes :** Définit les points d'entrée de l'API (ex: `/api/series`, `/api/recommendations/generate`).
    *   **Middlewares :** Contient `authMiddleware` qui intercepte les requêtes pour valider le token JWT et s'assurer que l'utilisateur est bien authentifié.

*   **Couche des Contrôleurs (Controllers) :**
    *   **Description :** Reçoit les requêtes HTTP après leur passage par les middlewares. Elle valide les données de la requête, appelle les services ou modèles appropriés, et formate la réponse finale (succès ou erreur).
    *   **Composants :** `AuthController`, `RecommendationController`, `SerieController`, `SubjectController`, `NoteController`, `UniversityController`.
    *   **Logique d'autorisation :** Les contrôleurs de gestion (`SerieController`, `SubjectController`, etc.) contiennent la logique pour vérifier si l'utilisateur authentifié a le rôle "admin" avant d'autoriser les opérations de modification (création, mise à jour, suppression).

*   **Couche des Services (Services) :**
    *   **Description :** Contient la logique métier complexe qui ne relève ni du contrôleur (gestion HTTP) ni du modèle (accès BDD).
    *   **Composants :**
        *   `AuthService` : Gère la création des utilisateurs, la comparaison des mots de passe, et la génération des tokens JWT.
        *   `AIService` : Orchestre la génération des recommandations. Il récupère les données contextuelles, construit le prompt, appelle l'API d'IA externe, et formate la réponse.

*   **Couche d'Accès aux Données (Models) :**
    *   **Description :** C'est la seule couche qui communique directement avec la base de données. Chaque modèle correspond à une table de la base de données et contient les fonctions pour lire ou écrire des données (ex: `findById`, `getAll`, `create`).
    *   **Composants :** `UserModel`, `SerieModel`, `SubjectModel`, `NoteModel`, `RecommendationModel`, `UniversityModel`.

*   **Relations Principales :**
    *   Une `Route` est liée à une fonction d'un `Contrôleur`.
    *   Un `Contrôleur` utilise un ou plusieurs `Services` et/ou `Modèles`.
    *   Un `Service` peut utiliser plusieurs `Modèles` pour accomplir sa tâche.

---

## 3. Descriptions Détaillées de Tous les Cas d'Utilisation

### Pour l'Étudiant

*   **Cas d'Utilisation : S'authentifier**
    *   **Acteur :** Étudiant.
    *   **Objectif :** Accéder à son compte personnel.
    *   **Déroulement :** 1. L'étudiant saisit son email/mot de passe. 2. L'application appelle l'API `/login`. 3. Le `AuthService` valide les identifiants. 4. Si la validation réussit, le service génère et renvoie des tokens d'accès et de rafraîchissement. 5. L'application stocke les tokens pour les requêtes futures.
    *   **Exception :** Si les identifiants sont incorrects, le backend renvoie une erreur 401.

*   **Cas d'Utilisation : Saisir ses notes**
    *   **Acteur :** Étudiant (connecté).
    *   **Objectif :** Enregistrer ses notes pour une série afin d'obtenir des recommandations.
    *   **Déroulement :** 1. L'étudiant sélectionne une série. 2. L'application affiche les matières correspondantes. 3. L'étudiant saisit ses notes. 4. L'application envoie un tableau de notes à l'API `/notes/save`. 5. Le backend valide chaque note et les enregistre dans la base de données.
    *   **Exception :** Si une note est invalide (ex: 25/20), le backend renvoie une erreur.

*   **Cas d'Utilisation : Obtenir une recommandation IA**
    *   **Acteur :** Étudiant (connecté).
    *   **Objectif :** Recevoir une recommandation d'orientation personnalisée.
    *   **Déroulement :** 1. L'étudiant clique sur "Générer une recommandation". 2. L'application envoie les notes et la série à l'API `/recommendations/generate`. 3. Le `AIService` est appelé, il récupère le contexte (matières, universités), construit un prompt et interroge l'IA externe. 4. L'IA répond. 5. Le service sauvegarde la réponse en base de données et la renvoie à l'application, qui l'affiche.
    *   **Exception :** Si l'IA ne répond pas ou si la réponse est mal formée, une erreur est affichée.

*   **Cas d'Utilisation : Consulter son historique**
    *   **Acteur :** Étudiant (connecté).
    *   **Objectif :** Voir les recommandations précédemment générées.
    *   **Déroulement :** 1. L'étudiant accède à l'écran d'historique. 2. L'application appelle l'API `/recommendations`. 3. Le backend récupère toutes les recommandations de l'utilisateur depuis la base de données et les renvoie. 4. L'application affiche la liste.
    *   **Exception :** Si l'historique est vide, un message l'indique.

### Pour l'Administrateur

*   **Cas d'Utilisation : Gérer les Séries / Matières / Universités (CRUD)**
    *   **Acteur :** Administrateur (connecté).
    *   **Objectif :** Maintenir les données de référence du système.
    *   **Déroulement (exemple pour la création) :** 1. L'admin remplit un formulaire pour créer une nouvelle série. 2. L'application admin appelle l'API `POST /series`. 3. Le backend valide le token et vérifie que l'utilisateur est bien un admin. 4. Si c'est le cas, le backend valide les données et les insère en base via le `SerieModel`. 5. Une réponse de succès est renvoyée.
    *   **Exception :** Si l'utilisateur n'est pas un admin, le backend renvoie une erreur 403 (Interdit).

---

## 4. Diagrammes de Séquence (Descriptions Textuelles)

### Séquence : Obtenir une Recommandation

1.  **App Étudiant** envoie une requête `POST` à `API Backend` sur l'endpoint `/recommendations/generate` avec les notes, la série et le token.
2.  Le **authMiddleware** du backend valide le token.
3.  Le **recoController** reçoit la requête et appelle le **aiService**.
4.  **aiService** appelle les **Modèles** (Serie, Subject, University) pour récupérer les données contextuelles depuis la **Base de Données**.
5.  **aiService** construit le prompt et l'envoie au **Service d'IA (Groq)**.
6.  **Service d'IA (Groq)** renvoie une réponse JSON.
7.  **aiService** parse la réponse et la retourne au **recoController**.
8.  **recoController** appelle le **RecommendationModel** pour sauvegarder le résultat dans la **Base de Données**.
9.  **API Backend** renvoie une réponse de succès 200 à l'**App Étudiant** avec la recommandation.

### Séquence : L'Admin Ajoute une Série

1.  **App Admin** envoie une requête `POST` à `API Backend` sur l'endpoint `/series` avec les données de la série et le token.
2.  Le **authMiddleware** du backend valide le token.
3.  Le **serieController** reçoit la requête et vérifie en interne que l'utilisateur a le rôle "admin".
4.  Si l'autorisation est validée, **serieController** appelle la méthode `create` du **SerieModel**.
5.  **SerieModel** exécute une requête `INSERT` dans la **Base de Données**.
6.  **API Backend** renvoie une réponse de succès 201 à l'**App Admin**.

---

## 5. Diagrammes d'Activité (Descriptions Textuelles)

### Activité : Obtenir une Recommandation

1.  L'activité commence lorsque l'étudiant clique pour obtenir une recommandation.
2.  Il saisit ses informations (notes, série).
3.  Le système reçoit la requête.
4.  Le système exécute trois actions en **parallèle** : récupérer les détails de la série, récupérer les matières associées, et récupérer la liste des universités partenaires.
5.  Une fois toutes ces données collectées, le système **joint** les résultats.
6.  Il construit le prompt et appelle le service d'IA.
7.  Il attend la réponse.
8.  Une **décision** est prise : la réponse de l'IA est-elle valide ?
    *   **Si oui :** L'activité continue en sauvegardant la recommandation en base de données, puis en l'affichant à l'utilisateur.
    *   **Si non :** L'activité se dirige vers l'affichage d'un message d'erreur.
9.  L'activité se termine.

### Activité : L'Admin Ajoute une Série

1.  L'activité commence lorsque l'administrateur choisit de créer une nouvelle série.
2.  Il remplit le formulaire et le soumet.
3.  Le système reçoit la requête.
4.  Une **décision** est prise : l'utilisateur authentifié est-il un administrateur ?
    *   **Si non :** L'activité se termine immédiatement en renvoyant une erreur d'interdiction (403).
    *   **Si oui :** L'activité continue. Une deuxième **décision** est prise : les données fournies (code, description) sont-elles valides ?
        *   **Si non :** L'activité se dirige vers l'affichage d'une erreur de validation à l'administrateur.
        *   **Si oui :** L'activité continue en insérant la nouvelle série dans la base de données, puis en affichant un message de succès.
5.  L'activité se termine.
