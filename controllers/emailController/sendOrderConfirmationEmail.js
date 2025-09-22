const nodemailer = require("nodemailer");
const { dateForm } = require("../../utils/dateForm..js");

const sendOrderApprovedEmail = async (req, res) => {
  try {
    const { email, orden, tickets, deliveryInfo } = req.body;

    if (!email || !orden || !tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: { rejectUnauthorized: false }
    });

    // Normalizar boletos
    const ticketsHtml = tickets.map(ticket => {
      let fechaNormalizada;
      try {
        fechaNormalizada = dateForm(ticket.date || ticket.fecha);
      } catch {
        fechaNormalizada = ticket.date || ticket.fecha;
      }

      return `
       <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:16px;">
  <!-- Imagen del evento -->
  <img 
    src="${ticket.imageUrl || ticket.url}" 
    alt="${ticket.title || ticket.titulo}" 
    style="width:50%; max-width:300px; height:auto; border-radius:8px; object-fit:contain;" 
  />

  <!-- Información del evento -->
  <ul style="list-style:none; padding:0; margin:0; width:50%; font-size:14px; line-height:1.6; text-align:left;">
  <li style="font-size:1rem; text-transform:uppercase;">
    <strong>${ticket.title || ticket.titulo}</strong>
  </li>
  ${ticket.tour ? `<li style="text-transform:uppercase;">Tour: ${ticket.tour}</li>` : ""}
  <li style="text-transform:uppercase;">${fechaNormalizada}</li>
  <li style="text-transform:uppercase;">${ticket.venue || ticket.recinto}, ${ticket.city}</li>
  <li style="text-transform:uppercase;"><strong>Zona:</strong> ${ticket.zone || ticket.zona || "No especificada"}</li>
  <li style="text-transform:uppercase;"><strong>Precio:</strong> $${Number(ticket.price || 0).toFixed(2)}</li>
  <li style="text-transform:uppercase;"><strong>Boleto(s):</strong> X${ticket.quantity || 0}</li>
  <li style="text-transform:uppercase;">
    <strong>Subtotal:</strong> $${(Number(ticket.quantity) * Number(ticket.price || 0)).toFixed(2)}
  </li>
  <li style="text-transform:uppercase; font-size:13px; color:#555;">
    Evento operado por <strong>${ticket.ticketOffice || "Boletera oficial"}</strong>
  </li>
</ul>

</div>

      `;
    }).join('');

    // Calcular total
    const totalAmount = tickets.reduce((sum, t) => sum + (t.total || (t.price * t.quantity)), 0);

    const fechaActual = new Date().toLocaleDateString();

    const mailHtml = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width:650px; margin:40px auto; padding:24px; color:#333; background-color:#f9f9f9; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Encabezado fila 1 -->
        <div style="display:flex; width:100%; border-bottom:1px solid #ccc; padding-bottom:8px; margin-bottom:8px;">
  <div style="width:33%; text-align:left; font-size:18px; font-weight:bold;">
    CIRCULO ESCENA ® SAPI de CV
  </div>
  <div style="width:33%; text-align:center; font-size:18px;">
    Orden de Compra
  </div>
  <div style="width:33%; text-align:right; font-size:14px; font-weight:bold;">
    #${orden}
  </div>
</div>
        <div style="display:flex; width:100%; margin-bottom:16px;">
  <div style="width:50%; text-align:left; color:green; font-weight:bold; font-size:15px;">
    Compra Aprobada
  </div>
  <div style="width:50%; text-align:right; font-size:14px;">
    ${fechaActual}
  </div>
</div>

        <!-- Datos cliente + logotipo -->
        <div style="display:flex; width:100%; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:16px;">
  <!-- Cliente -->
  <div style="width:50%; font-size:14px; line-height:1.4; text-align:left;">
    <h3 style="margin:0 0 8px 0; font-size:15px;">Datos del Cliente</h3>
    <p style="margin:0;">
      Correo: ${deliveryInfo?.email || email}<br/>
      ${deliveryInfo?.phone ? `Teléfono: ${deliveryInfo.phone}` : ""}
    </p>
  </div>
  <!-- Logo -->
  <div style="width:50%; text-align:right;">
    <img src="${process.env.URL_LOGO}" 
         alt="Logo" 
         style="width:120px; max-width:120px; opacity:0.5; border:1px solid #ccc; padding:4px; border-radius:4px;">
  </div>
</div>

        <hr style="border:0.5px solid #ccc; margin:16px 0;"/>

        <!-- Boletos -->
        <h3 style="margin-top:0;">Detalles de Compra.</h3>
        ${ticketsHtml}

        <p style="text-align:right; font-size:1.1rem; margin-top:16px;"><strong>Total Global: $${totalAmount}</strong></p>

        <!-- Estatus envío -->
       <h3 style="margin-top:24px;">Detalles de entrega:</h3>    

<p style="font-size:14px; margin-top:4px;">
  ${
    deliveryInfo?.type === "domicilio"
      ? `Método de entrega: <strong>Domicilio</strong><br>
         Tus boletos se están preparando para ser enviados a la siguiente dirección:<br>
         ${deliveryInfo?.street || ""} ${deliveryInfo?.exterior || ""}, ${deliveryInfo?.colony || ""}, 
         ${deliveryInfo?.city || ""}, ${deliveryInfo?.state || ""}, C.P. ${deliveryInfo?.postalCode || ""}.<br>
         En breve recibirás un correo con tu número de guía o número de rastreo.`
      : `Tipo de entrega: <strong>Digital</strong><br>
         Tus boletos serán enviados por medio de las plataformas oficiales de la boletera encargada del evento, 
         al correo: <strong>${deliveryInfo?.email || "correo no disponible"}</strong>.<br>
         En breve recibirás un correo de confirmación.`
  }
</p>


        <!-- Aviso -->
        <p style="font-size:12px; color:#888; margin-top:32px; line-height:1.4; text-align:justify;">
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

    await transporter.sendMail({
      from: `"CIRCULO ESCENA Mx." <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Orden aprobada - ${orden}`,
      html: mailHtml,
      text: `Tu orden ${orden} ha sido aprobada. Detalles completos en el correo HTML.`
    });

    return res.json({ message: "Correo de orden aprobada enviado" });
  } catch (error) {
    console.error("Error enviando correo de orden aprobada:", error);
    return res.status(500).json({ error: "No fue posible enviar el correo" });
  }
};

module.exports = sendOrderApprovedEmail;
