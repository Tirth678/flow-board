const express = require('express');
const connectDB = require('./db/db');
const app = express();
const authRoutes = require('../src/routes/auth.route')

app.use(express.json());

app.use('/api/auth', authRoutes)
module.exports = app;