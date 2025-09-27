const Order = require("../../models/orderModel");

const deleteOrderAdmController = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const deletedOrder = await Order.findOneAndDelete({ orderNumber });

    if (!deletedOrder) {
      return res.status(404).json({ message: "⚠️ Orden no encontrada" });
    }

    res.status(200).json({
      message: "🗑️ Orden eliminada",
      order: deletedOrder,
    });
  } catch (error) {
    console.error("❌ deleteOrderAdmController error:", error);
    res.status(500).json({
      message: "❌ Error al eliminar la orden",
      error: error.message || error,
    });
  }
};

module.exports = deleteOrderAdmController;
