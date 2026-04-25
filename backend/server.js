const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dev_only_insecure_secret_set_a_real_one_in_replit_secrets';
}

const { connect } = require('./config/db');
const seed = require('./seed');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/flights', require('./routes/flights'));
app.use('/api/users', require('./routes/users'));
app.use('/api/bookings', require('./routes/bookings'));

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(frontendDir, 'index.html'));
});

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = '0.0.0.0';

(async () => {
  try {
    const { mode } = await connect();
    await seed({ force: mode === 'memory' });
    app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
