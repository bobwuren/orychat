/**
 * =====================================================
 * Counselor Model
 * =====================================================
 * Gère les opérations CRUD pour les conseillers d'orientation
 *
 * @module models/counselorModel
 * @version 2.0
 */

const db = require('../config/database/db');

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
     * Transforme une ligne SQL en objet JavaScript (camelCase)
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
            specialties: row.specialties ? JSON.parse(row.specialties) : [],
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    },

    /**
     * Transforme un objet JavaScript en entité SQL (snake_case)
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
     * Crée un nouveau conseiller
     *
     * @param {Object} counselorData - Données du conseiller
     * @param {string} counselorData.name - Nom complet
     * @param {string} counselorData.email - Email unique
     * @param {string} counselorData.phone - Téléphone (optionnel)
     * @param {string} counselorData.photo - URL photo (optionnel)
     * @param {string} counselorData.bio - Biographie (optionnel)
     * @param {Array} counselorData.specialties - Spécialités (optionnel)
     * @param {boolean} counselorData.isActive - Statut actif (défaut: true)
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
     * Récupère tous les conseillers actifs
     *
     * @returns {Promise<Array>} Liste des conseillers actifs
     */
    async getAllActive() {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} 
             WHERE is_active = true 
             ORDER BY name ASC`
        );

        return rows.map(this.toObject);
    },

    /**
     * Récupère tous les conseillers (actifs + inactifs)
     *
     * @returns {Promise<Array>} Liste de tous les conseillers
     */
    async getAll() {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} 
             ORDER BY name ASC`
        );

        return rows.map(this.toObject);
    },

    /**
     * Récupère un conseiller par son ID
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
     * Récupère un conseiller par son email
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
     * Récupère les conseillers par spécialité
     *
     * @param {string} specialty - Spécialité recherchée
     * @returns {Promise<Array>} Liste des conseillers avec cette spécialité
     */
    async getBySpecialty(specialty) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} 
             WHERE is_active = true 
             AND JSON_CONTAINS(specialties, ?, '$')
             ORDER BY name ASC`,
            [JSON.stringify(specialty)]
        );

        return rows.map(this.toObject);
    },

    /**
     * Met à jour un conseiller
     *
     * @param {number} id - ID du conseiller
     * @param {Object} updateData - Données à mettre à jour
     * @returns {Promise<boolean>} True si mise à jour réussie
     */
    async update(id, updateData) {
        const entity = this.toEntity(updateData);

        // Construire dynamiquement la requête SQL
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(entity)) {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return false; // Aucune donnée à mettre à jour
        }

        values.push(id);

        const [result] = await db.execute(
            `UPDATE ${this.table} SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    },

    /**
     * Désactive un conseiller (soft delete)
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
     * Active un conseiller
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
     * Supprime définitivement un conseiller (hard delete)
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
     * Compte le nombre de conseillers actifs
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
     * Vérifie si un email est déjà utilisé
     *
     * @param {string} email - Email à vérifier
     * @param {number} excludeId - ID à exclure de la vérification (pour update)
     * @returns {Promise<boolean>} True si l'email existe déjà
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