
const pool = require('../config/db');
const { OpenAI } = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.chatWithAssistant = async (req, res) => {
  const { message } = req.body;
  try {
    // Cargar algunos leads
    const [leads] = await pool.query('SELECT * FROM leads LIMIT 20');
    const context = leads.map(l => `• ${l.url} (${l.email || 'sin email'}, ${l.telefono || 'sin tel'})`).join('\n');

    // Buscar lead mencionado por dominio parcial (más flexible)
    let matchedLead = null;
    for (const lead of leads) {
      try {
        const domain = new URL(lead.url).hostname.replace('www.', '');
        if (message.toLowerCase().includes(domain)) {
          matchedLead = lead;
          break;
        }
      } catch (_) {}
    }

    let extraData = '';

    if (matchedLead) {
      try {
        const { data: html } = await axios.get(matchedLead.url, { timeout: 8000 });
        const $ = cheerio.load(html);
        const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
        extraData = bodyText.slice(0, 3000); // límite de tokens
      } catch (e) {
        extraData = `⚠️ No se pudo hacer scraping de ${matchedLead.url}: ${e.message}`;
      }
    }

    const prompt = `
Sos un asistente experto en prospección de ecommerce. Estos son los leads actuales:\n${context}

${extraData ? `\nTexto del sitio ${matchedLead?.url} (extraído vía scraping):\n${extraData}` : ''}

El usuario pregunta: "${message}"
Respondé de forma profesional y útil.
`.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    const reply = completion.choices[0].message.content;
    res.json({ success: true, reply });
  } catch (err) {
    console.error('❌ Assistant error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
