const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Lucía - Asistente de Ramón Delgado</title>
        <style>
          body {font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f8ff;}
          h1 {font-size: 2.5em; color: #007bff;}
          button {margin: 15px; padding: 20px 40px; font-size: 1.5em; background: #28a745; color: white; border: none; border-radius: 12px; cursor: pointer;}
          .ramon {background: #25d366;}
        </style>
      </head>
      <body>
        <h1>Hola, soy Lucía</h1>
        <p>Asistente virtual de Ramón Delgado</p>
        <h2>¿Qué te interesa?</h2>
        <button onclick="window.open('https://wa.me/51987654321?text=Taller%20primeros%20auxilios')">Taller Primeros Auxilios</button>
        <button onclick="window.open('https://wa.me/51987654321?text=Libros')">Libros</button>
        <button onclick="window.open('https://wa.me/51987654321?text=Ya%20hice%20el%20pago')">Ya hice el pago</button>
        <button class="ramon" onclick="window.open('https://wa.me/51987654321')">Hablar con Ramón</button>
      </body>
    </html>
  `);
});

app.listen(PORT, () => console.log(Lucía vive en puerto ${PORT}));
