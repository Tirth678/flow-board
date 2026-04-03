const express = require('express');
const app = express();
app.use(express.json())
const authController = require('../src/controllers/auth.controller')

app.use('/api/auth', auth)

module.exports = app;