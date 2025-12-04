// backend-beatles/controllers/PersonajesController.js
const GenericController = require('./GenericController');
const Personaje = require('../models/Personaje'); // Importa el modelo específico

// Creamos el controlador específico usando la fábrica genérica
const PersonajesController = GenericController(Personaje);

// Opcional: Puedes extender o sobrescribir métodos si es necesario
// Por ejemplo, si necesitas lógica específica antes de crear un personaje:
// PersonajesController.create = async (req, res) => {
//   // Lógica específica antes de llamar al create genérico
//   // ... validaciones, transformaciones, etc.
//   return GenericController(Personaje).create(req, res); // O llamar directamente a super.create si se usara herencia
// };

module.exports = PersonajesController;