const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const boolParser = require('express-query-boolean');
const helmet = require('helmet');
require('dotenv').config();
// const AVATARS_DIR = process.env.AVATARS_DIR;

const { HttpCodeRes, ExpressJsonParams } = require('./config/constants');
const contactsRouter = require('./routes/contacts/contacts');
const usersRouter = require('./routes/users/users');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(express.static('public'));
app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: ExpressJsonParams.LIMIT }));
app.use(boolParser());

app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((_req, res) => {
  res
    .status(HttpCodeRes.NOT_FOUND)
    .json({ status: 'error', code: HttpCodeRes.NOT_FOUND, message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  const statusCode = err.status || 500;
  res
    .status(statusCode)
    .json({ status: statusCode === 500 ? 'fail' : 'error', code: statusCode, message: err.message });
});

module.exports = app;
