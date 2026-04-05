const express = require('express');
const connectDB = require('./db/db');
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes = require('../src/routes/auth.route');
const orgRoutes = require('../src/routes/org.route');

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes)
app.use('/api/org', orgRoutes)
app.use('api/org/board', orgRoutes)
module.exports = app;