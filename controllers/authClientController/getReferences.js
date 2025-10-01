const Reference = require('../../models/referenceModel'); 


const getReferences = async (req, res) => {
  try {
    const references = await Reference.find().sort({ createdAt: -1 }); 
    return res.status(200).json(references);
  } catch (error) {
    console.error('Error obteniendo referencias:', error);
    return res.status(500).json({ error: 'No fue posible obtener las referencias' });
  }
};

module.exports = getReferences;
