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

    // Generar el HTML de los tickets iterando sobre todos
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

    const mailHtml = `...`; // tu HTML completo igual, sin tocar nada

    await sgMail.send({
      to: email,
      from: 'shop.sitie@circulo-escena.com',
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
