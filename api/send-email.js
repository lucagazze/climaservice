// Vercel Serverless Function — Envío de emails via Hostinger SMTP (cuenta Algoritmia)
// Variables de entorno a configurar en Vercel:
//   EMAIL_USER  →  info@algoritmiadesarrollos.com.ar
//   EMAIL_PASS  →  (ver credenciales Algoritmia SMTP en memoria)
//   EMAIL_TO    →  destinatario del cliente (confirmar antes de deploy)

const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { nombre, empresa, telefono, email, servicio, mensaje } = req.body;

    // Validación básica
    if (!nombre || !email) {
      return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
    }

    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Email inválido' });
    }

    // Configurar transporter SMTP Hostinger
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || 'info@algoritmiadesarrollos.com.ar',
        pass: process.env.EMAIL_PASS || 'Qpzm123Qpzm-',
      },
    });

    const mailOptions = {
      from: `"Contacto Clima Service" <${process.env.EMAIL_USER || 'info@algoritmiadesarrollos.com.ar'}>`,
      to: 'Climaservice20@gmail.com, lucagazze1@gmail.com', // Destinatarios
      replyTo: email,
      subject: `🔔 NUEVO CONTACTO WEB: ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden;">

          <!-- Header -->
          <div style="background: #0F2D5E; padding: 24px 28px;">
            <h2 style="margin: 0; color: #fff; font-size: 20px; font-weight: 700;">Nuevo contacto desde la web</h2>
            <p style="margin: 4px 0 0; color: rgba(255,255,255,0.6); font-size: 13px;">Clima Service · climatización profesional</p>
          </div>

          <!-- Datos -->
          <div style="padding: 28px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="background: #F8FAFC;">
                <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-weight: 700; color: #0F172A; width: 40%;">Nombre</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #374151;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-weight: 700; color: #0F172A;">Empresa</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #374151;">${empresa || 'No especificada'}</td>
              </tr>
              <tr style="background: #F8FAFC;">
                <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-weight: 700; color: #0F172A;">Teléfono</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #374151;">${telefono || 'No especificado'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-weight: 700; color: #0F172A;">Email</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #374151;"><a href="mailto:${email}" style="color: #2563EB;">${email}</a></td>
              </tr>
              <tr style="background: #F8FAFC;">
                <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-weight: 700; color: #0F172A;">Servicio</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #374151;">${servicio || 'No especificado'}</td>
              </tr>
            </table>

            ${mensaje ? `
            <div style="margin-top: 20px;">
              <p style="font-weight: 700; color: #0F172A; font-size: 14px; margin-bottom: 8px;">Mensaje:</p>
              <p style="background: #F8FAFC; padding: 14px 16px; border-radius: 8px; color: #374151; font-size: 14px; line-height: 1.6; margin: 0; border: 1px solid #E2E8F0;">${mensaje}</p>
            </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="background: #F8FAFC; padding: 16px 28px; border-top: 1px solid #E2E8F0;">
            <p style="margin: 0; font-size: 12px; color: #94A3B8;">Este mensaje fue enviado desde el formulario de contacto de climaservice.com.ar</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Email enviado correctamente' });

  } catch (error) {
    console.error('EMAIL ERROR:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor'
    });
  }
};
