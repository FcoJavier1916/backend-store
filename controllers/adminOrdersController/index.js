const getOrders = require('./getOrdersAdmController')
const getOrderById = require('./getOrderByIdAdmController'); 
const putOrder = require('./putOrderAdmController');
const deleteOrdeer = require('./deleteOrderAdmController');


module.exports = {getOrders, getOrderById,putOrder,deleteOrdeer};
