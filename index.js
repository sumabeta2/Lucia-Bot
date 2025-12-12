require('dotenv').config();
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

const userFlows = {};

const MI_NUMERO = '51999123456@c.us'; // ← TU número con @c.us
const CODIGO_DEMO = '561393'; // ← Cambia cuando quieras

client.on('qr', qr => {
    console.log('Escanea el QR:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡Lucía Bot listo y conectado!');
});

client.on('message', async msg => {
    const from = msg.from;
    const texto = msg.body.trim();
    const textoLower = texto.toLowerCase();

    // ==================== TU MODO DEMO SECRETO (INTACTO) ====================
    if (textoLower === 'demo' && from === MI_NUMERO) {
        return msg.reply('Ingresa el código de 6 dígitos:');
    }
    if (texto === CODIGO_DEMO && from === MI_NUMERO) {
        return msg.reply('✅ MODO DEMO ACTIVADO\n\nEscribe *cita* para probar el flujo de citas médicas.');
    }

    // ==================== FLUJO TALLER (EXACTAMENTE COMO ME LO DIJISTE) ====================
    if (!userFlows[from]) {
        userFlows[from] = { step: null };
    }
    const flow = userFlows[from];

    // Inicio del flujo (cuando presiona TALLER)
    if (textoLower === 'taller' || textoLower === 'taller primeros auxilios') {
        flow.step = 'pais';
        await msg.reply('Muy bien de acuerdo, para continuar, por favor indícame ¿en qué país te encuentras?\n\nResponde con uno de estos:\n• Perú\n• México\n• Colombia\n• Venezuela\n• Otros');
        return;
    }

    if (flow.step === 'pais') {
        if (textoLower.includes('méxico') || textoLower.includes('mexico')) {
            flow.step = 'interes';
            await msg.reply(
`Muy bien le explicó, el taller será en vivo, a través de la plataforma Google Meet, al inscribirse, tendrá, los siguientes beneficios:\n` +
`Certificado de participación (constancia) con validez internacional, tendrá material de apoyo en PDF y acceso a la clase grabada de por vida.\n\n` +
`Todos estos beneficios, por una inversión de $249 pesos mexicanos.\n\n` +
`Tan solo dígame, ¿Le interesa?\n\nResponde *SÍ* o *NO*`
            );
        } else {
            await msg.reply('Gracias por su interés, estamos a su orden si cambia de opinión.');
            delete userFlows[from];
        }
        return;
    }

    if (flow.step === 'interes') {
        if (textoLower.includes('sí') || textoLower.includes('si')) {
            flow.step = 'metodo_pago';
            await msg.reply(
`Muy bien en México tenemos dos métodos de pago, ¿cuál prefiere?\n\n` +
`Responde con:\n• OXXO\n• TRANSFERENCIA`
            );
        } else if (textoLower.includes('no')) {
            await msg.reply('Gracias por su interés, estamos a su orden si cambia de opinión.');
            delete userFlows[from];
        }
        return;
    }

    if (flow.step === 'metodo_pago') {
        if (textoLower.includes('oxxo')) {
            await msg.reply(
`*OXXO, por favor:*\n` +
`4741742975530315\n` +
`Luis Ibarra \n` +
`Banregio\n` +
`Monto: $249 pesos mexicanos\n\n` +
`**Nota1, por favor hacer la operación antes de las 5:30pm, hora mexicana. Después de esa hora, no será reconocida la transacción. Gracias.**\n` +
`**Nota2: Una vez que haga la transacción, debe ubicar en el menú principal el botón "Ya hice el pago" para regidirlo a una persona, que le tomara su caso, para finalizar su inscripción.**`
            );
            delete userFlows[from];
        } else if (textoLower.includes('transferencia')) {
            await msg.reply(
`*Solo Transferencia bancaria*:\n` +
`721180100038218691\n` +
`Jhonatan Hernández \n` +
`Banco albo\n` +
`Monto: $249 pesos mexicanos\n\n` +
`**Nota1, por favor hacer la operación antes de las 5:30pm, hora mexicana. Después de esa hora, no será reconocida la transacción.**\n` +
`**Nota2: En la transacción, debe verse la clave de rastreo (OBLIGATORIO)**\n` +
`**Nota3: Una vez que haga la transacción, debe ubicar en el menú principal el botón "Ya hice el pago" para regidirlo a una persona, que le tomara su caso, para finalizar su inscripción.**`
            );
            delete userFlows[from];
        }
        return;
    }

    // Respuesta básica
    msg.reply('¡Hola! Soy Lucía. Los flujos están en construcción. Pronto estarán listos.');
});

// ==================== PÁGINA SIN NÚMERO Y CON DEMO ====================
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lucía - Ramón Delgado</title>
  <style>
    body {font-family:Arial;background:linear-gradient(#a0d8ef,#e0f6ff);margin:0;padding:20px;text-align:center;}
    h1 {color:#005a87;}
    h3 {color:#00334e;}
    .btn {display:block;width:85%;max-width:400px;margin:18px auto;padding:20px;background:#00897b;color:white;border-radius:12px;font-size:20px;font-weight:bold;}
    .demo {background:#00bfa5;}
    #demo-box {display:none;margin:30px auto;width:85%;background:white;padding:20px;border-radius:12px;box-shadow:0 4px 15px #0003;}
    input {width:100%;padding:15px;font-size:18px;border:1px solid #ccc;border-radius:8px;margin:10px 0;}
  </style>
</head>
<body>
  <h1>Hola, soy Lucía</h1>
  <h3>Asistente virtual de Ramón Delgado</h3>
  <h3>¿Qué te interesa?</h3>
  <button class="btn" onclick="alert('Próximamente')">Taller Primeros Auxilios</button>
  <button class="btn" onclick="alert('Próximamente')">Libros</button>
  <button class="btn" onclick="alert('Próximamente')">Ya hice el pago</button>
  <button class="btn" onclick="alert('Próximamente')">Hablar con Ramón Delgado</button>
  <button onclick="document.getElementById('demo-box').style.display='block'" class="btn demo">DEMO</button>
  <div id="demo-box">
    <p><strong>INTRODUZCA EL CÓDIGO DE SEIS DÍGITOS</strong></p>
    <input type="text" id="codigo" placeholder="Ej: 123456" maxlength="6">
    <button onclick="verificar()" class="btn demo">Enviar código</button>
    <p id="mensaje" style="margin-top:15px;font-weight:bold;"></p>
  </div>
  <p><small>Live en Render</small></p>
  <script>
    function verificar() {
      const code = document.getElementById('codigo').value;
      if (code === '${CODIGO_DEMO}') {
        document.getElementById('mensaje').innerHTML = 'Código correcto.<br>El modo DEMO se activa escribiendo la palabra <strong>DEMO</strong> en WhatsApp.';
        document.getElementById('mensaje').style.color = 'green';
      } else {
        document.getElementById('mensaje').innerHTML = 'Código incorrecto';
        document.getElementById('mensaje').style.color = 'red';
      }
    }
  </script>
</body>
</html>
  `);
});

client.initialize();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Bot corriendo'));
