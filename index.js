const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Lucía - Ramón Delgado</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f8ff;}
          h1 {font-size: 2.5em; color: #007bff;}
          button {margin: 15px; padding: 20px 40px; font-size: 1.4em; background: #28a745; color: white; border: none; border-radius: 12px; cursor: pointer;}
          .ramon {background: #25d366;}
        </style>
      </head>
      <body>
        <h1>Hola, soy Lucía</h1>
        <p>Asistente virtual de Ramón Delgado</p>
        <h2>¿Qué te interesa?</h2>
        <button onclick="window.open('https://wa.me/51987654321?text=Taller')">Taller Primeros Auxilios</button><br>
        <button onclick="window.open('https://wa.me/51987654321?text=Libros')">Libros</button><br>
        <button onclick="window.open('https://wa.me/51987654321?text=Ya%20hice%20el%20pago')">Ya hice el pago</button><br>
        <button class="ramon" onclick="window.open('https://wa.me/51987654321')">Hablar con Ramón</button>
      </body>
    </html>
  `);
  res.end();
});

server.listen(port, hostname, () => {
  console.log('Lucía está viva');
});
