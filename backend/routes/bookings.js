const express = require('express');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('flightId').populate('userId', '-passwordHash');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('flightId').populate('userId', '-passwordHash');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, flightId, seatNumber } = req.body;
    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    if (flight.seatsAvailable <= 0) return res.status(400).json({ error: 'No seats available' });
    flight.seatsAvailable -= 1;
    await flight.save();
    const booking = await Booking.create({ userId, flightId, seatNumber });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status === 'canceled') return res.json(booking);
    booking.status = 'canceled';
    await booking.save();
    const flight = await Flight.findById(booking.flightId);
    if (flight) {
      flight.seatsAvailable += 1;
      await flight.save();
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
