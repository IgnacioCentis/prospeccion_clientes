require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const db = require('./config/db'); 
 
const authController = require('./controllers/auth');
const leadsController = require('./controllers/leads');
const scrapeController = require('./controllers/scrape');
const generateController = require('./controllers/generate');
const auth = require('./middleware/auth');
const sendController = require('./controllers/send');

const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(cors());
app.use(express.json());

// Auth
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

// Leads
//app.post('/upload', auth, upload.single('file'), leadsController.upload);
// index.js (o donde tengas definido /upload)
const fs = require('fs');
const path = require('path');
 
// … tu pool, multer, etc …

app.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    let urls = [];

    if (ext === '.txt') {
      // leemos txt y separamos por líneas
      const txt = fs.readFileSync(req.file.path, 'utf8');
      urls = txt
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);
    } else {
      // asumimos Excel
      const workbook = xlsx.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      urls = xlsx.utils
        .sheet_to_json(sheet, { header: 1 })
        .flat()
        .filter(Boolean);
    }

    let inserted = 0;
    for (const url of urls) {
      const [result] = await db.query(
        'INSERT IGNORE INTO leads (url) VALUES (?)',
        [url]
      );
      if (result.affectedRows) inserted++;
    }

    return res.json({ success: true, count: inserted });
  } catch (err) {
    console.error('Upload error:', err);
    return res
      .status(500)
      .json({ success: false, error: err.message });
  }
});

app.get('/leads', auth, leadsController.getLeads);
app.post('/leads/:id/approve', auth, leadsController.approveLead);
app.post('/leads/:id/sent', auth, leadsController.markSent);

// Scraping and generation
app.post('/scrape', auth, scrapeController.scrapeContacts);
app.post('/generate', auth, generateController.generateEmails);

//envio de email  nodemailer
app.post('/leads/:id/send', auth, sendController.sendEmail);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));