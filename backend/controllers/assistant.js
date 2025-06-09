
const pool = require('../config/db');
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.chatWithAssistant = async (req, res) => {
  const { message } = req.body;
  try {
    const [leads] = await pool.query('SELECT * FROM leads LIMIT 20');
    const context = leads.map(l => `• ${l.url} (${l.email || 'sin email'}, ${l.telefono || 'sin tel'})`).join('\n');

    const prompt = `
              Sos un asistente experto en prospección de ecommerce. Estos son los leads actuales:\n${context}
              Usuario: ${message}
              Asistente:
    `.trim();
console.log('Esta es la prompt: ',prompt);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.choices[0].message.content;
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
