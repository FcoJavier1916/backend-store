const express = require("express");
const {paymentClipController} = require("../../controllers/index");

const router = express.Router();

router.post("/pay", paymentClipController.paymentClip);
router.get("/pay/:paymentId", paymentClipController.paymentClipStatus);

module.exports = router;