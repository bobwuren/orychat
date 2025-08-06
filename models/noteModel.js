const db = require('../config/database/db');

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
        const [result] = await db.execute(
            `INSERT INTO ${this.table} (user_id, subject_id, serie_id, value)
             VALUES (?, ?, ?, ?)`,
            [entity.user_id, entity.subject_id, entity.serie_id, entity.value]
        );
        return result.insertId;
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

    async getByUserId(userId) {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         WHERE user_id = ?`, [userId]);
        return rows.map(this.toObject);
    },
};

module.exports = NoteModel;