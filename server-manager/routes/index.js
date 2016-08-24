var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '192.168.115.2',
    user: 'hermes',
    password: 'h3rm3s01!',
    database: 'hermes5',
});
connection.connect();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'ERMESXMLSCOUT - Internal Software' });
});

router.get('/xml/:testo/from/:from/to/:to', function(req, res, next){
  connection.query('SELECT * FROM scorporo_xml WHERE TX_RICHIESTA_XML LIKE "%' + req.params.testo + '%" AND TX_DATAINVIO >= ' + req.params.from + ' AND TX_DATAINVIO <= ' + req.params.to, function(err, rows, fields){
      if(err) return res.json(err);
      return res.json(rows);
  });
});

module.exports = router;
