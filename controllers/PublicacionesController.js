// backend-beatles/controllers/PublicacionesController.js
const GenericController = require('./GenericController');
const Publicacion = require('../models/Publicacion');

const PublicacionesController = GenericController(Publicacion);

module.exports = PublicacionesController;