const userController = require('./adminController/index');
const eventsAdminController = require('./adminEventcontrollers/index')
const clientController = require('./authClientController/index')
const eventsStoreController = require('./evenstStoreController/index')
const paymentClipController = require('../controllers/paymentController/index')
const ordersController = require('./ordersController/index')
const whastAppController = require('./whatsAppController/index')
const emailOrdersController = require('./emailController/index')
const ordersControllerAdmin = require('./adminOrdersController')



module.exports = {
    userController,
    eventsAdminController,
    clientController,
    eventsStoreController,
    paymentClipController,
    ordersController,
    whastAppController,
    emailOrdersController,
    ordersControllerAdmin
}