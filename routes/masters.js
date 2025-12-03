// backend-beatles/routes/masters.js
const express = require('express');
const router = express.Router();
const MastersController = require('../controllers/MastersController');

// Rutas para la entidad Masters
router.get('/', MastersController.getAll);
router.get('/:id', MastersController.getById);
router.post('/', MastersController.create);
router.put('/:id', MastersController.update);
router.delete('/:id', MastersController.delete);

module.exports = router;