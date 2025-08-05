const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

exports.generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, {expiresIn: '24h'});
};

exports.generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, {expiresIn: '7d'});
}

exports.verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);
exports.verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);