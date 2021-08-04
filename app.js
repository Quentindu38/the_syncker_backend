process.env.NODE_ENV = 'production';
const express = require('express');
const syncRouter = require('./routes/sync');
const getImageRouter = require('./routes/getImages');
const issueTokenRouter = require('./routes/auth');
const helmet = require('helmet');
const compression = require('compression');


const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());


app.use('/sync', syncRouter);
app.use('/getImages', getImageRouter);
app.use('/issueToken', issueTokenRouter);
app.use('/*', (req, res, next) => {
  return res.json({state:"syncker is running..."});
});

module.exports = app;
