const pool = require('../config/db');
const xlsx = require('xlsx');

async function upload(req, res) {
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const urls = xlsx.utils.sheet_to_json(sheet, { header: 1 }).flat().filter(Boolean);
  for (const url of urls) {
    await pool.query('INSERT IGNORE INTO leads (url) VALUES (?)', [url]);
  }
  res.json({ message: `${urls.length} leads loaded` });
}

async function getLeads(req, res) {
  const [rows] = await pool.query('SELECT * FROM leads');
  res.json(rows);
}

async function approveLead(req, res) {
  const { id } = req.params;
  await pool.query("UPDATE leads SET estado_email='aprobado' WHERE id = ?", [id]);
  res.json({ message: 'Lead approved' });
}

async function markSent(req, res) {
  const { id } = req.params;
  await pool.query("UPDATE leads SET estado_email='enviado' WHERE id = ?", [id]);
  res.json({ message: 'Lead marked as sent' });
}

module.exports = { upload, getLeads, approveLead, markSent };