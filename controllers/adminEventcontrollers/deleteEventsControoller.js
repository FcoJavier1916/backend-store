const Event = require('../../models/EventsModel');
const cloudinary = require('cloudinary').v2;

// Eliminar un evento por ID
const deleteEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Event.findById(id);

    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Borrar imágenes en Cloudinary si existen
    if (evento.imgPublicIdEvent) await cloudinary.uploader.destroy(evento.imgPublicIdEvent);
    if (evento.imgPublicIdMap) await cloudinary.uploader.destroy(evento.imgPublicIdMap);

    await evento.deleteOne();

    res.status(200).json({ message: `Evento ${id} eliminado correctamente` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar evento', error: error.message });
  }
};

// Eliminar varios eventos por IDs (envía un array de IDs en body)
const deleteEventsByIds = async (req, res) => {
  try {
    const { ids } = req.body; // ej: { ids: ["id1", "id2"] }

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'Envía un array de IDs' });
    }

    const eventos = await Event.find({ _id: { $in: ids } });

    for (const evento of eventos) {
      if (evento.imgPublicIdEvent) await cloudinary.uploader.destroy(evento.imgPublicIdEvent);
      if (evento.imgPublicIdMap) await cloudinary.uploader.destroy(evento.imgPublicIdMap);
    }

    const result = await Event.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: `Se eliminaron ${result.deletedCount} eventos` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar eventos', error: error.message });
  }
};

// Eliminar todos los eventos
const deleteAllEvents = async (req, res) => {
  try {
    const eventos = await Event.find();

    for (const evento of eventos) {
      if (evento.imgPublicIdEvent) await cloudinary.uploader.destroy(evento.imgPublicIdEvent);
      if (evento.imgPublicIdMap) await cloudinary.uploader.destroy(evento.imgPublicIdMap);
    }

    const result = await Event.deleteMany({});

    res.status(200).json({ message: `Se eliminaron todos los eventos (${result.deletedCount})` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar todos los eventos', error: error.message });
  }
};

module.exports = {
  deleteEventById,
  deleteEventsByIds,
  deleteAllEvents,
};