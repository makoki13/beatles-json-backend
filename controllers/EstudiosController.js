// backend-beatles/controllers/EstudiosController.js
const Estudio = require('../models/Estudio');
const Grabacion = require('../models/Grabacion'); // Importamos el modelo relacionado
// No necesitamos convertirCadenasVaciasANull para operaciones de solo lectura

const EstudiosController = {
  // Obtener todos los registros de Estudio con datos de la grabación relacionada
  getAll: async (req, res) => {
    try {
      const { sort = 'id_grabacion', order = 'ASC' } = req.query; // Ordenar por id_grabacion por defecto
      const orderArray = [[sort, order.toUpperCase()]];

      const estudios = await Estudio.findAll({
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
      res.status(200).json(estudios);
    } catch (error) {
      console.error('Error en EstudiosController.getAll:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener los estudios.' });
    }
  },

  // Obtener un registro de Estudio por ID de grabación con datos de la grabación
  getById: async (req, res) => {
    try {
      const { id } = req.params; // Este id es el id_grabacion
      const estudio = await Estudio.findByPk(id, {
        include: [
          {
            model: Grabacion,
            as: 'grabacion',
            attributes: ['id', 'descripcion', 'tipo', 'fecha', 'lugar']
          }
        ]
      });
      if (!estudio) {
        return res.status(404).json({ error: 'Estudio no encontrado.' });
      }
      res.status(200).json(estudio);
    } catch (error) {
      console.error('Error en EstudiosController.getById:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener el estudio.' });
    }
  },

  // Crear, Actualizar, Eliminar: No se implementan directamente aquí
  // Se gestionan al crear/actualizar/eliminar la Grabación correspondiente
  create: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Los estudios se crean al crear una Grabación de tipo Toma.' });
  },
  update: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Los estudios se actualizan al actualizar la Grabación relacionada.' });
  },
  delete: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Los estudios se eliminan al eliminar la Grabación relacionada.' });
  }
};

module.exports = EstudiosController;