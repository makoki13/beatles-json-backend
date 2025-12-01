// backend-beatles/controllers/DemosController.js
const Demo = require('../models/Demo');
const Grabacion = require('../models/Grabacion'); // Importamos el modelo relacionado
const { convertirCadenasVaciasANull } = require('../utils/utilidades'); // Importamos la función auxiliar

const DemosController = {
  // Obtener todas las demos con datos de la grabación relacionada
  getAll: async (req, res) => {
    try {
      const { sort = 'id_grabacion', order = 'ASC' } = req.query; // Ordenar por id_grabacion por defecto
      const orderArray = [[sort, order.toUpperCase()]];

      const demos = await Demo.findAll({
        order: orderArray,
        include: [ // Incluir datos de la grabación
          {
            model: Grabacion,
            as: 'grabacion',
            attributes: ['id', 'descripcion', 'tipo', 'fecha', 'lugar'] // Seleccionar campos relevantes de Grabacion
            // Puedes incluir más campos si es necesario
          }
        ]
      });
      res.status(200).json(demos);
    } catch (error) {
      console.error('Error en DemosController.getAll:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener las demos.' });
    }
  },

  // Obtener una demo por ID de grabación con datos de la grabación
  getById: async (req, res) => {
    try {
      const { id } = req.params; // Este id es el id_grabacion
      const demo = await Demo.findByPk(id, {
        include: [
          {
            model: Grabacion,
            as: 'grabacion',
            attributes: ['id', 'descripcion', 'tipo', 'fecha', 'lugar']
          }
        ]
      });
      if (!demo) {
        return res.status(404).json({ error: 'Demo no encontrada.' });
      }
      res.status(200).json(demo);
    } catch (error) {
      console.error('Error en DemosController.getById:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener la demo.' });
    }
  },

  // Crear una nueva demo (esto se hace desde la creación de Grabacion, no directamente aquí)
  // Si se quisiera crear directamente, se debería manejar cuidadosamente la FK.
  create: async (req, res) => {
    // Este endpoint no es típico para una tabla con PK=FK si la creación se maneja en la entidad principal.
    // Se podría implementar, pero requiere cuidado.
    // Por ahora, lo dejamos como un placeholder o lo excluimos de las rutas comunes.
    // Si necesitas crear demos directamente, asegúrate de que req.body.id_grabacion exista y sea válido.
    res.status(405).json({ error: 'Método no permitido. Las demos se crean al crear una Grabación de tipo Demo.' });
  },

  // Actualizar una demo existente (esto se hace desde la actualización de Grabacion, no directamente aquí)
  update: async (req, res) => {
    // Similar a create, la actualización directa puede no ser común.
    res.status(405).json({ error: 'Método no permitido. Las demos se actualizan al actualizar la Grabación relacionada o por su propia lógica.' });
  },

  // Eliminar una demo (esto se hace desde la eliminación de Grabacion, no directamente aquí)
  delete: async (req, res) => {
    // Similar a create/update, la eliminación directa puede no ser común.
    res.status(405).json({ error: 'Método no permitido. Las demos se eliminan al eliminar la Grabación relacionada.' });
  }
};

module.exports = DemosController;