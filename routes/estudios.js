// backend-beatles/routes/estudios.js
const express = require('express');
const router = express.Router();
const EstudiosController = require('../controllers/EstudiosController');

// Rutas para la entidad Estudios (solo lectura en este caso)
router.get('/', EstudiosController.getAll);
router.get('/:id', EstudiosController.getById); // El id es el id_grabacion
// router.post('/', EstudiosController.create); // Omitido según el controlador
// router.put('/:id', EstudiosController.update); // Omitido según el controlador
// router.delete('/:id', EstudiosController.delete); // Omitido según el controlador

module.exports = router;