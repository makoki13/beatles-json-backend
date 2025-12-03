// backend-beatles/routes/master_canciones.js
const express = require('express');
const router = express.Router();
const MasterCancionesController = require('../controllers/MasterCancionesController');

// Rutas para la entidad MasterCanciones (CRUD básico)
router.get('/', MasterCancionesController.getAll);
router.get('/:id', MasterCancionesController.getById);
router.post('/', MasterCancionesController.create);
router.put('/:id', MasterCancionesController.update);
router.delete('/:id', MasterCancionesController.delete);

module.exports = router;