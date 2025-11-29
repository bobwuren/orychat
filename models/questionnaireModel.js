/**
 * =====================================================
 * Questionnaire Model
 * =====================================================
 * Gère les opérations CRUD pour les réponses au questionnaire
 * d'orientation des étudiants
 *
 * @module models/questionnaireModel
 * @version 2.0
 */

const db = require('../config/database/db');

const QuestionnaireModel = {
    table: 'questionnaire_responses',

    /**
     * Colonnes de la table questionnaire_responses
     */
    columns: [
        'id',
        'user_id',
        'serie_id',
        'vision_professionnelle',
        'style_apprentissage',
        'domaine_numerique',
        'priorite_formation',
        'mode_travail',
        'matieres_preferees',
        'passions_extra_scolaires',
        'message_libre',
        'created_at'
    ],

    /**
     * Transforme une ligne SQL en objet JavaScript (camelCase)
     *
     * @param {Object} row - Ligne de résultat SQL
     * @returns {Object|null} Objet questionnaire formaté ou null
     */
    toObject(row) {
        if (!row) return null;

        return {
            id: row.id,
            userId: row.user_id,
            serieId: row.serie_id,
            visionProfessionnelle: row.vision_professionnelle,
            styleApprentissage: row.style_apprentissage,
            domaineNumerique: row.domaine_numerique,
            prioriteFormation: row.priorite_formation,
            modeTravail: row.mode_travail,
            matieresPreferees: row.matieres_preferees,
            passionsExtraScolaires: row.passions_extra_scolaires,
            messageLibre: row.message_libre,
            createdAt: row.created_at
        };
    },

    /**
     * Transforme un objet JavaScript en entité SQL (snake_case)
     *
     * @param {Object} questionnaire - Objet questionnaire (camelCase)
     * @returns {Object|null} Entité SQL formatée ou null
     */
    toEntity(questionnaire) {
        if (!questionnaire) return null;

        return {
            user_id: questionnaire.userId,
            serie_id: questionnaire.serieId,
            vision_professionnelle: questionnaire.visionProfessionnelle || null,
            style_apprentissage: questionnaire.styleApprentissage || null,
            domaine_numerique: questionnaire.domaineNumerique || null,
            priorite_formation: questionnaire.prioriteFormation || null,
            mode_travail: questionnaire.modeTravail || null,
            matieres_preferees: questionnaire.matieresPreferees || null,
            passions_extra_scolaires: questionnaire.passionsExtraScolaires || null,
            message_libre: questionnaire.messageLibre || null
        };
    },

    /**
     * Sauvegarde un nouveau questionnaire en base de données
     *
     * @param {Object} questionnaireData - Données du questionnaire
     * @param {number} questionnaireData.userId - ID de l'utilisateur
     * @param {number} questionnaireData.serieId - ID de la série
     * @param {string} questionnaireData.visionProfessionnelle - Vision pro (QCM)
     * @param {string} questionnaireData.styleApprentissage - Style apprentissage (QCM)
     * @param {string} questionnaireData.domaineNumerique - Domaine numérique (QCM)
     * @param {string} questionnaireData.prioriteFormation - Priorité formation (QCM)
     * @param {string} questionnaireData.modeTravail - Mode de travail (QCM)
     * @param {string} questionnaireData.matieresPreferees - Matières préférées (ouvert)
     * @param {string} questionnaireData.passionsExtraScolaires - Passions (ouvert)
     * @param {string} questionnaireData.messageLibre - Message libre (optionnel)
     * @returns {Promise<number>} ID du questionnaire créé
     * @throws {Error} Si l'insertion échoue
     */
    async save(questionnaireData) {
        const entity = this.toEntity(questionnaireData);

        const [result] = await db.execute(
            `INSERT INTO ${this.table} (
                user_id,
                serie_id,
                vision_professionnelle,
                style_apprentissage,
                domaine_numerique,
                priorite_formation,
                mode_travail,
                matieres_preferees,
                passions_extra_scolaires,
                message_libre
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                entity.user_id,
                entity.serie_id,
                entity.vision_professionnelle,
                entity.style_apprentissage,
                entity.domaine_numerique,
                entity.priorite_formation,
                entity.mode_travail,
                entity.matieres_preferees,
                entity.passions_extra_scolaires,
                entity.message_libre
            ]
        );

        return result.insertId;
    },

    /**
     * Récupère un questionnaire par son ID
     *
     * @param {number} id - ID du questionnaire
     * @returns {Promise<Object|null>} Questionnaire ou null si non trouvé
     */
    async getById(id) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`,
            [id]
        );

        return rows.length > 0 ? this.toObject(rows[0]) : null;
    },

    /**
     * Récupère tous les questionnaires d'un utilisateur
     * Triés par date de création (plus récent en premier)
     *
     * @param {number} userId - ID de l'utilisateur
     * @returns {Promise<Array>} Liste des questionnaires de l'utilisateur
     */
    async getByUserId(userId) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} 
             WHERE user_id = ? 
             ORDER BY created_at DESC`,
            [userId]
        );

        return rows.map(this.toObject);
    },

    /**
     * Récupère le dernier questionnaire d'un utilisateur
     *
     * @param {number} userId - ID de l'utilisateur
     * @returns {Promise<Object|null>} Dernier questionnaire ou null
     */
    async getLatestByUserId(userId) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 1`,
            [userId]
        );

        return rows.length > 0 ? this.toObject(rows[0]) : null;
    },

    /**
     * Récupère tous les questionnaires (admin)
     *
     * @returns {Promise<Array>} Liste de tous les questionnaires
     */
    async getAll() {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} ORDER BY created_at DESC`
        );

        return rows.map(this.toObject);
    },

    /**
     * Compte le nombre de questionnaires d'un utilisateur
     *
     * @param {number} userId - ID de l'utilisateur
     * @returns {Promise<number>} Nombre de questionnaires
     */
    async countByUserId(userId) {
        const [rows] = await db.execute(
            `SELECT COUNT(*) as count FROM ${this.table} WHERE user_id = ?`,
            [userId]
        );

        return rows[0].count;
    },

    /**
     * Supprime un questionnaire par son ID
     *
     * @param {number} id - ID du questionnaire
     * @returns {Promise<boolean>} True si suppression réussie
     */
    async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM ${this.table} WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    }
};

module.exports = QuestionnaireModel;