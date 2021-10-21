const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const {HttpCodeRes} = require('./config/constants');
const contactsRouter = require('./routes/contacts/contacts');
const usersRouter = require('./routes/users/users');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((_req, res) => {
  res
    .status(HttpCodeRes.NOT_FOUND)
    .json({ status: 'error', code: HttpCodeRes.NOT_FOUND, message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    return res
      .status(HttpCodeRes.BAD_REQUEST)
      .json({ status: 'fail', code: HttpCodeRes.BAD_REQUEST, message: err.message });
  }
  res
    .status(HttpCodeRes.SERVER_ERROR)
    .json({ status: 'fail', code: HttpCodeRes.SERVER_ERROR, message: err.message });
});

module.exports = app;
