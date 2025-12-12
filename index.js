require('dotenv').config();
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());
app.use(express.static('public')); // por si tienes imágenes o html

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

// ==================== QR Y ESTADO ====================
client.on('qr', qr => {
  console.log('Escanea este QR:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('¡Lucía Bot conectado y listo!');
});

client.on('authenticated', () => {
  console.log('Autenticado correctamente');
});

client.on('auth_failure', msg => {
  console.error('Error de autenticación:', msg);
});

// ==================== BOTONES SECRETO DEMO ====================
const MI_NUMERO = '51999123456@c.us';     // ← TU NÚMERO CON @c.us
const CODIGO_DEMO = '561393';             // ← CAMBIA ESTO SI QUIERES

client.on('message', async msg => {
  const from = msg.from;
  const texto = msg.body.trim().toLowerCase();

  // MODO DEMO (solo tú puedes activarlo)
  if (texto === 'demo' && from === MI_NUMERO) {
    return msg.reply('Ingresa el código de acceso de 6 dígitos:');
  }
  if (texto === CODIGO_DEMO && from === MI_NUMERO) {
    return msg.reply('✅ *MODO DEMO ACTIVADO*\n\nEscribe *cita* para probar el flujo de citas médicas.');
  }

  // Aquí irán tus flujos normales más adelante
  if (texto === 'hola') {
    msg.reply('¡Hola! Soy Lucía, tu asistente de primeros auxilios.\nPronto tendrás los botones de Libros, Taller y Pago.');
  }
});

// ==================== PÁGINA CON BOTONES EN EL ENLACE ====================
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Lucía Bot</title><meta charset="utf-8"></head>
      <body style="font-family:Arial;text-align:center;padding:50px;background:#f0f8ff;">
        <h1>Lucía Bot</h1>
        <h3>Envíame un mensaje al número del bot:</h3>
        <a href="https://wa.me/${process.env.PHONE_NUMBER || '51999123456'}" style="font-size:40px;">Abrir WhatsApp</a>
        <hr>
        <p><strong>Prueba rápida (escribe en WhatsApp):</strong></p>
        <button style="font-size:20px;padding:15px;margin:10px;" onclick="alert('Escribe LIBROS')">LIBROS</button>
        <button style="font-size:20px;padding:15px;margin:10px;" onclick="alert('Escribe TALLER')">TALLER</button>
        <button style="font-size:20px;padding:15px;margin:10px;" onclick="alert('Escribe PAGO')">YA PAGUÉ</button>
        <hr>
        <p>Live en Render ✅</p>
      </body>
    </html>
  `);
});

// ==================== INICIAR ====================
client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Enlace: https://lucia-bot.onrender.com`);
});
