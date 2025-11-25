// backend-beatles/controllers/SesionesController.js
const GenericController = require('./GenericController');
const Sesion = require('../models/Sesion');

const SesionesController = GenericController(Sesion);

module.exports = SesionesController;