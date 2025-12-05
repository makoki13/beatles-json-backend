// backend-beatles/routes/discograficas.js
const express = require('express');
const router = express.Router();
const DiscograficasController = require('../controllers/DiscograficasController');

// Rutas para la entidad Discograficas
router.get('/', DiscograficasController.getAll);
router.get('/:id', DiscograficasController.getById);
router.post('/', DiscograficasController.create);
router.put('/:id', DiscograficasController.update);
router.delete('/:id', DiscograficasController.delete);

module.exports = router;