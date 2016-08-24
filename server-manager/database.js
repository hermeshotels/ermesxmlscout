var mysql = require('mysql');
var pool  = mysql.createPool({
    host: '192.168.115.2',
    user: 'hermes',
    password: 'h3rm3s01!',
    database: 'hermes5',
});

module.exports = pull;