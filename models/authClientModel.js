const mongoose = require('mongoose');

const authClientModel = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },            // nuevo campo opcional para guardar el nombre
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
});

module.exports = mongoose.model('AuthCode', authClientModel);
