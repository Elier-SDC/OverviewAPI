require('dotenv').config();
const express = require('express');
const router = require('../routes');
const db = require('../db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', router);

app.get('/test', (req, res) => {
  res.status(200).send('test');
});

module.exports = app;