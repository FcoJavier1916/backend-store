const fetch = require("node-fetch");

const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const API_KEY = process.env.CLIP_KEY_SECERT;

    if (!paymentId) {
      return res.status(400).json({ error: "Se requiere el paymentId" });
    }

    const response = await fetch(`https://api.payclip.com/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || "Error al consultar el pago");
    }

    const result = JSON.parse(text);

    // Detectar si requiere 3DS
    if (result.status === "pending" && result.status_detail?.code === "PE-3DS01") {
      return res.json({
        requires_3ds: true,
        payment_id: result.id,
        url: result.pending_action?.url,
        message: result.status_detail.message,
      });
    }

    res.json({
      requires_3ds: false,
      payment_id: result.id,
      status: result.status,
      clip_response: result,
    });

  } catch (error) {
    console.error("Error al consultar estado de pago:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = getPaymentStatus;
