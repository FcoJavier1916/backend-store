const sgMail = require('@sendgrid/mail');
const { dateForm } = require("../../utils/dateForm..js");
const { getRandomAccount } = require("../../utils/getRandomAccount.js");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOrderFollowUpEmail = async (req, res) => {
  const { numero, banco } = getRandomAccount();

  try {
    const { email, orden, tickets } = req.body;

    if (!email || !orden || !tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const ticketsHtml = tickets.map(ticket => {
      let fechaNormalizada;
      try {
        fechaNormalizada = dateForm(ticket.fecha);
      } catch {
        fechaNormalizada = ticket.fecha;
      }

      return `
        <div style="display:flex; justify-content:center; gap:16px; margin-top:16px; flex-wrap:wrap;width:100%">
          <img 
            src="${ticket.url}" 
            alt="${ticket.titulo}" 
            style="
              width:50%;
              max-width:300px;
              height:auto;
              border-radius:8px;
              display:block;
              margin:auto;
            " 
          />
          <ul style="list-style:none; text-align:center; font-size:16px; line-height:1.6; padding:0; margin:0;width:50%">
            <li style="font-size:1.2rem; text-transform:uppercase;">${ticket.titulo}</li>
            <li style="text-transform:uppercase;">${ticket.tour}</li>                           
            <li style="text-transform:uppercase;">${fechaNormalizada}</li>
            <li style="text-transform:uppercase;">${ticket.recinto}</li>
            <li style="text-transform:uppercase;"><strong>Boleto(s):</strong> X ${ticket.numBoletos}</li>
          </ul>
        </div>
      `;
    }).join('');

    const totalAmount = tickets.reduce((sum, t) => sum + t.total, 0);

    const mailHtml = `
      <div style="
        font-family: Arial, Helvetica, sans-serif;
        max-width: 650px;
        margin: 40px auto;
        padding: 24px;
        color: #333;
        background-color: #f9f9f9;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        text-align: center;
      ">
        <img 
          src="${process.env.URL_LOGO}" 
          alt="Logo Círculo Escena" 
          style="width:120px; margin-bottom:24px; border-radius:8px; display:block; margin-left:auto; opacity:0.5;" 
        />
        <h2 style="color: #000000ff; font-size: 28px; margin-bottom: 16px;">Pago con tarjeta rechazado</h2>
        <p style="font-size:16px;">
          Hola, tu pago con tarjeta fue rechazado. Para concluir tu compra con NUMERO DE PREORDEN <b>${orden}</b>,
          realiza tu pago en cualquier tienda de conveniencia OXXO.
        </p>
        <h3 style="font-size:20px; margin-top:24px;">Detalles del evento</h3>
        ${ticketsHtml}
        <p style="margin-top:2rem; font-size:2rem;"><b>Total a pagar:</b> <strong>$${totalAmount}</strong></p>
        <h3 style="font-size:20px; margin-top:24px;">Instrucciones de pago</h3>
        <div style="
          border:1px solid #ccc;
          border-radius:8px;
          padding:16px;
          margin:16px 0;
          background-color:#fff;
          text-align:center;
          word-break:break-word;
          overflow-wrap:break-word;
        ">
          <p style="margin:4px 0;">Depósito a cuenta:</p>
          <p style="margin:4px 0; font-size:2rem;"><b>${numero}</b></p>
          <p style="margin:4px 0;">${banco}</p>
        </div>
        <p style="font-size:16px;">
          Una vez realizado el pago, compártenos tu comprobante por este medio o a nuestro canal de WhatsApp:<br />
          <a href="${process.env.WHATSAPP_LINK}" target="_blank">Asistencia por WhatsApp</a>
        </p>
        <p style="font-size:16px;">
          Una vez validado tu pago, recibirás un correo con todos los detalles de tu orden.<br />
          También podrás validar el estatus y progreso de tus accesos o boletos en:<br />
          <a href="https://circulo-escena.com/profile" target="_blank">circulo-escena.com/profile</a>
        </p>
        <p style="
          font-size:12px;
          color:#888;
          margin-top:32px;
          line-height:1.4;
          text-align:justify;
        ">
          Aviso de privacidad: CIRCULO ESCENA MX. &copy;, es responsable del tratamiento y protección de tus datos personales.
          La información recabada se utilizará únicamente para la gestión de tus órdenes, atención a clientes y envío de información relevante sobre servicios y eventos.
          Nuestro aviso de privacidad completo está disponible en
          <a href="https://circulo-escena.com" target="_blank">circulo-escena.com</a>.
        </p>
        <span style="display:block; margin-top:16px; font-size:12px; color:#888;">
          CIRCULO ESCENA MX. &copy; ${new Date().getFullYear()} | Todos los derechos reservados.
        </span>
      </div>
    `;

    await sgMail.send({
      from: 'shop.sitie@circulo-escena.com',
      to: email,
      subject: `Seguimiento orden de compra ${orden}`,
      html: mailHtml,
      text: `Tu orden ${orden} - Pago rechazado. Detalles y referencia en el correo HTML.`
    });

    return res.json({ message: "Correo de seguimiento enviado" });
  } catch (error) {
    console.error("Error enviando correo de seguimiento:", error);
    return res.status(500).json({ error: "No fue posible enviar el correo" });
  }
};

module.exports = sendOrderFollowUpEmail;
