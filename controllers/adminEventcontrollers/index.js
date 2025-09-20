const getEvents = require('./getEventsController');
const getEventById = require('./getEventByIsController');
const postEvent = require('./postEventController');
const postExcelEvents = require('./postExcelController');
const putEvent = require('./putEventController')
const deleteEvents = require('./deleteEventsControoller')

module.exports = {getEvents,getEventById,postEvent, postExcelEvents ,putEvent,deleteEvents};