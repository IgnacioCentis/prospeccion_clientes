# 🧠 Prospector AI - Automatización de Prospección para eCommerce

Proyecto full stack que permite automatizar la búsqueda de leads en sitios de ecommerce, obtener datos de contacto, generar emails personalizados con IA y enviarlos con confirmación manual.

---

## 🚀 Funcionalidades

- 📥 Carga de leads (sitios ecommerce) desde archivos `.txt` o `.xlsx`.
- 🔍 Scraping automatizado para obtener **email** y **teléfono** desde los sitios cargados.
- ✍️ Redacción automática de emails personalizados usando **OpenAI GPT-4**.
- ✅ Aprobación previa al envío.
- ✉️ Envío de emails directamente desde el sistema (usando Nodemailer).
- 👁 Visualización y validación de los datos desde el **dashboard**.
- 🔐 Autenticación con login.

---

## 🛠️ Stack Tecnológico

### 🔹 Frontend
- React + Vite
- TailwindCSS
- Axios
- Lucide React Icons

### 🔹 Backend
- Node.js + Express
- MySQL (DB)
- Multer (uploads)
- Cheerio + Axios (scraping tradicional)
- OpenAI SDK
- Nodemailer

---

## ⚙️ Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/tuusuario/prospector-ai.git
cd prospector-ai
```

### 2. Configurar el Backend

```bash
cd backend
cp .env.example .env
# Editar DB y OPENAI_API_KEY en .env
npm install
```

#### Variables requeridas en `.env`:
```
DB_HOST=localhost
DB_USER=usuario
DB_PASS=contraseña
DB_NAME=prospector_db
OPENAI_API_KEY=sk-xxxxx
EMAIL_HOST=smtp.tu-servidor.com
EMAIL_PORT=587
EMAIL_USER=tuemail@dominio.com
EMAIL_PASS=clave123
```

### 3. Configurar la Base de Datos

Importá el SQL incluido:

```bash
mysql -u tu_usuario -p prospector_db < schema.sql
```

### 4. Ejecutar el backend

```bash
npm run dev
```

---

### 5. Configurar el Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173)

---

## 🔑 Primer usuario

Como no hay frontend para registro, creá uno con cURL:

```bash
curl -X POST http://localhost:3001/auth/register   -H "Content-Type: application/json"   -d '{"username":"admin","password":"admin123"}'
```


---

## 📌 Estado actual

✅ Funcional MVP  
✅ Login / Logout  
✅ Dashboard Leads  
✅ Scrape + Generar con OpenAI  
✅ Envío email manual  
⬜ Envío WhatsApp (opcional futuro)

