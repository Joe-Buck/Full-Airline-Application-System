const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
// GET all flights
router.get('/', async (req, res) => {
 const flights = await Flight.find();
 res.json(flights);
});
// GET single flight
router.get('/:id', async (req, res) => {
 const flight = await Flight.findById(req.params.id);
 res.json(flight);
});
// POST create flight (admin only)
router.post('/', async (req, res) => {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
   });
   // PUT update flight
   router.put('/:id', async (req, res) => {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(flight);
   });
   // DELETE flight
   router.delete('/:id', async (req, res) => {
    await Flight.findByIdAndDelete(req.params.id);
    res.json({ message: 'Flight deleted' });
   });
module.exports=router;   