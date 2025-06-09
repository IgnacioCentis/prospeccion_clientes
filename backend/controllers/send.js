// controllers/send.js
const pool = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(req, res) {
  const { id } = req.params;
  const [rows] = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);
  if (!rows.length) {
    return res.status(404).json({ success: false, error: 'Lead no encontrado' });
  }

  const lead = rows[0];
  if (!lead.email) {
    return res.status(400).json({ success: false, error: 'Lead no tiene email' });
  }
  if (!lead.email_redactado) {
    return res.status(400).json({ success: false, error: 'No hay contenido de email generado' });
  }

  // Configurá el transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,            // ej. smtp.hostinger.com
    port: parseInt(process.env.SMTP_PORT),  // 587
    secure: false,                           // false = STARTTLS en el mismo puerto
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    requireTLS: true,                        // fuerza STARTTLS
    tls: {
      // Permite renegociaciones, a veces necesarias en servidores restrictivos
      rejectUnauthorized: false,
      ciphers: 'TLSv1.2'
    },
    logger: true,          // habilita logs de conexión en la consola
    debug: true            // imprime detalles del handshake
  });

  try {
    // Enviá el email
    await transporter.sendMail({
      from: `"Mi Empresa" <${process.env.SMTP_USER}>`,
      to: lead.email,
      subject: 'Presentación de nuestra solución ecommerce',
      text: lead.email_redactado,
    });

    // Marcá como enviado
    await pool.query(
      "UPDATE leads SET estado_email = 'enviado' WHERE id = ?",
      [id]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('Error enviando email:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { sendEmail };
