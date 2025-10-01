const Reference = require('../../models/referenceModel'); // Ajusta la ruta según tu proyecto

// Crear nueva referencia
const createReference = async (req, res) => {
  try {
    const { text, imageUrl, rating } = req.body;
    const userEmail = req.user.email; 

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'El comentario no puede estar vacío' });
    }

    // Crear la referencia
    const newReference = await Reference.create({
      userEmail,
      text,
      imageUrl: imageUrl || null,
      rating: rating || null
    });

    return res.status(201).json({
      message: 'Referencia creada correctamente',
      reference: newReference
    });
  } catch (error) {
    console.error('Error creando referencia:', error);
    return res.status(500).json({ error: 'No fue posible crear la referencia' });
  }
};

module.exports = createReference;
