const db = require('../config/database/db');
const {v4: uuidv4} = require('uuid');

const NoteModel = {
    table: 'notes',
    columns: [
        'id',
        'user_id',
        'subject_id',
        'serie_id',
        'value',
    ],

    toObject(row) {
        if (!row) return null;
        return {
            id: row.id,
            userId: row.user_id,
            subjectId: row.subject_id,
            serieId: row.serie_id,
            value: row.value
        };
    },

    toEntity(note) {
        if (!note) return null;
        return {
            id: note.id,
            user_id: note.userId,
            subject_id: note.subjectId,
            serie_id: note.serieId,
            value: note.value
        };
    },

    async save(noteData) {
        let entity = this.toEntity(noteData);
        if (!entity.id) {
            entity.id = uuidv4();
        }
        const sql = `
            INSERT INTO ${this.table} (id, user_id, subject_id, serie_id, value)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.execute(sql, [entity.id, entity.user_id, entity.subject_id, entity.serie_id, entity.value]);
        return entity.id;
    },

    async getAll() {
        const [rows] = await db.execute(`SELECT id, user_id, subject_id, serie_id, value
                                         FROM ${this.table}`);
        return rows.map(this.toObject);
    },

    async getById(id) {
        const [rows] = await db.execute(`SELECT id, user_id, subject_id, serie_id, value
                                         FROM ${this.table}
                                         WHERE id = ?
                                         LIMIT 1`, [id]);
        return rows.length > 0 ? this.toObject(rows[0]) : null;
    },

    async delete(id) {
        const [result] = await db.execute(`DELETE
                                           FROM ${this.table}
                                           WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    },

    async getByUserId(userId) {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         WHERE user_id = ?`, [userId]);
        return rows.map(this.toObject);
    },

    async getBySerieId(serieId) {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         WHERE serie_id = ?`, [serieId]);
        return rows.map(this.toObject);
    },

    async getByUserAndSerie(userId, serieId) {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         WHERE user_id = ?
                                           AND serie_id = ?`, [userId, serieId]);
        return rows.map(this.toObject);
    },
};

module.exports = NoteModel;