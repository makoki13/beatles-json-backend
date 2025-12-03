// backend-beatles/routes/obras.js
const express = require('express');
const router = express.Router();
const ObrasController = require('../controllers/ObrasController');

// Rutas para la entidad Obras
router.get('/', ObrasController.getAll);
router.get('/:id', ObrasController.getById);
router.post('/', ObrasController.create);
router.put('/:id', ObrasController.update);
router.delete('/:id', ObrasController.delete);

module.exports = router;