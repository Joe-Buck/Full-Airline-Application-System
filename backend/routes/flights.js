const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    const filter = {};
    if (origin) filter.origin = new RegExp(origin, 'i');
    if (destination) filter.destination = new RegExp(destination, 'i');
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.departureTime = { $gte: start, $lt: end };
    }
    const flights = await Flight.find(filter).sort({ departureTime: 1 });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const result = await Flight.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Flight not found' });
    res.json({ message: 'Flight deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
