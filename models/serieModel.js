const db = require('../config/database/db');

const SerieModel = {
    table: 'series',

    toObject(row) {
        if (!row) return null;
        return {
            id: row.id,
            code: row.code,
            description: row.description
        };
    },

    toEntity(serie) {
        if (!serie) return null;
        return {
            code: serie.code,
            description: serie.description
        };
    },

    async getAll() {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         ORDER BY code ASC`);
        return rows.map(this.toObject);
    },

    async getById(serieId) {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         WHERE id = ?`, [serieId]);
        return rows.length > 0 ? this.toObject(rows[0]) : null;
    },

    async findByCode(code) {
        const [rows] = await db.execute(`SELECT * FROM ${this.table} WHERE code = ? LIMIT 1`, [code]);
        return rows.length > 0 ? this.toObject(rows[0]) : null;
    },

    async create(serieData) {
        const entity = this.toEntity(serieData);
        // Vérification unicité du code
        const existing = await this.findByCode(entity.code);
        if (existing) {
            const err = new Error('Code already exists');
            err.status = 409;
            throw err;
        }
        const [result] = await db.execute(
            `INSERT INTO ${this.table} (code, description)
            VALUES (?, ?)`,
            [entity.code, entity.description]
        );
        const serieId = result.insertId;

        if (serieData.subjects && Array.isArray(serieData.subjects) && serieData.subjects.length > 0) {
            await this.addSubjects(serieId, serieData.subjects);
        }

        return serieId;
    },

    async update(id, serieData) {
        const entity = this.toEntity(serieData);
        // Vérification unicité du code (hors la série courante)
        if (entity.code) {
            const existing = await this.findByCode(entity.code);
            if (existing && Number(existing.id) !== Number(id)) {
                const err = new Error('Code already exists');
                err.status = 409;
                throw err;
            }
        }
        const [result] = await db.execute(
            `UPDATE ${this.table} SET code = ?, description = ? WHERE id = ?`,
            [entity.code, entity.description, id]
        );
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await db.execute(`DELETE
                                           FROM ${this.table}
                                           WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    },

    // Gestion des matières associées à une série
    async addSubjects(serieId, subjects) {
        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) return;

        // Accepte string ou number pour subjectId
        const validSubjects = subjects.filter(subject =>
            subject &&
            typeof subject === 'object' &&
            (typeof subject.subjectId === 'string' || typeof subject.subjectId === 'number') &&
            subject.coefficient !== undefined &&
            !isNaN(Number(subject.coefficient))
        );

        if (validSubjects.length === 0) return;

        const values = validSubjects.map(subject => [serieId, subject.subjectId, Number(subject.coefficient)]);
        const placeholders = validSubjects.map(() => '(?, ?, ?)').join(', ');

        await db.execute(
            `INSERT INTO subject_coefficients (serie_id, subject_id, coefficient) VALUES ${placeholders}`,
            values.flat()
        );
    },
    async updateSubjects(serieId, subjects) {
        // Supprimer les anciens coefficients
        await db.execute(
            `DELETE FROM subject_coefficients WHERE serie_id = ?`,
            [serieId]
        );
        
        // Ajouter les nouveaux (la méthode addSubjects gère déjà la validation)
        if (subjects && Array.isArray(subjects) && subjects.length > 0) {
            await this.addSubjects(serieId, subjects);
        }
    },

    async getSubjects(serieId) {
        const [rows] = await db.execute(`
            SELECT s.id, s.name, sc.coefficient
            FROM subjects s
            INNER JOIN subject_coefficients sc ON s.id = sc.subject_id
            WHERE sc.serie_id = ?
            ORDER BY s.name ASC
        `, [serieId]);
        
        return rows.map(row => ({
            id: row.id,
            name: row.name,
            coefficient: row.coefficient
        }));
    }
};

module.exports = SerieModel;