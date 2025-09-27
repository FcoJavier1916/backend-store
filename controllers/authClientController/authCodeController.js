const AuthCode = require('../../models/authClientModel');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // tu API Key de SendGrid

const sendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Se requiere email' });
    }

    // Generar código de 6 dígitos
    const codeToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Fecha de expiración: 15 minutos
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Borrar códigos previos del mismo email
    await AuthCode.deleteMany({ email });

    // Guardar en base de datos
    await AuthCode.create({ email, code: codeToken, expiresAt });

    // Preparar correo
    const msg = {
      to: email,
      from: 'shop.sitie@circulo-escena.com', // tu correo corporativo
      subject: '🔑 Tu código de acceso - Circulo Escena Mx. Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #2c3e50; text-align: center;">Circulo-Escena Mx.</h2>
          <p style="font-size: 16px; color: #333;">Hola,</p>
          <p style="font-size: 16px; color: #333;">
            Tu código de acceso es:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #2b2929ff; padding: 10px 20px; border: 2px dashed #e74c3c; border-radius: 6px;">
              ${codeToken}
            </span>
          </div>
          <p style="font-size: 14px; color: #555;">
            Este código expira en <b>15 minutos</b>.  
            Si no solicitaste este código, puedes ignorar este mensaje.
          </p>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
            © ${new Date().getFullYear()} Circulo-Escena Mx. - Todos los derechos reservados
          </p>
        </div>
      `
    };

    // Enviar correo usando SendGrid
    await sgMail.send(msg);

    res.json({ message: 'Código enviado al correo' });
  } catch (err) {
    console.error('Error en sendCode:', err);
    res.status(500).json({ message: 'Error al enviar el código', error: err.message });
  }
};

module.exports = sendCode;
