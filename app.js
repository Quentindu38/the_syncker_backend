var express = require('express');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var syncRouter = require('./routes/sync');
var getImageRouter = require('./routes/getImages');

var app = express();

// app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/sync', syncRouter);
app.use('/getImages', getImageRouter);

module.exports = app;
