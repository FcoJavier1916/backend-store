// routes/mockPayment.js
const express = require("express");
const router = express.Router();

router.post("/mock-payment-status", (req, res) => {
  const { status } = req.body;

  // Simulamos la respuesta de Clip
  const mockResponse = {
    id: "mock-payment-id-123",
    status: status || "pending", // "approved", "rejected", "pending"
    status_detail: {
      code: status === "pending" ? "PE-3DS01" : null,
      description: status === "pending" ? "3DS authentication required" : null,
    },
    pending_action:
      status === "pending"
        ? {
            type: "open_modal",
            url: "https://3ds.mock-payclip.com?transaction=abc123",
          }
        : null,
  };

  res.json(mockResponse);
});

module.exports = router;
