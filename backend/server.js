const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Database Connection
mongoose.connect(process.env.MONGO_URI)
 .then(() =>
 console.log('MongoDB connected'))
 .catch(err =>
 console.error(err));
// Routes
app.use('/api/flights',
 require('./routes/flights'));
app.use('/api/users',
 require('./routes/users'));
app.use('/api/bookings',
 require('./routes/bookings'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
 console.log(`Server on port ${PORT}`));