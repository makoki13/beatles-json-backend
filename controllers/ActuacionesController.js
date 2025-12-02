// backend-beatles/controllers/ActuacionesController.js
const Actuacion = require('../models/Actuacion');
const Grabacion = require('../models/Grabacion'); // Importamos el modelo relacionado
// No necesitamos convertirCadenasVaciasANull para operaciones de solo lectura

const ActuacionesController = {
  // Obtener todos los registros de Actuacion con datos de la grabación relacionada
  getAll: async (req, res) => {
    try {
      const { sort = 'id_grabacion', order = 'ASC' } = req.query; // Ordenar por id_grabacion por defecto
      const orderArray = [[sort, order.toUpperCase()]];

      const actuaciones = await Actuacion.findAll({
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
      res.status(200).json(actuaciones);
    } catch (error) {
      console.error('Error en ActuacionesController.getAll:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener las actuaciones.' });
    }
  },

  // Obtener un registro de Actuacion por ID de grabación con datos de la grabación
  getById: async (req, res) => {
    try {
      const { id } = req.params; // Este id es el id_grabacion
      const actuacion = await Actuacion.findByPk(id, {
        include: [
          {
            model: Grabacion,
            as: 'grabacion',
            attributes: ['id', 'descripcion', 'tipo', 'fecha', 'lugar']
          }
        ]
      });
      if (!actuacion) {
        return res.status(404).json({ error: 'Actuación no encontrada.' });
      }
      res.status(200).json(actuacion);
    } catch (error) {
      console.error('Error en ActuacionesController.getById:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener la actuación.' });
    }
  },

  // Crear, Actualizar, Eliminar: No se implementan directamente aquí
  // Se gestionan al crear/actualizar/eliminar la Grabación correspondiente
  create: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Las actuaciones se crean al crear una Grabación de tipo Actuación.' });
  },
  update: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Las actuaciones se actualizan al actualizar la Grabación relacionada.' });
  },
  delete: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Las actuaciones se eliminan al eliminar la Grabación relacionada.' });
  }
};

module.exports = ActuacionesController;