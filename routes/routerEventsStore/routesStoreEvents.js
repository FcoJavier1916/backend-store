const express = require('express');
const router = express.Router();
const {eventsStoreController} = require('../../controllers/index');

router.get('/events', eventsStoreController.getEventsStore);
router.get('/events/:id',eventsStoreController.getEventStoreById);

module.exports = router
