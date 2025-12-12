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

    // Inicio del flujo (cuando presiona TALLER o escribe "taller")
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

// ==================== PÁGINA PRINCIPAL CON BOTÓN TALLER (INTACTA) ====================
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
  <button class="btn" onclick="window.open('https://wa.me/51999123456?text=taller', '_blank')">Taller Primeros Auxilios</button>
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

// ==================== NUEVA RUTA /PRUEBA PARA SIMULAR EL FLUJO (SIMPLE CHAT) ====================
app.get('/prueba', (req, res) => {
    // Simular el inicio del flujo (como si hubieras dicho "taller")
    const messages = [
        '<div style="background:#e1f5fe;padding:10px;margin:10px;border-radius:8px;text-align:left;max-width:80%;margin-left:auto;"><strong>Bot:</strong> Muy bien de acuerdo, para continuar, por favor indícame ¿en qué país te encuentras?<br>Responde con uno de estos:<br>• Perú<br>• México<br>• Colombia<br>• Venezuela<br>• Otros</div>'
    ];

    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prueba Flujo Taller - Lucía</title>
  <style>
    body {font-family:Arial;background:linear-gradient(#a0d8ef,#e0f6ff);margin:0;padding:20px;text-align:center;}
    #chat {height:400px;overflow-y:scroll;border:1px solid #ccc;padding:10px;background:white;margin:20px auto;width:90%;border-radius:12px;}
    input {width:70%;padding:10px;font-size:16px;border:1px solid #ccc;border-radius:8px;}
    button {padding:10px 20px;font-size:16px;background:#00897b;color:white;border:none;border-radius:8px;cursor:pointer;}
    .user-msg {background:#c8e6c9;padding:8px;margin:5px;border-radius:8px;text-align:right;max-width:80%;margin-right:auto;display:inline-block;}
    .bot-msg {background:#e1f5fe;padding:8px;margin:5px;border-radius:8px;text-align:left;max-width:80%;margin-left:auto;display:inline-block;}
  </style>
</head>
<body>
  <h2>Prueba del Flujo Taller (escribe como usuario)</h2>
  <div id="chat">${messages.join('')}</div>
  <input type="text" id="input" placeholder="Escribe tu respuesta (ej: México)" onkeypress="if(event.key==='Enter') sendMessage()">
  <button onclick="sendMessage()">Enviar</button>
  <script>
    let flowStep = 'pais'; // Simula el estado del flujo
    let flowData = {};
    
    function sendMessage() {
      const input = document.getElementById('input');
      const userText = input.value.trim().toLowerCase();
      if (!userText) return;
      
      // Agregar mensaje del usuario
      const chat = document.getElementById('chat');
      chat.innerHTML += '<div class="user-msg"><strong>Tú:</strong> ' + input.value + '</div>';
      input.value = '';
      
      // Simular respuesta del bot basada en el flujo EXACTO
      let botReply = '';
      if (flowStep === 'pais') {
        if (userText.includes('méxico') || userText.includes('mexico')) {
          flowStep = 'interes';
          botReply = 'Muy bien le explicó, el taller será en vivo, a través de la plataforma Google Meet, al inscribirse, tendrá, los siguientes beneficios:<br>Certificado de participación (constancia) con validez internacional, tendrá material de apoyo en PDF y acceso a la clase grabada de por vida.<br><br>Todos estos beneficios, por una inversión de $249 pesos mexicanos.<br><br>Tan solo dígame, ¿Le interesa?<br><br>Responde *SÍ* o *NO*';
        } else {
          botReply = 'Gracias por su interés, estamos a su orden si cambia de opinión.';
          flowStep = null;
        }
      } else if (flowStep === 'interes') {
        if (userText.includes('sí') || userText.includes('si')) {
          flowStep = 'metodo_pago';
          botReply = 'Muy bien en México tenemos dos métodos de pago, ¿cuál prefiere?<br><br>Responde con:<br>• OXXO<br>• TRANSFERENCIA';
        } else if (userText.includes('no')) {
          botReply = 'Gracias por su interés, estamos a su orden si cambia de opinión.';
          flowStep = null;
        } else {
          botReply = 'Por favor responde *SÍ* o *NO* para continuar.';
        }
      } else if (flowStep === 'metodo_pago') {
        if (userText.includes('oxxo')) {
          botReply = '*OXXO, por favor:*<br>4741742975530315<br>Luis Ibarra <br>Banregio<br>Monto: $249 pesos mexicanos<br><br>**Nota1, por favor hacer la operación antes de las 5:30pm, hora mexicana. Después de esa hora, no será reconocida la transacción. Gracias.**<br>**Nota2: Una vez que haga la transacción, debe ubicar en el menú principal el botón "Ya hice el pago" para regidirlo a una persona, que le tomara su caso, para finalizar su inscripción.**';
          flowStep = null;
        } else if (userText.includes('transferencia')) {
          botReply = '*Solo Transferencia bancaria*:<br>721180100038218691<br>Jhonatan Hernández <br>Banco albo<br>Monto: $249 pesos mexicanos<br><br>**Nota1, por favor hacer la operación antes de las 5:30pm, hora mexicana. Después de esa hora, no será reconocida la transacción.**<br>**Nota2: En la transacción, debe verse la clave de rastreo (OBLIGATORIO)**<br>**Nota3: Una vez que haga la transacción, debe ubicar en el menú principal el botón "Ya hice el pago" para regidirlo a una persona, que le tomara su caso, para finalizar su inscripción.**';
          flowStep = null;
        }
      } else {
        botReply = '¡Hola! Soy Lucía. Los flujos están en construcción. Pronto estarán listos.';
      }
      
      // Agregar respuesta del bot
      setTimeout(() => {
        chat.innerHTML += '<div class="bot-msg"><strong>Bot:</strong> ' + botReply + '</div>';
        chat.scrollTop = chat.scrollHeight;
      }, 500); // Simula delay de respuesta
    }
  </script>
</body>
</html>
    `);
});

client.initialize();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Bot corriendo'));
