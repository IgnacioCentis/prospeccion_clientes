// controllers/generate.js
const pool = require('../config/db');
const { OpenAI } = require('openai');
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateEmails(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM leads WHERE email IS NOT NULL AND email_redactado IS NULL LIMIT 5"
    );
    let generated = 0;
    const errors = [];

    for (const lead of rows) {
      try {
        const prompt = `Redactá un email profesional y breve para contactar a la tienda ${lead.url}, ofreciendo un demo gratuito de nuestra solución de automatización para ecommerce.`;
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }]
        });
        const texto = completion.choices[0].message.content;

        await pool.query(
          'UPDATE leads SET email_redactado = ? WHERE id = ?',
          [texto, lead.id]
        );
        generated++;
      } catch (err) {
        errors.push({ id: lead.id, url: lead.url, error: err.message });
      }
    }

    return res.json({ success: true, generated, errors });
  } catch (err) {
    console.error('❌ Error en /generate:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { generateEmails };
