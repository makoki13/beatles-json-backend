// backend-beatles/routes/entrevistas.js
const express = require('express');
const router = express.Router();
const EntrevistasController = require('../controllers/EntrevistasController');

// Rutas para la entidad Entrevistas (solo lectura en este caso)
router.get('/', EntrevistasController.getAll);
router.get('/:id', EntrevistasController.getById); // El id es el id_grabacion
// router.post('/', EntrevistasController.create); // Omitido según el controlador
// router.put('/:id', EntrevistasController.update); // Omitido según el controlador
// router.delete('/:id', EntrevistasController.delete); // Omitido según el controlador

module.exports = router;