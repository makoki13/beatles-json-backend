// backend-beatles/server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Importa la instancia de Sequelize
const personajesRoutes = require('./routes/personajes'); // Importa las rutas de personajes
const cancionesRoutes = require('./routes/canciones'); // <-- IMPORTA ESTO NUEVO

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear JSON en el body

// Rutas
app.use('/api/personajes', personajesRoutes); // Monta las rutas bajo /api/personajes
app.use('/api/canciones', cancionesRoutes);  // <-- AÑADE ESTO NUEVO: Monta las rutas bajo /api/canciones

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Beatles Json - Servidor corriendo!' });
});

// Sincronizar la base de datos y levantar el servidor
sequelize.sync() // { force: true } para recrear tablas (¡cuidado en producción!)
  .then(() => {
    console.log('Conectado a la base de datos PostgreSQL.');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = app;