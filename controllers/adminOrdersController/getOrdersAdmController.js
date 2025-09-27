const Order = require('../../models/orderModel');

const getOrdersAdm = async (req, res) => {
  try {
    const { email, orderNumber } = req.query;
    const filter = {};

    if (email) filter.userEmail = email;      // 👈 aquí filtras por correo
    if (orderNumber) filter.orderNumber = orderNumber; // 👈 filtras por número

    const orders = await Order.find(filter);  // 👈 sin populate
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ getOrdersAdm error:", error);
    res.status(500).json({
      message: '❌ Error al obtener órdenes',
      error: error.message || error
    });
  }
};

module.exports = getOrdersAdm;
