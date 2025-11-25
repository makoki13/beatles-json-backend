// backend-beatles/routes/sesiones.js
const express = require('express');
const router = express.Router();
const SesionesController = require('../controllers/SesionesController');

// Rutas para la entidad Sesiones
router.get('/', SesionesController.getAll);
router.get('/:id', SesionesController.getById);
router.post('/', SesionesController.create);
router.put('/:id', SesionesController.update);
router.delete('/:id', SesionesController.delete);

module.exports = router;