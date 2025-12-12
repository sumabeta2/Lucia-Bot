require('dotenv').config();
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

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

// ==================== BOTÓN DEMO SECRETO ====================
const MI_NUMERO = '51999123456@c.us';   // ← TU NÚMERO CON @c.us
const CODIGO_DEMO = '561393';           // ← cambia si quieres otro código

client.on('message', async msg => {
  const from = msg.from;
  const texto = msg.body.trim();

  if (texto.toLowerCase() === 'demo' && from === MI_NUMERO) {
    return msg.reply('Ingresa el código de acceso:');
  }
  if (texto === CODIGO_DEMO && from === MI_NUMERO) {
    return msg.reply('✅ *MODO DEMO ACTIVADO*\n\nAhora puedes probar el flujo de citas médicas.\nEscribe *cita* para empezar la demo.');
  }

  // Tus respuestas normales (puedes ir ampliándolas después)
  if (texto.toLowerCase() === 'hola' || texto === '') && msg.reply('¡Hola! Soy Lucía, asistente virtual de Ramón Delgado.');
});

// ==================== PÁGINA EXACTAMENTE COMO TÚ QUIERES ====================
app.get('/', (req, res) => {
  const phone = process.env.PHONE_NUMBER || '51999123456';
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lucía - Ramón Delgado</title>
  <style>
    body {font-family: Arial, sans-serif; background: linear-gradient(to bottom, #a0d8ef, #e0f6ff); margin:0; padding:20px; text-align:center;}
    h1 {color: #005a87;}
    h3 {color: #00334e;}
    .btn {display:block; width:85%; max-width:400px; margin:18px auto; padding:20px; background:#00897b; color:white; text-decoration:none; border-radius:12px; font-size:20px; font-weight:bold; box-shadow:0 4px 10px rgba(0,0,0,0.2);}
    .demo {background:#00bfa5;}
  </style>
</head>
<body>
  <h1>Hola, soy Lucía</h1>
  <h3>Asistente virtual de Ramón Delgado</h3>
  <h3>¿Qué te interesa?</h3>

  <a href="https://wa.me/${phone}?text=Taller%20Primeros%20Auxilios" class="btn">Taller Primeros Auxilios</a>
  <a href="https://wa.me/${phone}?text=Libros" class="btn">Libros</a>
  <a href="https://wa.me/${phone}?text=Ya%20hice%20el%20pago" class="btn">Ya hice el pago</a>
  class="btn">Hablar con Ramón Delgado</a>
  <a href="https://wa.me/${phone}?text=demo" class="btn demo">DEMO</a>

  <p><small>Live en Render ✅</small></p>
</body>
</html>
  `);
});

// ==================== INICIAR ====================
client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot corriendo → https://lucia-bot.onrender.com`));
