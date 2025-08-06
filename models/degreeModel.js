const db = require('../config/database/db');

const DegreeModel = {
    table: 'degrees',
    columns: [
        'id',
        'name',
        'description'
    ],

    toObject(row) {
        if (!row) return null;
        return {
            id: row.id,
            name: row.name,
            description: row.description
        };
    },

    toEntity(degree) {
        if (!degree) return null;
        return {
            name: degree.name,
            description: degree.description
        };
    },

    async save(degreeData) {
        let entity = this.toEntity(degreeData);
        const [result] = await db.execute(
            `INSERT INTO ${this.table} (name, description)
             VALUES (?, ?)`,
            [entity.name, entity.description || null]
        );
        return result.insertId;
    },

    async getAll() {
        const [rows] = await db.execute(`SELECT id, name, description
                                         FROM ${this.table}`);
        return rows.map(this.toObject);
    },
    
    // Récupérer tous les diplômes avec leurs universités en une seule requête
    async getAllWithUniversities() {
        console.log('📚 [DegreeModel] Récupération de tous les diplômes avec universités en une seule requête');
        // D'abord, récupérer tous les diplômes
        const [degrees] = await db.execute(`SELECT id, name, description
                                           FROM ${this.table}`);
        
        // Si aucun diplôme trouvé, retourner un tableau vide
        if (!degrees.length) return [];
        
        // Créer les placeholders dynamiques pour la requête IN
        const degreeIds = degrees.map(d => d.id);
        const placeholders = degreeIds.map(() => '?').join(',');
        console.log('🔍 [DegreeModel] Recherche des universités pour les diplômes:', degreeIds);
        
        // Ensuite, récupérer toutes les relations diplôme-université en une seule requête
        const [relations] = await db.execute(`
            SELECT ud.degree_id, u.id as university_id, u.name as university_name, 
                  u.web_site, u.description as university_description, u.is_sponsor
            FROM university_degrees ud
            JOIN universities u ON ud.university_id = u.id
            WHERE ud.degree_id IN (${placeholders})
        `, degreeIds);
        
        console.log('🎓 [DegreeModel] Relations trouvées:', relations.length);
        
        // Créer un map pour associer rapidement les universités à chaque diplôme
        const universityMap = {};
        relations.forEach(rel => {
            if (!universityMap[rel.degree_id]) {
                universityMap[rel.degree_id] = [];
            }
            universityMap[rel.degree_id].push({
                id: rel.university_id,
                name: rel.university_name,
                webSite: rel.web_site,
                description: rel.university_description,
                isSponsor: rel.is_sponsor
            });
        });
        
        console.log('🗺️ [DegreeModel] Map des universités créé:', Object.keys(universityMap).length, 'diplômes avec universités');
        
        // Transformer les diplômes et ajouter les universités associées
        const degreesWithUniversities = degrees.map(degree => {
            const degreeObj = this.toObject(degree);
            degreeObj.universities = universityMap[degree.id] || [];
            console.log(`📋 [DegreeModel] Diplôme "${degreeObj.name}": ${degreeObj.universities.length} universités`);
            return degreeObj;
        });
        
        console.log(`✅ [DegreeModel] ${degrees.length} diplômes avec leurs universités récupérés en une requête`);
        return degreesWithUniversities;
    },

    async getById(id) {
        const [rows] = await db.execute(
            `SELECT id, name, description
             FROM ${this.table}
             WHERE id = ?
             LIMIT 1`,
            [id]
        );
        return rows.length > 0 ? this.toObject(rows[0]) : null;
    },

    async findByName(name) {
    const [rows] = await db.execute(`SELECT * FROM degrees WHERE name = ? LIMIT 1`, [name]);
    return rows.length > 0 ? rows[0] : null;
    },

    async update(id, degreeData) {
        const entity = this.toEntity(degreeData);
        await db.execute(
            `UPDATE ${this.table}
             SET name        = ?,
                 description = ?
             WHERE id = ?`,
            [entity.name, entity.description || null, id]
        );
        return true;
    },

    async delete(id) {
        const [result] = await db.execute(
            `DELETE
             FROM ${this.table}
             WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    },

    // Exporter tous les diplômes (CSV ou JSON)
    async exportAll(format = 'json') {
        const degrees = await this.getAll();
        if (format === 'csv') {
            const {Parser} = require('json2csv');
            const fields = ['id', 'name', 'description'];
            const parser = new Parser({fields});
            return parser.parse(degrees);
        }
        return degrees;
    }
};

module.exports = DegreeModel;