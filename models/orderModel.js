const mongoose = require("mongoose");

// Detalles de cada ticket/pedido dentro de una orden
const ticketSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  title: { type: String, required: true },
  tour: { type: String },
  date: { type: Date },
  status: { type: String, default: "pending" },
  zone: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  venue: { type: String },
  city: { type: String },
  ticketOffice: { type: String },
  imageUrl: { type: String }
});

// Información de entrega (digital o domicilio)
const deliverySchema = new mongoose.Schema({
  type: { type: String, enum: ["digital", "domicilio"], required: true },
  email: { type: String },        // si es digital, correo de entrega
  name: { type: String },         // si es domicilio
  street: { type: String },
  exterior: { type: String },
  interior: { type: String },
  colony: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  phone: { type: String },
  reference: { type: String }
});

// Orden de compra completa
const orderSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },       // correo del usuario logueado, identificador
    orderNumber: { type: String, required: true, unique: true },
    tickets: [ticketSchema],                           // uno o más tickets/eventos
    deliveryInfo: deliverySchema,                      // datos de entrega
    paymentStatus: { type: String }, // pending, approved, rejected
    totalAmount: { type: Number, required: true }      // total de la orden
  },
  { timestamps: true }
);

// Middleware para limpiar strings
orderSchema.pre('save', function(next) {
  const doc = this;
  Object.keys(doc.toObject()).forEach(key => {
    if (typeof doc[key] === 'string') doc[key] = doc[key].trim();
  });
  next();
});

orderSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update && update.$set) {
    Object.keys(update.$set).forEach(key => {
      if (typeof update.$set[key] === 'string') update.$set[key] = update.$set[key].trim();
    });
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
