const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth()
});

// ============ TUS VARIABLES (cámbialas cuando quieras) ============
const TU_NUMERO_SECRETO = '519991220000@c.us';  // tu número personal que usará demo
const CODIGO_DEMO = '561393';                  // el código que tú le darás al doctor

let modoDemoActivo = false;  // bandera para saber si estamos dentro del demo

// =================================================================

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡Bot conectado y listo!');
});

client.on('message', async msg => {
    const from = msg.from;
    const body = msg.body.trim();

    // ------------------- MODO DEMO SECRETO -------------------
    if (from === TU_NUMERO_SECRETO) {
        if (body.toLowerCase() === 'demo') {
            modoDemoActivo = false;
            msg.reply('Ingresa el código de 6 dígitos para entrar en modo DEMO:');
            return;
        }

        if (body === CODIGO_DEMO && !modoDemoActivo) {
            modoDemoActivo = true;
            msg.reply('✅ *MODO DEMO ACTIVADO*\n\nAhora todo lo que escriban los pacientes será tratado como cita médica. Cuando quieras salir escribe *salir*');
            return;
        }

        if (modoDemoActivo && body.toLowerCase() === 'salir') {
            modoDemoActivo = false;
            msg.reply('❌ Modo DEMO desactivado. Volvemos al bot normal.');
            return;
        }
    }

    // ------------------- BOT NORMAL (tus 3 botones) -------------------
    if (!modoDemoActivo) {
        if (body === 'hola' || body.toLowerCase() === 'menu' || body === '0') {
            await client.sendMessage(from, `*¡Hola! 👋 Soy Lucía, asistente de Ramón Delgado*\n\nElige una opción:`, {
                buttons: [
                    { body: '📚 Libros' },
                    { body: '🆘 Taller de Primeros Auxilios' },
                    { body: '✅ Ya realicé el pago' }
                ]
            });
            return;
        }

        // Aquí irán tus flujos normales de libros, taller y pago (ya los tienes)
        // … (no los toqué)
    }

    // ------------------- MODO DEMO (flujo médico) -------------------
    if (modoDemoActivo) {
        msg.reply('*(Modo DEMO activo)*\n\nEste sería el flujo completo de citas médicas.\nCuando estés listo para crear el bot real del doctor, avísame y lo duplicamos en 2 minutos.');
        // Aquí más adelante pondremos todo el flujo de citas, calendario, recordatorios, etc.
        return;
    }
});

client.initialize();

app.get('/', (req, res) => {
    res.send('Bot de Ramón Delgado corriendo 🚀');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
});
