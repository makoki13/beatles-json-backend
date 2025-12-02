// backend-beatles/routes/remixes.js
const express = require('express');
const router = express.Router();
const RemixesController = require('../controllers/RemixesController');

// Rutas para la entidad Mezclas (Remixes)
router.get('/', RemixesController.getAll);
router.get('/:id', RemixesController.getById);
router.post('/', RemixesController.create);
router.put('/:id', RemixesController.update);
router.delete('/:id', RemixesController.delete);

// --- Nueva Ruta: Obtener tomas disponibles para una canción específica ---
// Esta ruta devuelve grabaciones que son de tipo 'Toma', están relacionadas con la canción dada
// y tienen un registro correspondiente en la tabla Estudio.
router.get('/tomas_disponibles/:cancionId', RemixesController.getTomasDisponibles);

module.exports = router;