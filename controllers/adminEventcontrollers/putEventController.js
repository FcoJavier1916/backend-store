const Event = require('../../models/EventsModel');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const uploadFromBuffer = (buffer, folder, isEvent = false) => {
  return new Promise((resolve, reject) => {
    const transformations = [
      { width: 1920, height: 1080, crop: "limit", quality: "auto", format: "jpg" },
    ];

    if (isEvent) {
      transformations.push({
        overlay: {
            font_family: "arial",
            font_size: 35,
            font_weight: "bold",
            text: "MYTICKETBOX MYTICKETBOX MYTICKETBOX"
          },
          gravity: "center",
          flags: "layer_apply",
          color: "#000000ff",
          opacity: 50});
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: transformations,
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const putEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Event.findById(id);

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Actualizar campos básicos
    const campos = ["titulo", "tour", "fecha", "estado", "recinto", "boletera", "disponibilidad", "categoria"];
    campos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        evento[campo] = req.body[campo];
      }
    });

    // Manejo de zonas
    if (req.body.zonas) {
      let zonasParsed = req.body.zonas;
      if (typeof zonasParsed === "string") {
        zonasParsed = JSON.parse(zonasParsed);
      }
      evento.zonas = zonasParsed.map((z) => ({
        zona: z.zona,
        precio: Number(z.precio),
      }));
    }

    // Imagen principal (EVENTOS con marca de agua)
    if (req.files?.imgUrlEvent) {
      if (evento.imgPublicIdEvent) {
        await cloudinary.uploader.destroy(evento.imgPublicIdEvent);
      }
      const file = req.files.imgUrlEvent[0];
      const uploadResult = await uploadFromBuffer(file.buffer, "eventos", true);
      evento.imgUrlEvent = uploadResult.secure_url;
      evento.imgPublicIdEvent = uploadResult.public_id;
    }

    // Imagen del mapa (MAPAS sin texto)
    if (req.files?.imgUrlMap) {
      if (evento.imgPublicIdMap) {
        await cloudinary.uploader.destroy(evento.imgPublicIdMap);
      }
      const file = req.files.imgUrlMap[0];
      const uploadResult = await uploadFromBuffer(file.buffer, "mapas", false);
      evento.imgUrlMap = uploadResult.secure_url;
      evento.imgPublicIdMap = uploadResult.public_id;
    }

    const actualizado = await evento.save();

    res.status(200).json({
      message: "✅ Evento actualizado correctamente",
      evento: actualizado,
    });
  } catch (error) {
    console.error("❌ Error al actualizar evento:", error);
    res.status(500).json({
      message: "Error al actualizar evento",
      error: error.message || error,
    });
  }
};

module.exports = putEvent;
