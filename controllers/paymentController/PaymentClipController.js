// backend/controllers/paymentController.js
const Payment = require("../../models/PaymentModel");
const fetch = require("node-fetch");

const createPayment = async (req, res) => {
  try {
    const API_KEY = process.env.CLIP_KEY_SECERT;
    console.log("api key", API_KEY);

    // Extraer correctamente los campos anidados
    const { amount, description, payment_method, customer } = req.body;
    const { token } = payment_method || {};
    const { email, phone } = customer || {};

    // Crear la instancia del modelo
    const payment = new Payment({ token, email, phone, amount, description });
    console.log("Payment creado:", payment);

    if (!payment.isValid()) {
      console.log("Validación fallida:", payment);
      return res.status(400).json({ error: "Datos incompletos o inválidos" });
    }

    // Llamada a la API de Clip
    const response = await fetch("https://api.payclip.com/payments", {
      method: "POST",
      headers: {
        Authorization: API_KEY,  // Nunca exponer en frontend
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: payment.amount,
        currency: "MXN",
        description: payment.description,
        payment_method: { token: payment.token },
        customer: { email: payment.email, phone: payment.phone },
      }),
    });

    const result = await response.json(); // Directamente parsea JSON

    console.log("Respuesta completa de Clip:", result);

    if (!response.ok) {
      throw new Error(JSON.stringify(result));
    }

    res.json(result);

  } catch (error) {
    console.error("Error al procesar pago:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = createPayment;
