const express = require('express');
const router = express.Router();
const {emailOrdersController} = require('../../controllers/index')

router.post("/email/send-followup", emailOrdersController.preOrder);
router.post("/email/send-approved", emailOrdersController.sendOrderApprovedEmail);


module.exports = router