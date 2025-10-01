const express = require('express');
const router = express.Router();
const {clientController} = require('../../controllers/index');
const { verifyUser } = require('../../middlewares/verifyUser');

router.post('/send-code', clientController.sendCode);
router.post('/verify-code', clientController.verifyCode);
router.put('/update-name', verifyUser, clientController.updateUserName);
router.post('/reference', verifyUser, clientController.createReference);
router.get('/view-reference', clientController.getReferences);

module.exports = router;