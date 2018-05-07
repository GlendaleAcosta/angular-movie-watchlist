var pgp = require('pg-promise')();

// Database Config
var connection = {
    host: 'localhost',
    port: 5432,
    database: 'movie_watchlist',
    user: 'glendaleacosta',
    password: ''
}
// var connection = {
//     host: 'ec2-23-23-225-116.compute-1.amazonaws.com',
//     port: 5432,
//     database: 'd9n4svelcktveq',
//     user: 'gsrlqmwyfrxjup',
//     password: 'b7349fe4b623f5035f4566cff63340c256aa8cd30923ca0fd689df95c4640855'
// }
// Database Connection
var db = pgp(connection);

module.exports = db;
