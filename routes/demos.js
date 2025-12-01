// backend-beatles/routes/demos.js
const express = require('express');
const router = express.Router();
const DemosController = require('../controllers/DemosController');

// Rutas para la entidad Demos (solo lectura en este caso)
router.get('/', DemosController.getAll);
router.get('/:id', DemosController.getById); // El id es el id_grabacion
// router.post('/', DemosController.create); // Omitido según el controlador
// router.put('/:id', DemosController.update); // Omitido según el controlador
// router.delete('/:id', DemosController.delete); // Omitido según el controlador

module.exports = router;