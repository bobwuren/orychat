const mysql = require('mysql2/promise');
require('dotenv').config();

const rawHost = process.env.DB_HOST || 'localhost';
const explicitPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

// Accept both "DB_HOST=host" + "DB_PORT=3306" and "DB_HOST=host:3306".
let host = rawHost;
let port = explicitPort;
if (!port && rawHost.includes(':')) {
    const [parsedHost, parsedPort] = rawHost.split(':');
    if (parsedHost && parsedPort && !Number.isNaN(Number(parsedPort))) {
        host = parsedHost;
        port = Number(parsedPort);
    }
}

const pool = mysql.createPool({
    host,
    ...(port ? { port } : {}),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = pool;