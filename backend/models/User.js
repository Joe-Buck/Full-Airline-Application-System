const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
 username: {
 type: String,
 required: true,
 unique: true
 },
 email: {
 type: String,
 required: true,
 unique: true
 },
 passwordHash: {
 type: String,
 required: true
 },
 role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
    },
    createdAt: {
    type: Date,
    default: Date.now
    }
   });
   module.exports =
    mongoose.model('User', userSchema);