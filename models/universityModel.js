const db = require('../config/database/db');
const {v4: uuidv4} = require('uuid');

const UniversityModel = {
    table: 'universities',
    columns: [
        'id',
        'name',
        'web_site',
        'description',
        'is_sponsor',
        'created_at'
    ],

    toObject(row) {
        if (!row) return null;
        return {
            id: row.id,
            name: row.name,
            webSite: row.web_site,
            description: row.description,
            isSponsor: row.is_sponsor,
            createdAt: row.created_at
        };
    },

    // Conversion d'un objet JS (camelCase) en entité SQL (snake_case)
    toEntity(obj) {
        if (!obj) return null;
        return {
            id: obj.id,
            name: obj.name,
            web_site: obj.webSite,
            description: obj.description,
            is_sponsor: obj.isSponsor,
            created_at: obj.createdAt
        };
    },

    async save(universityData) {
        const entity = this.toEntity(universityData);
        const id = entity.id || uuidv4();
        const createdAt = entity.created_at || new Date().toISOString().slice(0, 19).replace('T', ' ');
        await db.execute(
            `INSERT INTO ${this.table} (id, name, web_site, description, is_sponsor, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, entity.name, entity.web_site || null, entity.description || null, entity.is_sponsor || false, createdAt]
        );
        return this.toObject({...entity, id, created_at: createdAt});
    },

    async getAllSponsors() {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         WHERE is_sponsor = true
                                         ORDER BY name ASC`);
        return await Promise.all(rows.map(async (row) => {
            const obj = this.toObject(row);
            obj.degrees = await this.getDegrees(obj.id);
            return obj;
        }));
    },

    async getAll() {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         ORDER BY name ASC`);
        return await Promise.all(rows.map(async (row) => {
            const obj = this.toObject(row);
            obj.degrees = await this.getDegrees(obj.id);
            return obj;
        }));
    },

    async getById(id) {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         WHERE id = ?
                                         LIMIT 1`, [id]);
        if (rows.length === 0) return null;
        const obj = this.toObject(rows[0]);
        obj.degrees = await this.getDegrees(obj.id);
        return obj;
    },

    async update(id, updateData) {
        const entity = this.toEntity(updateData);
        const fields = [];
        const values = [];
        for (const key in entity) {
            if (key !== 'id' && entity[key] !== undefined && this.columns.includes(key)) {
                fields.push(`${key} = ?`);
                values.push(entity[key]);
            }
        }
        if (fields.length === 0) return false;
        values.push(id);
        const [result] = await db.execute(
            `UPDATE ${this.table}
             SET ${fields.join(', ')}
             WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await db.execute(`DELETE
                                           FROM ${this.table}
                                           WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    },

    // Liste des diplômes proposés par une université
    async getDegrees(universityId) {
        const [rows] = await db.execute(
            `SELECT d.id, d.name, d.description
             FROM degrees d
                      INNER JOIN university_degrees ud ON d.id = ud.degree_id
             WHERE ud.university_id = ?`,
            [universityId]
        );
        return rows;
    },

    // Associer un diplôme à une université
    async addDegree(universityId, degreeId) {
        await db.execute(
            `INSERT IGNORE INTO university_degrees (university_id, degree_id)
             VALUES (?, ?)`,
            [universityId, degreeId]
        );
        return true;
    },

    // Supprimer un diplôme d'une université
    async removeDegree(universityId, degreeId) {
        const [result] = await db.execute(
            `DELETE
             FROM university_degrees
             WHERE university_id = ?
               AND degree_id = ?`,
            [universityId, degreeId]
        );
        return result.affectedRows > 0;
    },

    // Chercher les universités sponsors qui proposent un diplôme donné
    async getSponsorsByDegree(degreeId) {
        const [rows] = await db.execute(
            `SELECT u.*
             FROM universities u
                      JOIN university_degrees ud ON u.id = ud.university_id
             WHERE u.is_sponsor = true
               AND ud.degree_id = ?
             ORDER BY u.name ASC`,
            [degreeId]
        );
        return await Promise.all(rows.map(async (row) => {
            const obj = this.toObject(row);
            obj.degrees = await this.getDegrees(obj.id);
            return obj;
        }));
    },

    // Récupérer toutes les universités qui proposent un diplôme donné (sponsors ou non)
    async getByDegree(degreeId) {
        const [rows] = await db.execute(
            `SELECT u.*
             FROM universities u
             JOIN university_degrees ud ON u.id = ud.university_id
             WHERE ud.degree_id = ?
             ORDER BY u.name ASC`,
            [degreeId]
        );
        return await Promise.all(rows.map(async (row) => {
            const obj = this.toObject(row);
            obj.degrees = await this.getDegrees(obj.id);
            return obj;
        }));
    },

    // Exporter toutes les universités (CSV ou JSON)
    async exportAll(format = 'json') {
        const universities = await this.getAll();
        if (format === 'csv') {
            const { Parser } = require('json2csv');
            const fields = ['id', 'name', 'webSite', 'description', 'isSponsor', 'createdAt'];
            const parser = new Parser({ fields });
            return parser.parse(universities.map(u => ({
                ...u,
                isSponsor: u.isSponsor ? 'oui' : 'non',
                degrees: u.degrees ? u.degrees.map(d => d.name).join('|') : ''
            })));
        }
        return universities;
    },

    // Créer une université et lier des diplômes
    async createWithDegrees({id, name, webSite, description, isSponsor, degrees}) {
        // Vérification unicité du nom
        const [existing] = await db.execute(`SELECT id FROM ${this.table} WHERE name = ? LIMIT 1`, [name]);
        if (existing.length > 0) {
            const err = new Error('Name already exists');
            err.status = 409;
            throw err;
        }
        // Création de l'université
        await db.execute(
            `INSERT INTO ${this.table} (id, name, web_site, description, is_sponsor) VALUES (?, ?, ?, ?, ?)`,
            [id, name, webSite || null, description || null, isSponsor || false]
        );
        // Lier les diplômes
        for (const degreeId of degrees) {
            await db.execute(
                `INSERT INTO university_degrees (university_id, degree_id) VALUES (?, ?)`,
                [id, degreeId]
            );
        }
        return id;
    },

    // Mettre à jour une université et ses diplômes
    async updateWithDegrees(id, {name, webSite, description, isSponsor, degrees}) {
        // Mise à jour des champs simples
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (webSite !== undefined) updateData.webSite = webSite;
        if (description !== undefined) updateData.description = description;
        if (isSponsor !== undefined) updateData.isSponsor = isSponsor;
        
        if (Object.keys(updateData).length > 0) {
            await this.update(id, updateData);
        }
        // Mise à jour des diplômes associés
        if (Array.isArray(degrees)) {
            await db.execute(`DELETE FROM university_degrees WHERE university_id = ?`, [id]);
            for (const degreeId of degrees) {
                await db.execute(
                    `INSERT INTO university_degrees (university_id, degree_id) VALUES (?, ?)`,
                    [id, degreeId]
                );
            }
        }
        return id;
    },
};

module.exports = UniversityModel;
