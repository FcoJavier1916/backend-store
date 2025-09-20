// controllers/orderController.js
const Order = require("../../models/orderModel");

// Generar número de orden único simple
const generateOrderNumber = () => {
  return "ORD-" + Math.floor(Math.random() * 1000000);
};

// Crear una nueva orden
const createOrder = async (req, res) => {
  try {
    const { userEmail, tickets, deliveryInfo, totalAmount , paymentStatus } = req.body;

    if (!userEmail || !tickets || !deliveryInfo || !totalAmount) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const newOrder = new Order({
      userEmail,
      orderNumber: generateOrderNumber(),
      tickets,
      deliveryInfo,
      totalAmount,
      paymentStatus,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Orden creada exitosamente",
      order: savedOrder
    });
  } catch (error) {
    console.error("Error creando la orden:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = createOrder;
