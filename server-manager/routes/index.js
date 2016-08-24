var express = require('express');
var router = express.Router();
var database = require('../database.js');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'ERMESXMLSCOUT - Internal Software' });
});

router.get('/xml/:testo/from/:from/to/:to', function(req, res, next){
  database.getConnection(function(err, connection){
    if(err) return res.send(err);
    req.params.testo = '%' + req.params.testo + '%';
    connection.query('SELECT * FROM scorporo_xml WHERE (TX_RICHIESTA_XML LIKE ? OR TX_RISPOSTA_XML LIKE ? OR TX_RICHIESTA2_XML LIKE ? OR TX_RICHIESTA3_XML LIKE ? OR TX_RISPOSTA2_XML LIKE ? OR TX_RISPOSTA3_XML LIKE ?) AND (TX_DATAINVIO >= ? AND TX_DATAINVIO <= ?)', [req.params.testo, req.params.testo, req.params.testo, req.params.testo, req.params.testo, req.params.testo, req.params.from, req.params.to], function(err, rows, fields){
      if(err) return res.json(err);
      connection.release()
      return res.json(rows);
    });
  })
  
});

module.exports = router;
