const express = require('express');
const router = express.Router();
const {eventsAdminController} =require('../../controllers/index')
const uploads = require('../../middlewares/uploadMiddleware') 

router.get('/events', eventsAdminController.getEvents);
router.get('/events/:id', eventsAdminController.getEventById);

router.post('/events/create',
  uploads.fields([
    { name: 'imgUrlEvent', maxCount: 1 },
    { name: 'imgUrlMap', maxCount: 1 }
  ]),
  eventsAdminController.postEvent
);

router.post('/events/upexcel',
  uploads.singleFile('file'), 
  eventsAdminController.postExcelEvents
);

router.put('/events/:id',
  uploads.fields([
    { name: 'imgUrlEvent', maxCount: 1 },
    { name: 'imgUrlMap', maxCount: 1 }
  ]),eventsAdminController.putEvent
);

router.delete('/events/all', eventsAdminController.deleteEvents.deleteAllEvents);

router.delete('/events/:id', eventsAdminController.deleteEvents.deleteEventById);


router.delete('/events', eventsAdminController.deleteEvents.deleteEventsByIds);

module.exports = router

