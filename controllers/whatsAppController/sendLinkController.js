const sendWhatsAppLink = (req, res) => {
  try {
    const API_WhatsApp = process.env.WHATSAPP_LINK;
    const { orderId } = req.query; // recibimos la orden desde el frontend

    if (!orderId) {
      return res.status(400).json({ error: "Falta el id de la orden" });
    }

    const message = `Hola, quisiera confirmar y dar continuidad a mi compra. Mi orden es: ${orderId}`;
;
    const encodedMessage = encodeURIComponent(message);
    const link = `${API_WhatsApp}?text=${encodedMessage}`;

    return res.json({ link });
  } catch (error) {
    console.error("Error en sendWhatsAppLink:", error);
    return res
      .status(500)
      .json({ error: "Error al generar enlace de WhatsApp" });
  }
};

module.exports = sendWhatsAppLink;
