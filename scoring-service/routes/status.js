var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.send({
    status: 'ok',
    service: 'installment-calculator-service',
    version: '1.0.1',
    commit: '45ceea0def7b8e25f6ae4c24994f6b0897b5fcad',
    maintainer: 'info@nassiel.com',
    gitrepo: 'https://github.com/nassiel/installment-calculator-service',
    uptime: process.uptime()
  });
});

module.exports = router;
