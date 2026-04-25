const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  totalSeats: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'scheduled' },
});

flightSchema.index({ origin: 1, destination: 1, departureTime: 1 });

module.exports = mongoose.model('Flight', flightSchema);
