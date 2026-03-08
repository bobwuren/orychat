/**
 * =====================================================
 * Counselor Model
 * =====================================================
 * Gère les opérations CRUD pour les conseillers d'orientation
 *
 * @module models/counselorModel
 * @version 2.1
 */

const db = require('../config/database/db');

/**
 * Parse la colonne specialties depuis la base de données.
 *
 * Gère les cas suivants sans lever d'exception :
 *   - NULL        → []
 *   - ""          → []  (chaîne vide insérée par erreur)
 *   - "[]"        → []
 *   - '["a","b"]' → ["a", "b"]
 *   - JSON invalide → []  (données corrompues)
 *
 * @param {string|null} value - Valeur brute de la colonne specialties
 * @returns {string[]} Tableau de spécialités, vide par défaut
 */
function parseSpecialties(value) {
    if (value === null || value === undefined) {
        return [];
    }

    if (typeof value !== 'string' || value.trim() === '') {
        return [];
    }

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

const CounselorModel = {
    table: 'counselors',

    /**
     * Colonnes de la table counselors
     */
    columns: [
        'id',
        'name',
        'email',
        'phone',
        'photo',
        'bio',
        'specialties',
        'is_active',
        'created_at',
        'updated_at'
    ],

    /**
     * Transforme une ligne SQL en objet JavaScript (camelCase).
     * Utilise parseSpecialties pour éviter tout crash sur JSON invalide.
     *
     * @param {Object} row - Ligne de résultat SQL
     * @returns {Object|null} Objet conseiller formaté ou null
     */
    toObject(row) {
        if (!row) return null;

        return {
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            photo: row.photo,
            bio: row.bio,
            specialties: parseSpecialties(row.specialties),
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    },

    /**
     * Transforme un objet JavaScript en entité SQL (snake_case).
     *
     * @param {Object} counselor - Objet conseiller (camelCase)
     * @returns {Object|null} Entité SQL formatée ou null
     */
    toEntity(counselor) {
        if (!counselor) return null;

        return {
            name: counselor.name,
            email: counselor.email,
            phone: counselor.phone || null,
            photo: counselor.photo || null,
            bio: counselor.bio || null,
            specialties: counselor.specialties ? JSON.stringify(counselor.specialties) : null,
            is_active: counselor.isActive !== undefined ? counselor.isActive : true
        };
    },

    /**
     * Crée un nouveau conseiller.
     *
     * @param {Object} counselorData - Données du conseiller
     * @param {string} counselorData.name - Nom complet
     * @param {string} counselorData.email - Email unique
     * @param {string} [counselorData.phone] - Téléphone
     * @param {string} [counselorData.photo] - URL photo
     * @param {string} [counselorData.bio] - Biographie
     * @param {string[]} [counselorData.specialties] - Spécialités
     * @param {boolean} [counselorData.isActive] - Statut actif (défaut: true)
     * @returns {Promise<number>} ID du conseiller créé
     * @throws {Error} Si l'insertion échoue
     */
    async create(counselorData) {
        const entity = this.toEntity(counselorData);

        const [result] = await db.execute(
            `INSERT INTO ${this.table} (
                name,
                email,
                phone,
                photo,
                bio,
                specialties,
                is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                entity.name,
                entity.email,
                entity.phone,
                entity.photo,
                entity.bio,
                entity.specialties,
                entity.is_active
            ]
        );

        return result.insertId;
    },

    /**
     * Récupère tous les conseillers actifs.
     *
     * @returns {Promise<Object[]>} Liste des conseillers actifs
     */
    async getAllActive() {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table}
             WHERE is_active = true
             ORDER BY name ASC`
        );

        return rows.map(row => this.toObject(row));
    },

    /**
     * Récupère tous les conseillers (actifs + inactifs).
     *
     * @returns {Promise<Object[]>} Liste de tous les conseillers
     */
    async getAll() {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table}
             ORDER BY name ASC`
        );

        return rows.map(row => this.toObject(row));
    },

    /**
     * Récupère un conseiller par son ID.
     *
     * @param {number} id - ID du conseiller
     * @returns {Promise<Object|null>} Conseiller ou null si non trouvé
     */
    async getById(id) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`,
            [id]
        );

        return rows.length > 0 ? this.toObject(rows[0]) : null;
    },

    /**
     * Récupère un conseiller par son email.
     *
     * @param {string} email - Email du conseiller
     * @returns {Promise<Object|null>} Conseiller ou null si non trouvé
     */
    async getByEmail(email) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} WHERE email = ? LIMIT 1`,
            [email]
        );

        return rows.length > 0 ? this.toObject(rows[0]) : null;
    },

    /**
     * Récupère les conseillers actifs par spécialité.
     * Utilise JSON_CONTAINS pour filtrer dans le tableau JSON stocké.
     *
     * @param {string} specialty - Spécialité recherchée
     * @returns {Promise<Object[]>} Liste des conseillers correspondants
     */
    async getBySpecialty(specialty) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table}
             WHERE is_active = true
             AND JSON_CONTAINS(specialties, ?, '$')
             ORDER BY name ASC`,
            [JSON.stringify(specialty)]
        );

        return rows.map(row => this.toObject(row));
    },

    /**
     * Met à jour un conseiller.
     * Construit dynamiquement la requête en fonction des champs fournis.
     *
     * @param {number} id - ID du conseiller
     * @param {Object} updateData - Champs à mettre à jour (tous optionnels)
     * @returns {Promise<boolean>} True si au moins une ligne modifiée
     */
    async update(id, updateData) {
        const entity = this.toEntity(updateData);

        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(entity)) {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return false;
        }

        values.push(id);

        const [result] = await db.execute(
            `UPDATE ${this.table} SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    },

    /**
     * Désactive un conseiller (soft delete).
     *
     * @param {number} id - ID du conseiller
     * @returns {Promise<boolean>} True si désactivation réussie
     */
    async deactivate(id) {
        const [result] = await db.execute(
            `UPDATE ${this.table} SET is_active = false WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

    /**
     * Active un conseiller.
     *
     * @param {number} id - ID du conseiller
     * @returns {Promise<boolean>} True si activation réussie
     */
    async activate(id) {
        const [result] = await db.execute(
            `UPDATE ${this.table} SET is_active = true WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

    /**
     * Supprime définitivement un conseiller (hard delete).
     *
     * @param {number} id - ID du conseiller
     * @returns {Promise<boolean>} True si suppression réussie
     */
    async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM ${this.table} WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

    /**
     * Compte le nombre de conseillers actifs.
     *
     * @returns {Promise<number>} Nombre de conseillers actifs
     */
    async countActive() {
        const [rows] = await db.execute(
            `SELECT COUNT(*) as count FROM ${this.table} WHERE is_active = true`
        );

        return rows[0].count;
    },

    /**
     * Vérifie si un email est déjà utilisé.
     *
     * @param {string} email - Email à vérifier
     * @param {number|null} excludeId - ID à exclure (utile lors d'un update)
     * @returns {Promise<boolean>} True si l'email est déjà pris
     */
    async emailExists(email, excludeId = null) {
        let query = `SELECT COUNT(*) as count FROM ${this.table} WHERE email = ?`;
        const params = [email];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows] = await db.execute(query, params);

        return rows[0].count > 0;
    }
};

module.exports = CounselorModel;