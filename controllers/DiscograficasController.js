// backend-beatles/controllers/DiscograficasController.js
const GenericController = require('./GenericController');
const Discografica = require('../models/Discografica');

const DiscograficasController = GenericController(Discografica);

module.exports = DiscograficasController;