// backend-beatles-api/controllers/CancionesController.js
const GenericController = require('./GenericController');
const Cancion = require('../models/Cancion'); // Importa el modelo específico

// Creamos el controlador específico usando la fábrica genérica
const CancionesController = GenericController(Cancion);

// Opcional: Puedes extender o sobrescribir métodos si es necesario
// Por ejemplo, si necesitas lógica específica antes de crear una canción:
// CancionesController.create = async (req, res) => {
//   // Lógica específica antes de llamar al create genérico
//   // ... validaciones, transformaciones, etc.
//   return GenericController(Cancion).create(req, res);
// };

module.exports = CancionesController;