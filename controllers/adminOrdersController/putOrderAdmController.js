const Order = require('../../models/orderModel');

const putOrderAdmController = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { status, ...orderFields } = req.body;

    let updatedOrder;

    if (status) {
      // 👇 actualiza todos los tickets
      updatedOrder = await Order.findOneAndUpdate(
        { orderNumber },
        { 
          $set: { 
            "tickets.$[].status": status,
            ...orderFields // también aplica otros campos si vienen
          } 
        },
        { new: true, runValidators: true }
      );
    } else {
      // 👇 solo actualiza los campos normales de la orden
      updatedOrder = await Order.findOneAndUpdate(
        { orderNumber },
        orderFields,
        { new: true, runValidators: true }
      );
    }

    if (!updatedOrder) {
      return res.status(404).json({ message: "⚠️ Orden no encontrada" });
    }

    res.status(200).json({
      message: "✅ Orden actualizada",
      order: updatedOrder
    });
  } catch (error) {
    console.error("❌ putOrderAdmController error:", error);
    res.status(500).json({
      message: "❌ Error al actualizar la orden",
      error: error.message || error
    });
  }
};

module.exports = putOrderAdmController;
