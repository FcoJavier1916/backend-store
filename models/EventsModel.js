const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  zona: { type: String, required: true },
  precio: { type: Number, required: true },
}, { _id: false });

const eventSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  tour: { type: String, required: true },
  fecha: { type: String, required: true },
  estado: { type: String, required: true },
  recinto: { type: String, required: true },
  boletera: { type: String, required: true },
  disponibilidad: { type: String, required: true },
  categoria: { type: String, required: true },
  imgUrlEvent: { type: String, default: '' },
  imgPublicIdEvent: { type: String, default: '' },
  imgUrlMap: { type: String, default: '' },
  imgPublicIdMap: { type: String, default: '' },
  zonas: { type: [zoneSchema], default: [] }
}, { 
  collection: 'events',
  timestamps: true 
});

// 🧹 Middleware para limpiar espacios en strings
eventSchema.pre('save', function(next) {
  const doc = this;
  Object.keys(doc.toObject()).forEach((key) => {
    if (typeof doc[key] === 'string') {
      doc[key] = doc[key].trim();
    }
  });
  next();
});

// 🧹 También al actualizar (findOneAndUpdate, updateOne, etc.)
eventSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update && update.$set) {
    Object.keys(update.$set).forEach((key) => {
      if (typeof update.$set[key] === 'string') {
        update.$set[key] = update.$set[key].trim();
      }
    });
  }
  next();
});

const EventModel = mongoose.model('Event', eventSchema);

module.exports = EventModel;
