var pgp = require('pg-promise')();

// Database Config
var connection = {
    host: 'localhost',
    port: 5433,
    database: 'movie_watchlist',
    user: 'postgres',
    password: 'rootpw'
} || null;
// Database Connection
var db = pgp(connection) || pgp(process.env.DATABASE_URL);

module.exports = db;