const express = require('express');
const router = express.Router();
const odersController = require('../../controllers/index')

router.post('/client/create-order',
    odersController.ordersController.postOrder
);

router.get('/client/orders/:userEmail', 
    odersController.ordersController.getOrdersuser
);

module.exports = router