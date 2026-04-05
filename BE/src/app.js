const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes = require('../src/routes/auth.route');
const orgRoutes = require('../src/routes/org.route');
const boardRoutes = require('../src/routes/board.route');
const cardRoutes = require('../src/routes/card.route');

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes)
app.use('/api/org', orgRoutes)
app.use('/api/board', boardRoutes)
app.use('/api/card', cardRoutes)
module.exports = app;