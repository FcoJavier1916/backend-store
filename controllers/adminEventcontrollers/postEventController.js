const Event = require('../../models/EventsModel');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// función para subir con transformación
const uploadToCloudinary = (fileBuffer, folder, tipo) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1920, height: 1080, crop: "limit" }, // 👈 se ajusta sin recortar
        { quality: "auto", fetch_format: "jpg" }
      ]
    };

    if (tipo === "evento") {
      options.transformation.push(
        {
          overlay: {
            font_family: "arial",
            font_size: 35,
            font_weight: "bold",
            text: "CIRCULO ESCENA Mx"
          },
          gravity: "center",
          flags: "layer_apply",
          color: "#000000ff",
          opacity: 50
        }
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const postEvent = async (req, res) => {
  try {
    const { titulo, tour, fecha, estado, recinto, boletera, disponibilidad, categoria, zonas } = req.body;

    if (!titulo || !tour || !fecha || !estado || !recinto || !boletera || !disponibilidad || !categoria) {
      return res.status(400).json({ message: 'Faltan campos obligatorios para crear el evento' });
    }

    // Subir imágenes
    const resultEvent = req.files?.imgUrlEvent?.[0]
      ? await uploadToCloudinary(req.files.imgUrlEvent[0].buffer, 'eventos', 'evento')
      : null;

    const resultMap = req.files?.imgUrlMap?.[0]
      ? await uploadToCloudinary(req.files.imgUrlMap[0].buffer, 'mapas', 'mapa')
      : null;

    // Parsear zonas
    let parsedZonas = [];
    if (zonas) {
      try {
        parsedZonas = typeof zonas === 'string' ? JSON.parse(zonas) : zonas;
      } catch (err) {
        return res.status(400).json({
          message: "El campo 'zonas' no tiene un JSON válido. Ejemplo: [{\"zona\":\"VIP\",\"precio\":2500}]"
        });
      }
    }

    // Crear evento
    const newEvent = new Event({
      titulo,
      tour,
      fecha,
      estado,
      recinto,
      boletera,
      disponibilidad,
      categoria,
      imgUrlEvent: resultEvent?.secure_url || '',
      imgPublicIdEvent: resultEvent?.public_id || '',
      imgUrlMap: resultMap?.secure_url || '',
      imgPublicIdMap: resultMap?.public_id || '',
      zonas: parsedZonas
    });

    const saveEvent = await newEvent.save();

    res.status(201).json({
      message: '✅ Evento creado con imágenes (ajustadas a 1920x1080, evento con marca de agua, mapa sin texto)',
      evento: saveEvent
    });

  } catch (error) {
    console.error("❌ Error al crear evento con upload:", error);
    res.status(500).json({
      message: 'Error al crear evento con upload',
      error: error.message || error
    });
  }
};

module.exports = postEvent;
