// ——————— BOTÓN DEMO OCULTO (solo tú puedes usarlo) ———————
const TU_NUMERO_SECRETO = '51931479063@c.us'; // ← pon aquí tu número real con @c.us
const CODIGO_DEMO = '561393';                    // ← cambia este código a lo que quieras

let modoDemo = false;

client.on('message', async msg => {
  const from = msg.from;
  const texto = msg.body.trim();

  // Si escribes "demo" desde tu número secreto
  if (texto.toLowerCase() === 'demo' && from === TU_NUMERO_SECRETO) {
    modoDemo = true;
    return msg.reply('Ingresa el código de acceso de 6 dígitos:');
  }

  // Si escribes el código correcto
  if (modoDemo && texto === CODIGO_DEMO && from === TU_NUMERO_SECRETO) {
    modoDemo = false;
    return msg.reply('✅ *MODO DEMO ACTIVADO*\n\nAhora puedes probar el flujo de citas médicas completo.\n\nEscribe *cita* para comenzar la demostración.');
  }

  // Aquí puedes seguir añadiendo después el flujo completo de citas cuando quieras
});
