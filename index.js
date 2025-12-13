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
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    }
});

const userFlows = {};
const MI_NUMERO = '51999123456@c.us';
const CODIGO_DEMO = '561393';

client.on('qr', qr => {
    console.log('Escanea el QR:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡Lucía Bot listo y conectado!');
});

client.on('message', async msg => {
    const from = msg.from;
    const texto = msg.body ? msg.body.trim() : '';
    const textoLower = texto.toLowerCase();

    // ==================== MODO DEMO SECRETO ====================
    if (textoLower === 'demo' && from === MI_NUMERO) {
        return msg.reply('Ingresa el código de 6 dígitos:');
    }

    if (texto === CODIGO_DEMO && from === MI_NUMERO) {
        return msg.reply('✅ MODO DEMO ACTIVADO\n\nEscribe cita para probar el flujo de citas médicas.');
    }

    // ==================== FLUJO TALLER ====================
    if (!userFlows[from]) {
        userFlows[from] = { step: null };
    }
    const flow = userFlows[from];

    if (textoLower === 'taller' || textoLower.includes('taller primeros auxilios')) {
        flow.step = 'pais';
        await msg.reply('Muy bien de acuerdo, para continuar, por favor indícame ¿en qué país te encuentras?\n\nResponde con uno de estos:\n• Perú\n• México\n• Colombia\n• Venezuela\n• Otros');
        return;
    }

    if (flow.step === 'pais') {
        if (textoLower.includes('méxico') || textoLower.includes('mexico')) {
            flow.step = 'interes';
            await msg.reply(`Muy bien, le explico: el taller será en vivo, a través de la plataforma Google Meet. Al inscribirse, tendrá los siguientes beneficios:

• Certificado de participación (constancia) con validez internacional
• Material de apoyo en PDF
• Acceso a la clase grabada de por vida

Todos estos beneficios por una inversión de $249 pesos mexicanos.

Tan solo dígame, ¿Le interesa?

Responde SÍ o *NO*`);
        } else {
            await msg.reply('Gracias por su interés, estamos a su orden si cambia de opinión.');
            delete userFlows[from];
        }
        return;
    }

    if (flow.step === 'interes') {
        if (textoLower.includes('sí') || textoLower.includes('si')) {
            flow.step = 'metodo_pago';
            await msg.reply('Muy bien, en México tenemos dos métodos de pago, ¿cuál prefiere?\n\nResponde con:\n• OXXO\n• TRANSFERENCIA');
        } else if (textoLower.includes('no')) {
            await msg.reply('Gracias por su interés, estamos a su orden si cambia de opinión.');
            delete userFlows[from];
        }
        return;
    }

    if (flow.step === 'metodo_pago') {
        if (textoLower.includes('oxxo')) {
            await msg.reply(`*OXXO, por favor:*
4741742975530315
Luis Ibarra
Banregio
Monto: $249 pesos mexicanos

*Nota1:* Por favor hacer la operación antes de las 5:30pm, hora mexicana. Después de esa hora, no será reconocida la transacción. Gracias.

*Nota2:* Una vez que haga la transacción, debe ubicar en el menú principal el botón "Ya hice el pago" para registrarlo a una persona que le tomará su caso y finalizará su inscripción.`);
            delete userFlows[from];
        } else if (textoLower.includes('transferencia')) {
            await msg.reply(`*Solo Transferencia bancaria:*
721180100038218691
Jhonatan Hernández
Banco albo
Monto: $249 pesos mexicanos

*Nota1:* Por favor hacer la operación antes de las 5:30pm, hora mexicana. Después de esa hora, no será reconocida la transacción.

*Nota2:* En la transacción, debe verse la clave de rastreo (OBLIGATORIO)

*Nota3:* Una vez que haga la transacción, debe ubicar en el menú principal el botón "Ya hice el pago" para registrarlo a una persona que le tomará su caso y finalizará su inscripción.`);
            delete userFlows[from];
        }
        return;
    }

    // Respuesta por defecto
    await msg.reply('¡Hola! Soy Lucía. Los flujos están en construcción. Pronto estarán listos.');
});

// ==================== PÁGINA PRINCIPAL CON SIMULADOR ====================
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
        .btn {display:block;width:85%;max-width:400px;margin:18px auto;padding:20px;background:#00897b;color:white;border-radius:12px;font-size:20px;font-weight:bold;text-decoration:none;}
        .demo {background:#00bfa5;}
        .prueba {background:#ff9800;}
        #demo-box {display:none;margin:30px auto;width:85%;background:white;padding:20px;border-radius:12px;box-shadow:0 4px 15px #0003;}
        input {width:100%;padding:15px;font-size:18px;border:1px solid #ccc;border-radius:8px;margin:10px 0;}
        #flow-container {display:none;background:white;padding:20px;border-radius:12px;box-shadow:0 4px 15px #0003;margin:20px auto;width:90%;max-width:500px;}
        .message {background:#e1f5fe;padding:15px;margin:15px 0;border-radius:12px;text-align:left;line-height:1.5;}
        .message strong {font-weight:bold;}
        .buttons {display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:20px;}
        .option-btn {padding:15px 20px;background:#00897b;color:white;border:none;border-radius:12px;font-size:18px;cursor:pointer;flex:1 1 40%;}
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
    <button onclick="startTest()" class="btn prueba">Probar flujo taller (solo yo)</button>

    <div id="demo-box">
        <p><strong>INTRODUZCA EL CÓDIGO DE SEIS DÍGITOS</strong></p>
        <input type="text" id="codigo" placeholder="Ej: 123456" maxlength="6">
        <button onclick="verificar()" class="btn demo">Enviar código</button>
        <p id="mensaje" style="margin-top:15px;font-weight:bold;"></p>
    </div>

    <div id="flow-container">
        <div id="flow-messages"></div>
        <div id="flow-buttons" class="buttons"></div>
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

        function startTest() {
            document.getElementById('flow-container').style.display = 'block';
            document.getElementById('flow-messages').innerHTML = '';
            document.getElementById('flow-buttons').innerHTML = '';
            addMessage('Muy bien de acuerdo, para continuar, por favor indícame ¿en qué país te encuentras?');
            showCountryButtons();
        }

        function showCountryButtons() {
            const btnContainer = document.getElementById('flow-buttons');
            btnContainer.innerHTML = '';
            ['Perú', 'México', 'Colombia', 'Venezuela', 'Otros'].forEach(country => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = country;
                btn.onclick = () => selectCountry(country);
                btnContainer.appendChild(btn);
            });
        }

        function selectCountry(country) {
            addMessage('<strong>Tú:</strong> ' + country);
            if (country !== 'México') {
                addMessage('Gracias por su interés, estamos a su orden si cambia de opinión.');
                clearButtons();
                return;
            }
            addMessage(Muy bien, le explico: el taller será en vivo, a través de la plataforma Google Meet. Al inscribirse, tendrá los siguientes beneficios:<br><br>• Certificado de participación (constancia) con validez internacional<br>• Material de apoyo en PDF<br>• Acceso a la clase grabada de por vida<br><br>Todos estos beneficios por una inversión de $249 pesos mexicanos.<br><br>Tan solo dígame, ¿Le interesa?);
            showYesNoButtons();
        }

        function showYesNoButtons() {
            const btnContainer = document.getElementById('flow-buttons');
            btnContainer.innerHTML = '';
            ['SÍ', 'NO'].forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt;
                btn.onclick = () => selectInterest(opt);
                btnContainer.appendChild(btn);
            });
        }

        function selectInterest(opt) {
            addMessage('<strong>Tú:</strong> ' + opt);
            if (opt === 'NO') {
                addMessage('Gracias por su interés, estamos a su orden si cambia de opinión.');
                clearButtons();
                return;
            }
            addMessage('Muy bien, en México tenemos dos métodos de pago, ¿cuál prefiere?');
            showPaymentButtons();
        }

        function showPaymentButtons() {
            const btnContainer = document.getElementById('flow-buttons');
            btnContainer.innerHTML = '';
            ['OXXO', 'TRANSFERENCIA'].forEach(method => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = method;
                btn.onclick = () => selectMethod(method);
                btnContainer.appendChild(btn);
            });
        }

        function selectMethod(method) {
            addMessage('<strong>Tú:</strong> ' + method);
            let reply = '';
            if (method === 'OXXO') {
                reply = <strong>OXXO, por favor:</strong><br>4741742975530315<br>Luis Ibarra<br>Banregio<br>Monto: $249 pesos mexicanos<br><br><strong>Nota1:</strong> Por favor hacer la operación antes de las 5:30pm, hora mexicana. Después de esa hora, no será reconocida la transacción. Gracias.<br><strong>Nota2:</strong> Una vez que haga la transacción, debe ubicar en el menú principal el botón "Ya hice el pago" para registrarlo a una persona que le tomará su caso y finalizará su inscripción.;
            } else {
                reply = <strong>Solo Transferencia bancaria:</strong><br>721180100038218691<br>Jhonatan Hernández<br>Banco albo<br>Monto: $249 pesos mexicanos<br><br><strong>Nota1:</strong> Por favor hacer la operación antes de las 5:30pm, hora mexicana. Después de esa hora, no será reconocida la transacción.<br><strong>Nota2:</strong> En la transacción, debe verse la clave de rastreo (OBLIGATORIO)<br><strong>Nota3:</strong> Una vez que haga la transacción, debe ubicar en el menú principal el botón "Ya hice el pago" para registrarlo a una persona que le tomará su caso y finalizará su inscripción.;
            }
            addMessage(reply);
            clearButtons();
        }

        function addMessage(text) {
            const div = document.createElement('div');
            div.className = 'message';
            div.innerHTML = text;
            document.getElementById('flow-messages').appendChild(div);
            window.scrollTo(0, document.body.scrollHeight);
        }

        function clearButtons() {
            document.getElementById('flow-buttons').innerHTML = '';
        }
    </script>
</body>
</html>
    `);
});

client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Bot corriendo en puerto ${PORT}));
