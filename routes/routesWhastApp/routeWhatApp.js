const express = require('express');
const router = express.Router();
const whatsSendMsj = require('../../controllers/index')

router.get('/whatsapp/send', whatsSendMsj.whastAppController.whatsAppOrder);

module.exports = router;