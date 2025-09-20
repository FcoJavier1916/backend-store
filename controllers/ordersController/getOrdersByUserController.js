// controllers/ordersController/getOrdersByUser.js
const Order = require('../../models/orderModel');

const getOrdersByUser = async (req, res) => {
  try {
    const { userEmail } = req.params;
    if (!userEmail) {
      return res.status(400).json({ message: "El correo es requerido" });
    }

    const orders = await Order.find({ userEmail }).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error obteniendo órdenes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = getOrdersByUser;
