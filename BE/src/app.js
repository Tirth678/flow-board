const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const authRoutes = require('../src/routes/auth.route');
const orgRoutes = require('../src/routes/org.route');
const boardRoutes = require('../src/routes/board.route');
const cardRoutes = require('../src/routes/card.route');

const allowedOrigins = (process.env.CLIENT_URL || 'http://127.0.0.1:3001,http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev')); // will show which method on which API all details in dev mode

app.get('/api/health', (req, res) => {
  res.status(200).json({message: 'Flow Board API is running'});
});

app.use('/api/auth', authRoutes)
app.use('/api/org', orgRoutes)
app.use('/api/board', boardRoutes)
app.use('/api/card', cardRoutes)
module.exports = app;
