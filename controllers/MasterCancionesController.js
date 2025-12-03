// backend-beatles/controllers/MasterCancionesController.js
const GenericController = require('./GenericController');
const MasterCancion = require('../models/MasterCancion');

const MasterCancionesController = GenericController(MasterCancion);

module.exports = MasterCancionesController;