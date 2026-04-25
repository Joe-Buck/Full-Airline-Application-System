const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  seatNumber: { type: String, required: true },
  status: { type: String, enum: ['confirmed', 'canceled'], default: 'confirmed' },
  bookingDate: { type: Date, default: Date.now },
});

bookingSchema.index({ userId: 1, bookingDate: -1 });
bookingSchema.index({ flightId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
