const express = require('express');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('flightId')
      .populate('userId', '-passwordHash')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const bookings = await Booking.find({ userId: req.params.id })
      .populate('flightId')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flightId')
      .populate('userId', '-passwordHash');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { flightId, seatNumber } = req.body;
    if (!flightId || !seatNumber) {
      return res.status(400).json({ error: 'flightId and seatNumber are required' });
    }
    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    if (flight.seatsAvailable < 1) {
      return res.status(400).json({ error: 'No seats available' });
    }
    const seatTaken = await Booking.findOne({ flightId, seatNumber, status: 'confirmed' });
    if (seatTaken) return res.status(400).json({ error: `Seat ${seatNumber} is already booked` });

    flight.seatsAvailable -= 1;
    await flight.save();
    const booking = await Booking.create({
      userId: req.user.id,
      flightId,
      seatNumber,
      status: 'confirmed',
    });
    const populated = await Booking.findById(booking._id).populate('flightId');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
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

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const result = await Booking.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
