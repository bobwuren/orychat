const db = require("../config/database/db");

const SubjectModel = {
    table: 'subjects',

    toObject(row) {
        if (!row) return null;
        return {
            id: row.id,
            name: row.name,
            coefficient: row.coefficient,
            serieId: row.serie_id
        };
    },

    toEntity(subject) {
        if (!subject) return null;
        return {
            id: subject.id,
            name: subject.name,
            coefficient: subject.coefficient,
            serie_id: subject.serieId
        };
    },

    async getAllSubjects() {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         ORDER BY name ASC`);
        return rows.map(this.toObject);
    },

    async getById(subjectId) {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         WHERE id = ?`, [subjectId]);
        return rows.length > 0 ? this.toObject(rows[0]) : null;
    },

    async getBySerieId(serieId) {
        const [subjects] = await db.execute(`
                    SELECT s.id, s.name, sc.coefficient, sc.serie_id
                    FROM subject_coefficients sc
                             JOIN subjects s ON sc.subject_id = s.id
                    WHERE sc.serie_id = ?
                    ORDER BY s.name ASC`,
            [serieId]);
        return subjects.map(this.toObject);
    },

    async getSeriesCoefficientsForSubject(subjectId) {
        const [rows] = await db.execute(`
            SELECT serie_id, coefficient
            FROM subject_coefficients
            WHERE subject_id = ?
        `, [subjectId]);
        const map = {};
        for (const row of rows) {
            map[row.serie_id] = row.coefficient;
        }
        return map;
    },

    async findByName(name) {
        const [rows] = await db.execute(`SELECT * FROM ${this.table} WHERE name = ? LIMIT 1`, [name]);
        return rows.length > 0 ? this.toObject(rows[0]) : null;
    },

    async create(subject) {
        const entity = this.toEntity(subject);
        // Vérification unicité du nom
        const existing = await this.findByName(entity.name);
        if (existing) {
            const err = new Error('Name already exists');
            err.status = 409;
            throw err;
        }
        await db.execute(
            `INSERT INTO ${this.table} (id, name)
             VALUES (?, ?)`,
            [entity.id, entity.name]
        );
        return entity.id;
    },

    async update(id, subjectData) {
        const entity = this.toEntity(subjectData);
        // Vérification unicité du nom (hors la matière courante)
        if (entity.name) {
            const existing = await this.findByName(entity.name);
            if (existing && existing.id !== id) {
                const err = new Error('Name already exists');
                err.status = 409;
                throw err;
            }
        }
        const [result] = await db.execute(
            `UPDATE ${this.table} SET name = ? WHERE id = ?`,
            [entity.name, id]
        );
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await db.execute(`DELETE
                                           FROM ${this.table}
                                           WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    },

    // Gestion des coefficients des séries
    async updateSeriesCoefficients(subjectId, seriesCoefficients) {
        // Supprimer tous les anciens coefficients
        await this.deleteAllSeriesCoefficients(subjectId);
        
        // Ajouter les nouveaux coefficients
        for (const sc of seriesCoefficients) {
            await this.addSeriesCoefficient(subjectId, sc.serieId, sc.coefficient);
        }
        return true;
    },

    async deleteAllSeriesCoefficients(subjectId) {
        const [result] = await db.execute(
            'DELETE FROM subject_coefficients WHERE subject_id = ?',
            [subjectId]
        );
        return result.affectedRows;
    },

    async addSeriesCoefficient(subjectId, serieId, coefficient) {
        await db.execute(
            'INSERT INTO subject_coefficients (subject_id, serie_id, coefficient) VALUES (?, ?, ?)',
            [subjectId, serieId, coefficient]
        );
        return true;
    },

    async createWithCoefficients(subjectData, seriesCoefficients) {
        // Créer la matière
        const subjectId = await this.create(subjectData);
        
        // Ajouter les coefficients
        for (const sc of seriesCoefficients) {
            await this.addSeriesCoefficient(subjectId, sc.serieId, sc.coefficient);
        }
        
        return subjectId;
    },

    async updateWithCoefficients(id, subjectData, seriesCoefficients = null) {
        // Mettre à jour la matière
        const updated = await this.update(id, subjectData);
        
        // Si des coefficients sont fournis, les mettre à jour
        if (seriesCoefficients && Array.isArray(seriesCoefficients)) {
            await this.updateSeriesCoefficients(id, seriesCoefficients);
        }
        
        return updated;
    },

    // Récupérer les matières sans série assignée
    async getSubjectsWithoutSeries() {
        const [rows] = await db.execute(`
            SELECT s.id, s.name
            FROM ${this.table} s
            LEFT JOIN subject_coefficients sc ON s.id = sc.subject_id
            WHERE sc.subject_id IS NULL
            ORDER BY s.name ASC
        `);
        return rows.map(row => ({
            id: row.id,
            name: row.name
        }));
    },

    // Récupérer toutes les matières avec indication si elles ont des séries
    async getAllSubjectsWithSeriesStatus() {
        const [rows] = await db.execute(`
            SELECT s.id, s.name, 
                   COUNT(sc.serie_id) as series_count
            FROM ${this.table} s
            LEFT JOIN subject_coefficients sc ON s.id = sc.subject_id
            GROUP BY s.id, s.name
            ORDER BY s.name ASC
        `);
        return rows.map(row => ({
            id: row.id,
            name: row.name,
            hasSeries: row.series_count > 0,
            seriesCount: row.series_count
        }));
    },
};

module.exports = SubjectModel;