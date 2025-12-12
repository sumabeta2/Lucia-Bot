require('dotenv').config();
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox'] }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log('Escanea este QR con tu celular');
});

client.on('ready', () => {
  console.log('¡Bot conectado y listo!');
});

client.on('message', async msg => {
  const texto = msg.body.toLowerCase().trim();
  const from = msg.from;

  // ←←← TU NÚMERO SECRETO (cambia esto)
  const MI_NUMERO = '51931479063@c.us'; // ← tu número real con @c.us
  const CODIGO = '561393'; // ← cambia el código si quieres

  if (texto === 'demo' && from === MI_NUMERO) {
    return msg.reply('Ingresa el código de 6 dígitos:');
  }

  if (texto === CODIGO && from === MI_NUMERO) {
    return msg.reply('✅ *MODO DEMO ACTIVADO*\n\nEscribe *cita* para probar el flujo de citas médicas.');
  }

  // Aquí irán más adelante los flujos normales (talleres, libros, etc.)
  if (texto === 'hola') {
    msg.reply('¡Hola! Soy Lucía, tu asistente. Pronto tendrás los botones.');
  }
});

client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
