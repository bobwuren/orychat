const db = require('../config/database/db');

const UserModel = {
    table: 'users',

    toObject(row) {
        if (!row) return null;
        return {
            id: row.id,
            permissions: row.permissions,
            email: row.email,
            refreshToken: row.refresh_token
        };
    },

    toEntity(user) {
        if (!user) return null;
        return {
            permissions: user.permissions,
            email: user.email,
            password: user.password,
            refresh_token: user.refreshToken
        };
    },

    async findById(userId) {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         WHERE id = ?
                                         LIMIT 1`, [userId]);
        return this.toObject(rows[0]);
    },

    async create(user) {
        const entity = this.toEntity(user);
        // Validation du format d'email
        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(entity.email)) {
            throw new Error('Format d\'email invalide');
        }
        // Validation du mot de passe
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(entity.password)) {
            throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre');
        }
        const refreshTokenValue = typeof entity.refresh_token === 'undefined' ? null : entity.refresh_token;
        const defaultName = entity.email.split('@')[0];
        const [result] = await db.execute(
            `INSERT INTO ${this.table} (permissions, email, password, refresh_token, name)
             VALUES (?, ?, ?, ?, ?)`,
            [entity.permissions, entity.email, entity.password, refreshTokenValue, defaultName]
        );
        return {
            id: result.insertId,
            permissions: entity.permissions,
            email: entity.email,
            refreshToken: refreshTokenValue,
            name: defaultName
        };
    },

    async findByEmail(email) {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         WHERE email = ?
                                         LIMIT 1`,
            [email]
        );
        return rows[0];
    },

    async updateRefreshToken(userId, newRefreshToken) {
        await db.execute(
            `UPDATE ${this.table}
             SET refresh_token = ?
             WHERE id = ?`,
            [newRefreshToken, userId],
        );
    },

    async getAll() {
        const [rows] = await db.execute(`SELECT *
                                         FROM ${this.table}
                                         ORDER BY email ASC`);
        return rows.map(this.toObject);
    },

    async updateById(userId, {email, permissions, password}) {
        const fields = [];
        const values = [];
        if (email) {
            fields.push('email = ?');
            values.push(email);
        }
        if (password) {
            fields.push('password = ?');
            values.push(password);
        }
        if (fields.length === 0) return false;
        values.push(userId);
        const [result] = await db.execute(
            `UPDATE ${this.table}
             SET ${fields.join(', ')}
             WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    async deleteById(userId) {
        const [result] = await db.execute(
            `DELETE
             FROM ${this.table}
             WHERE id = ?`,
            [userId]
        );
        return result.affectedRows > 0;
    },
};

module.exports = UserModel;