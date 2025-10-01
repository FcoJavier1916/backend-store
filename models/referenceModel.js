const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // Correo del usuario que deja la referencia
  text: { type: String, required: true },      // Comentario
  date: { type: Date, default: Date.now },     // Fecha de publicación
  imageUrl: { type: String },                  // Imagen opcional
  rating: { type: Number, min: 1, max: 5 }     // Calificación opcional, 1 a 5
});

module.exports = mongoose.model('Reference', referenceSchema);
