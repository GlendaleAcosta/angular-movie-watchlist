var pgp = require('pg-promise')();

// Database Config
var connection = {
    host: 'localhost',
    port: 5433,
    database: 'movie_watchlist',
    user: 'postgres',
    password: 'rootpw'
};
// Database Connection
var db = pgp(connection);

module.exports = db;