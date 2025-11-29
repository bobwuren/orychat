/**
 * =====================================================
 * Consultation Model
 * =====================================================
 * Gère les demandes de consultation entre étudiants et conseillers
 *
 * @module models/consultationModel
 * @version 2.0
 */

const db = require('../config/database/db');

const ConsultationModel = {
    table: 'consultation_requests',

    /**
     * Colonnes de la table consultation_requests
     */
    columns: [
        'id',
        'student_id',
        'counselor_id',
        'questionnaire_id',
        'recommendation_id',
        'student_email',
        'student_phone',
        'additional_comment',
        'status',
        'whatsapp_sent',
        'email_sent_to_counselor',
        'created_at',
        'assigned_at'
    ],

    /**
     * Statuts possibles d'une consultation
     */
    STATUS: {
        PENDING: 'pending',
        ASSIGNED: 'assigned',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
    },

    /**
     * Transforme une ligne SQL en objet JavaScript (camelCase)
     *
     * @param {Object} row - Ligne de résultat SQL
     * @returns {Object|null} Objet consultation formaté ou null
     */
    toObject(row) {
        if (!row) return null;

        return {
            id: row.id,
            studentId: row.student_id,
            counselorId: row.counselor_id,
            questionnaireId: row.questionnaire_id,
            recommendationId: row.recommendation_id,
            studentEmail: row.student_email,
            studentPhone: row.student_phone,
            additionalComment: row.additional_comment,
            status: row.status,
            whatsappSent: row.whatsapp_sent,
            emailSentToCounselor: row.email_sent_to_counselor,
            createdAt: row.created_at,
            assignedAt: row.assigned_at
        };
    },

    /**
     * Transforme un objet JavaScript en entité SQL (snake_case)
     *
     * @param {Object} consultation - Objet consultation (camelCase)
     * @returns {Object|null} Entité SQL formatée ou null
     */
    toEntity(consultation) {
        if (!consultation) return null;

        return {
            student_id: consultation.studentId,
            counselor_id: consultation.counselorId || null,
            questionnaire_id: consultation.questionnaireId,
            recommendation_id: consultation.recommendationId,
            student_email: consultation.studentEmail,
            student_phone: consultation.studentPhone,
            additional_comment: consultation.additionalComment || null,
            status: consultation.status || this.STATUS.PENDING,
            whatsapp_sent: consultation.whatsappSent || false,
            email_sent_to_counselor: consultation.emailSentToCounselor || false
        };
    },

    /**
     * Crée une nouvelle demande de consultation
     *
     * @param {Object} consultationData - Données de la consultation
     * @returns {Promise<number>} ID de la consultation créée
     * @throws {Error} Si l'insertion échoue
     */
    async create(consultationData) {
        const entity = this.toEntity(consultationData);

        const [result] = await db.execute(
            `INSERT INTO ${this.table} (
                student_id,
                counselor_id,
                questionnaire_id,
                recommendation_id,
                student_email,
                student_phone,
                additional_comment,
                status,
                whatsapp_sent,
                email_sent_to_counselor
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                entity.student_id,
                entity.counselor_id,
                entity.questionnaire_id,
                entity.recommendation_id,
                entity.student_email,
                entity.student_phone,
                entity.additional_comment,
                entity.status,
                entity.whatsapp_sent,
                entity.email_sent_to_counselor
            ]
        );

        return result.insertId;
    },

    /**
     * Récupère une consultation par son ID
     *
     * @param {number} id - ID de la consultation
     * @returns {Promise<Object|null>} Consultation ou null si non trouvée
     */
    async getById(id) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`,
            [id]
        );

        return rows.length > 0 ? this.toObject(rows[0]) : null;
    },

    /**
     * Récupère toutes les consultations d'un étudiant
     *
     * @param {number} studentId - ID de l'étudiant
     * @returns {Promise<Array>} Liste des consultations
     */
    async getByStudentId(studentId) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} 
             WHERE student_id = ? 
             ORDER BY created_at DESC`,
            [studentId]
        );

        return rows.map(this.toObject);
    },

    /**
     * Récupère toutes les consultations d'un conseiller
     *
     * @param {number} counselorId - ID du conseiller
     * @returns {Promise<Array>} Liste des consultations
     */
    async getByCounselorId(counselorId) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} 
             WHERE counselor_id = ? 
             ORDER BY created_at DESC`,
            [counselorId]
        );

        return rows.map(this.toObject);
    },

    /**
     * Récupère toutes les consultations par statut
     *
     * @param {string} status - Statut recherché
     * @returns {Promise<Array>} Liste des consultations
     */
    async getByStatus(status) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.table} 
             WHERE status = ? 
             ORDER BY created_at DESC`,
            [status]
        );

        return rows.map(this.toObject);
    },

    /**
     * Récupère toutes les consultations (admin)
     *
     * @param {Object} filters - Filtres optionnels
     * @param {string} filters.status - Filtrer par statut
     * @param {number} filters.counselorId - Filtrer par conseiller
     * @returns {Promise<Array>} Liste de toutes les consultations
     */
    async getAll(filters = {}) {
        let query = `SELECT * FROM ${this.table}`;
        const conditions = [];
        const params = [];

        if (filters.status) {
            conditions.push('status = ?');
            params.push(filters.status);
        }

        if (filters.counselorId) {
            conditions.push('counselor_id = ?');
            params.push(filters.counselorId);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.execute(query, params);

        return rows.map(this.toObject);
    },

    /**
     * Assigne un conseiller à une consultation
     *
     * @param {number} consultationId - ID de la consultation
     * @param {number} counselorId - ID du conseiller
     * @returns {Promise<boolean>} True si assignation réussie
     */
    async assignCounselor(consultationId, counselorId) {
        const [result] = await db.execute(
            `UPDATE ${this.table} 
             SET counselor_id = ?, 
                 status = ?, 
                 assigned_at = NOW() 
             WHERE id = ?`,
            [counselorId, this.STATUS.ASSIGNED, consultationId]
        );

        return result.affectedRows > 0;
    },

    /**
     * Marque le WhatsApp comme envoyé
     *
     * @param {number} consultationId - ID de la consultation
     * @returns {Promise<boolean>} True si mise à jour réussie
     */
    async markWhatsappSent(consultationId) {
        const [result] = await db.execute(
            `UPDATE ${this.table} 
             SET whatsapp_sent = true 
             WHERE id = ?`,
            [consultationId]
        );

        return result.affectedRows > 0;
    },

    /**
     * Marque l'email au conseiller comme envoyé
     *
     * @param {number} consultationId - ID de la consultation
     * @returns {Promise<boolean>} True si mise à jour réussie
     */
    async markEmailSent(consultationId) {
        const [result] = await db.execute(
            `UPDATE ${this.table} 
             SET email_sent_to_counselor = true 
             WHERE id = ?`,
            [consultationId]
        );

        return result.affectedRows > 0;
    },

    /**
     * Met à jour le statut d'une consultation
     *
     * @param {number} consultationId - ID de la consultation
     * @param {string} status - Nouveau statut
     * @returns {Promise<boolean>} True si mise à jour réussie
     */
    async updateStatus(consultationId, status) {
        const [result] = await db.execute(
            `UPDATE ${this.table} 
             SET status = ? 
             WHERE id = ?`,
            [status, consultationId]
        );

        return result.affectedRows > 0;
    },

    /**
     * Récupère les détails complets d'une consultation avec données liées
     *
     * @param {number} consultationId - ID de la consultation
     * @returns {Promise<Object|null>} Consultation enrichie avec données liées
     */
    async getFullDetails(consultationId) {
        const [rows] = await db.execute(
            `SELECT 
                cr.*,
                u.name as student_name,
                u.email as student_account_email,
                c.name as counselor_name,
                c.email as counselor_email
             FROM ${this.table} cr
             LEFT JOIN users u ON cr.student_id = u.id
             LEFT JOIN counselors c ON cr.counselor_id = c.id
             WHERE cr.id = ?
             LIMIT 1`,
            [consultationId]
        );

        if (rows.length === 0) return null;

        const row = rows[0];

        return {
            ...this.toObject(row),
            studentName: row.student_name,
            studentAccountEmail: row.student_account_email,
            counselorName: row.counselor_name,
            counselorEmail: row.counselor_email
        };
    },

    /**
     * Compte le nombre de consultations par statut
     *
     * @returns {Promise<Object>} Compteur par statut
     */
    async countByStatus() {
        const [rows] = await db.execute(
            `SELECT status, COUNT(*) as count 
             FROM ${this.table} 
             GROUP BY status`
        );

        const counts = {
            pending: 0,
            assigned: 0,
            completed: 0,
            cancelled: 0
        };

        rows.forEach(row => {
            counts[row.status] = row.count;
        });

        return counts;
    },

    /**
     * Supprime une consultation
     *
     * @param {number} consultationId - ID de la consultation
     * @returns {Promise<boolean>} True si suppression réussie
     */
    async delete(consultationId) {
        const [result] = await db.execute(
            `DELETE FROM ${this.table} WHERE id = ?`,
            [consultationId]
        );

        return result.affectedRows > 0;
    }
};

module.exports = ConsultationModel;