// backend-beatles/routes/actuaciones.js
const express = require('express');
const router = express.Router();
const ActuacionesController = require('../controllers/ActuacionesController');

// Rutas para la entidad Actuaciones (solo lectura en este caso)
router.get('/', ActuacionesController.getAll);
router.get('/:id', ActuacionesController.getById); // El id es el id_grabacion
// router.post('/', ActuacionesController.create); // Omitido según el controlador
// router.put('/:id', ActuacionesController.update); // Omitido según el controlador
// router.delete('/:id', ActuacionesController.delete); // Omitido según el controlador

module.exports = router;