const mongoose = require('mongoose');

const authClientModel = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
  used: { type: Boolean, default: false }
});

module.exports = mongoose.model('AuthCode', authClientModel);