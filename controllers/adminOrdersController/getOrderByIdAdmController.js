const Order = require("../../models/orderModel");

const getOrderBySearchAdmController = async (req, res) => {
  try {
    const { search } = req.params; // puede ser número de orden o correo
    let orders = [];

    if (search.startsWith("ORD-")) {
      // Buscar por número de orden (único)
      const order = await Order.findOne({ orderNumber: search });
      if (order) orders.push(order);
    } else if (search.includes("@")) {
      // Buscar por correo (pueden ser varias)
      orders = await Order.find({ userEmail: search });
    }

    if (orders.length === 0) {
      return res.status(404).json({ message: "⚠️ Orden(es) no encontrada(s)" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ getOrderBySearchAdmController error:", error);
    res.status(500).json({
      message: "❌ Error al obtener orden(es)",
      error: error.message || error,
    });
  }
};

module.exports = getOrderBySearchAdmController;
