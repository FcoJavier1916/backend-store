const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {ordersControllerAdmin} = require('../../controllers/index');

router.get('/orders/admin', authMiddleware(['superadmin']),ordersControllerAdmin.getOrders);
router.get('/orders/admin/:search', authMiddleware(['superadmin']),ordersControllerAdmin.getOrderById);
router.put('/orders/admin/:orderNumber', authMiddleware(['superadmin']),ordersControllerAdmin.putOrder);
router.delete('/orders/admin/:orderNumber',authMiddleware(['superadmin']),ordersControllerAdmin.deleteOrdeer);

module.exports = router