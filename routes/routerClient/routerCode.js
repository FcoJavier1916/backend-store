const express = require('express');
const router = express.Router();
const {clientController} = require('../../controllers/index');

router.post('/send-code', clientController.sendCode);
router.post('/verify-code', clientController.verifyCode);

module.exports = router;