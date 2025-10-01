// controllers/updateNameController.js
const AuthCode = require('../../models/authClientModel');

const updateUserName = async (req, res) => {
  try {
    const { email } = req.user || req.body; // email desde contexto (middleware JWT) o body
    const { name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'No se pudo identificar al usuario' });
    }

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'No se proporcionó un nombre válido' });
    }

    // Actualizar el campo name
    const updatedUser = await AuthCode.findOneAndUpdate(
      { email },
      { name: name.trim() },
      { new: true } // devuelve el documento actualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json({ message: 'Nombre actualizado correctamente', user: updatedUser });
  } catch (error) {
    console.error('Error actualizando nombre:', error);
    return res.status(500).json({ error: 'No fue posible actualizar el nombre' });
  }
};

module.exports = updateUserName;
