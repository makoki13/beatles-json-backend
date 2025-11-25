// backend-beatles/routes/grabaciones.js
const express = require('express');
const router = express.Router();
const GrabacionesController = require('../controllers/GrabacionesController');

// Rutas para la entidad Grabaciones
router.get('/', GrabacionesController.getAll);
router.get('/:id', GrabacionesController.getById);
router.post('/', GrabacionesController.create);
router.put('/:id', GrabacionesController.update);
router.delete('/:id', GrabacionesController.delete);

module.exports = router;