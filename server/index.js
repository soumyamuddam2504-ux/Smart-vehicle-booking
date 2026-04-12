const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createTables } = require('./db/schema');
const { seed } = require('./db/seed');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/bookings', require('./routes/bookings'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;

async function start() {
  createTables();
  await seed();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();
