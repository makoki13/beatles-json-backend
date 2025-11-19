// backend-beatles/routes/personajes.js
const express = require('express');
const router = express.Router();
const PersonajesController = require('../controllers/PersonajesController'); // Importa el controlador específico

// Rutas para la entidad Personajes
router.get('/', PersonajesController.getAll);      // Obtener todos
router.get('/:id', PersonajesController.getById);  // Obtener por ID
router.post('/', PersonajesController.create);     // Crear nuevo
router.put('/:id', PersonajesController.update);   // Actualizar existente
router.delete('/:id', PersonajesController.delete); // Eliminar existente

module.exports = router;