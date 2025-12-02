// backend-beatles/controllers/EntrevistasController.js
const Entrevista = require('../models/Entrevista');
const Grabacion = require('../models/Grabacion'); // Importamos el modelo relacionado
// No necesitamos convertirCadenasVaciasANull para operaciones de solo lectura

const EntrevistasController = {
  // Obtener todos los registros de Entrevista con datos de la grabación relacionada
  getAll: async (req, res) => {
    try {
      const { sort = 'id_grabacion', order = 'ASC' } = req.query; // Ordenar por id_grabacion por defecto
      const orderArray = [[sort, order.toUpperCase()]];

      const entrevistas = await Entrevista.findAll({
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
      res.status(200).json(entrevistas);
    } catch (error) {
      console.error('Error en EntrevistasController.getAll:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener las entrevistas.' });
    }
  },

  // Obtener un registro de Entrevista por ID de grabación con datos de la grabación
  getById: async (req, res) => {
    try {
      const { id } = req.params; // Este id es el id_grabacion
      const entrevista = await Entrevista.findByPk(id, {
        include: [
          {
            model: Grabacion,
            as: 'grabacion',
            attributes: ['id', 'descripcion', 'tipo', 'fecha', 'lugar']
          }
        ]
      });
      if (!entrevista) {
        return res.status(404).json({ error: 'Entrevista no encontrada.' });
      }
      res.status(200).json(entrevista);
    } catch (error) {
      console.error('Error en EntrevistasController.getById:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener la entrevista.' });
    }
  },

  // Crear, Actualizar, Eliminar: No se implementan directamente aquí
  // Se gestionan al crear/actualizar/eliminar la Grabación correspondiente
  create: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Las entrevistas se crean al crear una Grabación de tipo Entrevista.' });
  },
  update: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Las entrevistas se actualizan al actualizar la Grabación relacionada.' });
  },
  delete: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Las entrevistas se eliminan al eliminar la Grabación relacionada.' });
  }
};

module.exports = EntrevistasController;