// backend-beatles-api/server.js
const express = require('express');
const cors = require('cors');
// Importar la instancia de Sequelize desde config/database.js
const sequelize = require('./config/database');

// Importar rutas
const personajesRoutes = require('./routes/personajes');
const cancionesRoutes = require('./routes/canciones');
const sesionesRoutes = require('./routes/sesiones');
const grabacionesRoutes = require('./routes/grabaciones');
const demosRoutes = require('./routes/demos');
const estudiosRoutes = require('./routes/estudios');
const actuacionesRoutes = require('./routes/actuaciones');
const entrevistasRoutes = require('./routes/entrevistas');
const remixesRoutes = require('./routes/remixes');
const obrasRoutes = require('./routes/obras');
const masterCancionesRoutes = require('./routes/master_canciones');
const mastersRoutes = require('./routes/masters');
// Añadir otras rutas cuando las implementes
const discograficasRoutes = require('./routes/discograficas');
const publicacionesRoutes = require('./routes/publicaciones');

const app = express();
const PORT = process.env.PORT || 3001; // Usar puerto de variable de entorno o 3001 por defecto

// Middleware
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Parsear el body de las solicitudes como JSON

// Rutas
app.use('/api/personajes', personajesRoutes);
app.use('/api/canciones', cancionesRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/grabaciones', grabacionesRoutes);
app.use('/api/demos', demosRoutes);
app.use('/api/estudios', estudiosRoutes);
app.use('/api/actuaciones', actuacionesRoutes);
app.use('/api/entrevistas', entrevistasRoutes);
app.use('/api/remixes', remixesRoutes);
app.use('/api/obras', obrasRoutes);
app.use('/api/master_canciones', masterCancionesRoutes);
app.use('/api/masters', mastersRoutes);
// Añadir otras rutas cuando las implementes
app.use('/api/discograficas', discograficasRoutes);
app.use('/api/publicaciones', publicacionesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Beatles Json - Servidor corriendo!' });
});

// --- Inicialización de Modelos y Asociaciones ---
// Importar modelos
const Personaje = require('./models/Personaje');
const Cancion = require('./models/Cancion');
const Sesion = require('./models/Sesion');
const Grabacion = require('./models/Grabacion');
const Demo = require('./models/Demo');
const Estudio = require('./models/Estudio');
const Actuacion = require('./models/Actuacion');
const Entrevista = require('./models/Entrevista');
const Remix = require('./models/Remix');
const Obra = require('./models/Obra');
const MasterCancion = require('./models/MasterCancion');
const Master = require('./models/Master');
const MastersMasterCancion = require('./models/MastersMasterCancion');
// Añadir otros modelos si es necesario
const Discografica = require('./models/Discografica');
const Publicacion = require('./models/Publicacion');

// Definir todas las asociaciones
const models = {
  Personaje,
  Cancion,
  Sesion,
  Grabacion,
  Demo,
  Estudio,
  Actuacion,
  Entrevista,
  Remix,
  Obra,
  MasterCancion,
  Master,
  MastersMasterCancion,
  // Añadir otros modelos si es necesario
  Discografica,
  Publicacion,
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    console.log(`DEBUG: Llamando associate para: ${modelName}`); // Log de ayuda
    models[modelName].associate(models);
  } else {
     console.log(`DEBUG: Modelo ${modelName} no tiene función associate.`); // Log de ayuda
  }
});
console.log("DEBUG: Todas las funciones associate han sido llamadas."); // Log de ayuda
// --- Fin Inicialización ---

// Sincronizar la base de datos y levantar el servidor
// NOTA: En producción, generalmente se usa migraciones en lugar de sync().
sequelize.sync(/* { force: false } <- Cambiar a true para recrear tablas (¡cuidado!) */)
  .then(() => {
    console.log('Conectado a la base de datos PostgreSQL.');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = app; // Opcional: exportar la app si se necesita para testing