const Event = require('../../models/EventsModel');

const getEventStoreByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: '❌ ID inválido' });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: '❌ Evento no encontrado' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getEventStoreByIdController;