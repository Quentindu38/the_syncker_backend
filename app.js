process.env.NODE_ENV = 'production';
const express = require('express');
const syncRouter = require('./routes/sync');
const getImageRouter = require('./routes/getImages');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const config = require('./config/config');
const logger = require('morgan');


const app = express();

// app.use(logger("dev"));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

app.use(express.static(config.syncedDir.replace(/\\/gi, "/")));

app.use('/sync', syncRouter);
app.use('/getImages', getImageRouter);
app.use('/*', (req, res, next) => {
  return res.json({state:"syncker is running..."});
});

module.exports = app;
