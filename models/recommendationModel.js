const db = require('../config/database/db');

const RecommendationModel = {
    table: 'recommendations',
    columns: [
        'id',
        'user_id',
        'serie_id',
        'orientations',
        'note_ids',
        'created_at'
    ],

    toObject(row) {
        if (!row) return null;
        return {
            id: row.id,
            userId: row.user_id,
            serieId: row.serie_id,
            orientations: typeof row.orientations === 'string' ? JSON.parse(row.orientations) : row.orientations,
            noteIds: row.note_ids ? (typeof row.note_ids === 'string' ? JSON.parse(row.note_ids) : row.note_ids) : undefined,
            createdAt: row.created_at
        };
    },

    toEntity(recommendation) {
        if (!recommendation) return null;
        return {
            user_id: recommendation.userId,
            serie_id: recommendation.serieId,
            orientations: JSON.stringify(recommendation.orientations),
            note_ids: recommendation.noteIds ? JSON.stringify(recommendation.noteIds) : null
        };
    },

    async save(recommendationData) {
        const entity = this.toEntity(recommendationData);
        const [result] = await db.execute(
            `INSERT INTO ${this.table} (user_id, serie_id, orientations, note_ids, created_at)
             VALUES (?, ?, ?, ?, NOW())`,
            [entity.user_id, entity.serie_id, entity.orientations, entity.note_ids]
        );
        return result.insertId;
    },

    async getByUserId(userId) {
        const [rows] = await db.execute(`
                    SELECT id, user_id, serie_id, orientations, note_ids, created_at
                    FROM ${this.table}
                    WHERE user_id = ?
                    ORDER BY created_at DESC`,
            [userId]
        );
        return rows.map(this.toObject);
    },

    async getAll() {
        const [rows] = await db.execute(`SELECT id, user_id, serie_id, orientations, note_ids, created_at
                                         FROM ${this.table}
                                         ORDER BY created_at DESC`);
        return rows.map(this.toObject);
    },

    async getById(id) {
        const [rows] = await db.execute(`SELECT id, user_id, serie_id, orientations, note_ids, created_at
                                         FROM ${this.table}
                                         WHERE id = ?`, [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return this.toObject(row);
    },
};

module.exports = RecommendationModel;