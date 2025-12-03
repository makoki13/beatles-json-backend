// backend-beatles/controllers/ObrasController.js
const GenericController = require('./GenericController');
const Obra = require('../models/Obra');

const ObrasController = GenericController(Obra);

module.exports = ObrasController;