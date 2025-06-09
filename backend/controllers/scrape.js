// controllers/scrape.js
const pool = require('../config/db');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeContacts(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM leads WHERE (email IS NULL OR telefono IS NULL) LIMIT 10'
    );
    let processed = 0;
    const errors = [];

    for (const lead of rows) {
      try {
        const { data: html } = await axios.get(lead.url, { timeout: 8000 });
        const $ = cheerio.load(html);
        const email = $('a[href^="mailto:"]').first().attr('href')?.replace('mailto:', '') || '';
        //const phoneMatch = html.match(/\+?\d[\d\s\-\(\)]+/);
        //const telefono = phoneMatch ? phoneMatch[0] : '';

         // 1) Intentar extraer de un <a href="tel:...">
         let telefono = $('a[href^="tel:"]').first().attr('href')?.replace('tel:', '') || '';
        
         // 2) Si no encuentra, buscar en todo el texto de la página con un regex más amplio
         if (!telefono) {
           const texto = $('body').text();
           // Captura algo como "+54 223 1234567", paréntesis, guiones, espacios
           const match = texto.match(/(\+\d{1,3}[\s\-]?\(?\d+\)?[\s\d\-]+)/);
           telefono = match ? match[1].trim() : '';
         }

        await pool.query(
          'UPDATE leads SET email = ?, telefono = ? WHERE id = ?',
          [email, telefono, lead.id]
        );
        processed++;
      } catch (err) {
        errors.push({ id: lead.id, url: lead.url, error: err.message });
      }
    }

    return res.json({ success: true, processed, errors });
  } catch (err) {
    console.error('❌ Error en /scrape:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { scrapeContacts };
