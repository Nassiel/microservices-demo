var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jsonwebtoken = require('jsonwebtoken');
const jwt = require('express-jwt');
const fs = require('fs');

var loansRouter = require('./routes/invoices');
var statusRouter = require('./routes/status');
var infoRouter = require('./routes/info');

var app = express();

// parse and validate tokens

const secretCallback = (req, payload, done) => {
  done(null, global.jwtPublicKey);
};

app.use(jwt({
  secret: secretCallback,
  credentialsRequired: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/invoices', invoicesRouter);
app.use('/', statusRouter);
app.use('/info', infoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({status: 'error'});
});

module.exports = app;
