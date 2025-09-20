const Event = require('../../models/EventsModel');

const getEventsStore = async(req, res) =>{
    try{
        const events = await Event.find();
        res.status(200).json(events);
    }catch(error){
        res.status(500).json({message:'❌ error al obtener respuesta', error});
    }
}

module.exports = getEventsStore