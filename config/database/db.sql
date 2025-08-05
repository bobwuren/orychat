-- Création de la base
CREATE DATABASE IF NOT EXISTS orientys_db;
USE orientys_db;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users
(
    id            VARCHAR(36) PRIMARY KEY,
    role          VARCHAR(20)  NOT NULL DEFAULT 'client',
    email         VARCHAR(255) NOT NULL UNIQUE,
    CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    password      TEXT         NOT NULL,
    CHECK (password REGEXP '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'),
    refresh_token TEXT                  DEFAULT NULL
);

-- Table des séries
CREATE TABLE IF NOT EXISTS series
(
    id          VARCHAR(36) PRIMARY KEY,
    code        VARCHAR(10) NOT NULL UNIQUE,
    description TEXT        NOT NULL
);

-- Table des matières
CREATE TABLE IF NOT EXISTS subjects
(
    id   VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Table pivot : coefficients des matières selon la série
CREATE TABLE IF NOT EXISTS subject_coefficients
(
    subject_id  VARCHAR(36),
    serie_id    VARCHAR(36),
    coefficient INT NOT NULL DEFAULT 1,
    PRIMARY KEY (subject_id, serie_id),
    FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE,
    FOREIGN KEY (serie_id) REFERENCES series (id) ON DELETE CASCADE
);

-- Table des notes
CREATE TABLE IF NOT EXISTS notes
(
    id         VARCHAR(36) PRIMARY KEY,
    user_id    VARCHAR(36),
    subject_id VARCHAR(36),
    serie_id   VARCHAR(36),
    value      DECIMAL(5, 2) CHECK (value >= 0 AND value <= 20),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE,
    FOREIGN KEY (serie_id) REFERENCES series (id) ON DELETE CASCADE
);

-- Table des recommandations
CREATE TABLE IF NOT EXISTS recommendations
(
    id           VARCHAR(36) PRIMARY KEY,
    user_id      VARCHAR(36),
    serie_id     VARCHAR(36),
    orientations JSON NOT NULL,
    note_ids     JSON,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (serie_id) REFERENCES series (id) ON DELETE CASCADE
);

-- Table des universités
CREATE TABLE IF NOT EXISTS universities
(
    id          VARCHAR(36) PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    web_site    VARCHAR(255),
    description TEXT,
    is_sponsor  BOOLEAN   DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des diplômes/filieres
CREATE TABLE IF NOT EXISTS degrees
(
    id          VARCHAR(36) PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- Table de liaison universités <-> diplômes/filieres (optionnel, pour évolutivité)
CREATE TABLE IF NOT EXISTS university_degrees
(
    university_id VARCHAR(36),
    degree_id     VARCHAR(36),
    PRIMARY KEY (university_id, degree_id),
    FOREIGN KEY (university_id) REFERENCES universities (id) ON DELETE CASCADE,
    FOREIGN KEY (degree_id) REFERENCES degrees (id) ON DELETE CASCADE
);

-- Index pour booster les perfs sur notes
CREATE INDEX idx_notes_user_id ON notes (user_id);
CREATE INDEX idx_notes_subject_id ON notes (subject_id);
CREATE INDEX idx_notes_serie_id ON notes (serie_id);

-- Index pour booster les perfs sur recommendations
CREATE INDEX idx_recommendations_user_id ON recommendations (user_id);
CREATE INDEX idx_recommendations_serie_id ON recommendations (serie_id);

-- Index sur users (pour les recherches par email, déjà unique mais on explicite)
CREATE INDEX idx_users_email ON users (email);

-- Index sur series (pour les recherches par code)
CREATE INDEX idx_series_code ON series (code);

-- Index sur subjects (pour les recherches par name)
CREATE INDEX idx_subjects_name ON subjects (name);

-- Index pour booster les recherches sur les sponsors
CREATE INDEX idx_universites_is_sponsor ON universities (is_sponsor);
