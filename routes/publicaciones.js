// backend-beatles/routes/publicaciones.js
const express = require('express');
const router = express.Router();
const PublicacionesController = require('../controllers/PublicacionesController');

// Rutas para la entidad Publicaciones
router.get('/', PublicacionesController.getAll);
router.get('/:id', PublicacionesController.getById);
router.post('/', PublicacionesController.create);
router.put('/:id', PublicacionesController.update);
router.delete('/:id', PublicacionesController.delete);

module.exports = router;