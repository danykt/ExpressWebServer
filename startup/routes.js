const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const adress = require('../routes/adress');
const order = require('../routes/order');
const employee = require('../routes/employee');
const schedule = require('../routes/schedule');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/adress', adress);
  app.use('/api/orders', order);
  app.use('/api/employee', employee);
  app.use('/api/schedule', schedule);
  app.use(error);
}
