-- =====================================================
-- Orientys Database Schema v2.0
-- Système d'orientation scolaire avec questionnaire
-- et consultation de conseillers
-- =====================================================

-- Création de la base
CREATE DATABASE IF NOT EXISTS orientys_db;
USE orientys_db;

-- =====================================================
-- TABLE: users
-- Description: Utilisateurs du système (étudiants, admins, conseillers)
-- Modification: Ajout du role 'counselor'
-- =====================================================
CREATE TABLE IF NOT EXISTS users
(
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    permissions   VARCHAR(20)  NOT NULL DEFAULT 'client',
    email         VARCHAR(255) NOT NULL UNIQUE,
    CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    password      TEXT         NOT NULL,
    CHECK (password REGEXP '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'),
    name          VARCHAR(255) NOT NULL,
    refresh_token TEXT         DEFAULT NULL,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    );

-- Index pour optimiser les recherches par email
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_permissions ON users (permissions);

-- =====================================================
-- TABLE: series
-- Description: Séries éducatives (A4, C, D, F1, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS series
(
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code        VARCHAR(10) NOT NULL UNIQUE,
    description TEXT        NOT NULL
    );

CREATE INDEX idx_series_code ON series (code);

-- =====================================================
-- TABLE: subjects
-- Description: Matières enseignées
-- =====================================================
CREATE TABLE IF NOT EXISTS subjects
(
    id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
    );

CREATE INDEX idx_subjects_name ON subjects (name);

-- =====================================================
-- TABLE: subject_coefficients
-- Description: Coefficients des matières selon la série
-- =====================================================
CREATE TABLE IF NOT EXISTS subject_coefficients
(
    subject_id  BIGINT UNSIGNED,
    serie_id    BIGINT UNSIGNED,
    coefficient INT NOT NULL DEFAULT 1,
    PRIMARY KEY (subject_id, serie_id),
    FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE,
    FOREIGN KEY (serie_id) REFERENCES series (id) ON DELETE CASCADE
    );

-- =====================================================
-- TABLE: notes
-- Description: Notes des étudiants par matière et série
-- =====================================================
CREATE TABLE IF NOT EXISTS notes
(
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT UNSIGNED,
    subject_id BIGINT UNSIGNED,
    serie_id   BIGINT UNSIGNED,
    value      DECIMAL(5, 2) CHECK (value >= 0 AND value <= 20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE,
    FOREIGN KEY (serie_id) REFERENCES series (id) ON DELETE CASCADE
    );

CREATE INDEX idx_notes_user_id ON notes (user_id);
CREATE INDEX idx_notes_subject_id ON notes (subject_id);
CREATE INDEX idx_notes_serie_id ON notes (serie_id);

-- =====================================================
-- TABLE: recommendations
-- Description: Recommandations d'orientation générées par l'IA
-- =====================================================
CREATE TABLE IF NOT EXISTS recommendations
(
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT UNSIGNED,
    serie_id     BIGINT UNSIGNED,
    orientations JSON      NOT NULL,
    note_ids     JSON,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (serie_id) REFERENCES series (id) ON DELETE CASCADE
    );

CREATE INDEX idx_recommendations_user_id ON recommendations (user_id);
CREATE INDEX idx_recommendations_serie_id ON recommendations (serie_id);

-- =====================================================
-- TABLE: universities
-- Description: Universités et écoles partenaires
-- =====================================================
CREATE TABLE IF NOT EXISTS universities
(
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    web_site    VARCHAR(255),
    description TEXT,
    is_sponsor  BOOLEAN   DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_universities_is_sponsor ON universities (is_sponsor);

-- =====================================================
-- TABLE: degrees
-- Description: Diplômes/filières proposés
-- =====================================================
CREATE TABLE IF NOT EXISTS degrees
(
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
    );

-- =====================================================
-- TABLE: university_degrees
-- Description: Liaison universités <-> diplômes
-- =====================================================
CREATE TABLE IF NOT EXISTS university_degrees
(
    university_id BIGINT UNSIGNED,
    degree_id     BIGINT UNSIGNED,
    PRIMARY KEY (university_id, degree_id),
    FOREIGN KEY (university_id) REFERENCES universities (id) ON DELETE CASCADE,
    FOREIGN KEY (degree_id) REFERENCES degrees (id) ON DELETE CASCADE
    );

-- =====================================================
-- NOUVELLE TABLE: questionnaire_responses
-- Description: Réponses au questionnaire d'orientation
-- Version: 2.0 (NOUVEAU)
-- =====================================================
CREATE TABLE IF NOT EXISTS questionnaire_responses
(
    id                       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id                  BIGINT UNSIGNED NOT NULL,
    serie_id                 BIGINT UNSIGNED NOT NULL,

    -- Questions QCM (choix multiples)
    vision_professionnelle   VARCHAR(100),
    style_apprentissage      VARCHAR(100),
    domaine_numerique        VARCHAR(100),
    priorite_formation       VARCHAR(100),
    mode_travail             VARCHAR(100),

    -- Questions ouvertes (texte libre)
    matieres_preferees       TEXT,
    passions_extra_scolaires TEXT,
    message_libre            TEXT,

    created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (serie_id) REFERENCES series (id) ON DELETE CASCADE
    );

-- Index pour optimiser les recherches
CREATE INDEX idx_questionnaire_user_id ON questionnaire_responses (user_id);
CREATE INDEX idx_questionnaire_serie_id ON questionnaire_responses (serie_id);
CREATE INDEX idx_questionnaire_created_at ON questionnaire_responses (created_at);

-- =====================================================
-- NOUVELLE TABLE: counselors
-- Description: Conseillers d'orientation professionnels
-- Version: 2.0 (NOUVEAU)
-- =====================================================
CREATE TABLE IF NOT EXISTS counselors
(
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    phone       VARCHAR(20),
    photo       VARCHAR(500),
    bio         TEXT,
    specialties JSON,
    is_active   BOOLEAN   DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Index pour optimiser les recherches
CREATE INDEX idx_counselors_email ON counselors (email);
CREATE INDEX idx_counselors_is_active ON counselors (is_active);

-- =====================================================
-- NOUVELLE TABLE: consultation_requests
-- Description: Demandes de consultation étudiant-conseiller
-- Version: 2.0 (NOUVEAU)
-- =====================================================
CREATE TABLE IF NOT EXISTS consultation_requests
(
    id                       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id               BIGINT UNSIGNED NOT NULL,
    counselor_id             BIGINT UNSIGNED,
    questionnaire_id         BIGINT UNSIGNED NOT NULL,
    recommendation_id        BIGINT UNSIGNED NOT NULL,

    -- Coordonnées de l'étudiant
    student_email            VARCHAR(255) NOT NULL,
    student_phone            VARCHAR(20)  NOT NULL,
    additional_comment       TEXT,

    -- Statut de la demande
    status                   ENUM('pending', 'assigned', 'completed', 'cancelled') DEFAULT 'pending',

    -- Tracking des envois
    whatsapp_sent            BOOLEAN DEFAULT FALSE,
    email_sent_to_counselor  BOOLEAN DEFAULT FALSE,

    -- Dates
    created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_at              TIMESTAMP NULL,

    FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (counselor_id) REFERENCES counselors (id) ON DELETE SET NULL,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaire_responses (id) ON DELETE CASCADE,
    FOREIGN KEY (recommendation_id) REFERENCES recommendations (id) ON DELETE CASCADE
    );

-- Index pour optimiser les recherches
CREATE INDEX idx_consultation_student_id ON consultation_requests (student_id);
CREATE INDEX idx_consultation_counselor_id ON consultation_requests (counselor_id);
CREATE INDEX idx_consultation_status ON consultation_requests (status);
CREATE INDEX idx_consultation_created_at ON consultation_requests (created_at);
