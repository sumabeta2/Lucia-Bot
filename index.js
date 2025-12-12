const MI_NUMERO = '51999123456@c.us';   // ← TU número con @c.us
const CODIGO_DEMO = '561393';           // ← Cambia cuando quieras

client.on('message', async msg => {
  const from = msg.from;
  const texto = msg.body.trim();

  if (texto.toLowerCase() === 'demo' && from === MI_NUMERO) {
    return msg.reply('Ingresa el código de 6 dígitos:');
  }
  if (texto === CODIGO_DEMO && from === MI_NUMERO) {
    return msg.reply('✅ MODO DEMO ACTIVADO\n\nEscribe *cita* para probar el flujo de citas médicas.');
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
