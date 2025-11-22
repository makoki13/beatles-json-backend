// backend-beatles-api/routes/canciones.js
const express = require('express');
const router = express.Router();
const CancionesController = require('../controllers/CancionesController'); // Importa el controlador específico

// Rutas para la entidad Canciones
router.get('/', CancionesController.getAll);      // Obtener todos
router.get('/:id', CancionesController.getById);  // Obtener por ID
router.post('/', CancionesController.create);     // Crear nuevo
router.put('/:id', CancionesController.update);   // Actualizar existente
router.delete('/:id', CancionesController.delete); // Eliminar existente

module.exports = router;