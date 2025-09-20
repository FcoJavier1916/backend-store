const VerifyCode = require('../../models/authClientModel');
const generateToken = require('../../utils/generateToken'); // ajusta la ruta

const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) return res.status(400).json({ message: 'Email y código son requeridos' });

  const auth = await VerifyCode.findOne({ email, code, used: false });

  if (!auth) return res.status(400).json({ message: 'Código inválido' });
  if (auth.expiresAt < new Date()) return res.status(400).json({ message: 'Código expirado' });

  // Marcar como usado
  auth.used = true;
  await auth.save();

  // 🔹 Generar token usando tu función
  const token = generateToken({ email: auth.email });

  // Enviar token al frontend
  res.json({ message: 'Código válido', token });
};

module.exports = verifyCode;
