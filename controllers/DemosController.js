// backend-beatles/controllers/DemosController.js
const Demo = require('../models/Demo');
const Grabacion = require('../models/Grabacion'); // Importar Grabacion
const Cancion = require('../models/Cancion'); // Importar Cancion
const Sesion = require('../models/Sesion'); // Importar Sesion
const { convertirCadenasVaciasANull } = require('../utils/utilidades'); // Asumiendo que está exportada

const DemosController = {
  // Obtener todas las demos con datos de la grabación y la canción relacionada
  getAll: async (req, res) => {
    try {
      // Mantenemos la posibilidad de ordenar, pero hay que tener cuidado con campos ambiguos si se incluyen tablas intermedias
      const { sort = 'id_grabacion', order = 'ASC' } = req.query; // Ordenar por id_grabacion por defecto
      const orderArray = [[sort, order.toUpperCase()]];

      const demos = await Demo.findAll({
        order: orderArray,
        include: [
          {
            model: Grabacion,
            as: 'grabacion', // Alias definido en la asociación de Demo
            attributes: ['id', 'descripcion', 'tipo', 'fecha', 'lugar'], // Seleccionar campos relevantes de Grabacion
            include: [ // Incluir datos de la canción Y la sesión asociadas a la grabación
              {
                model: Cancion,
                as: 'cancion', // Alias definido en la asociación de Grabacion
                attributes: ['id', 'nombre'] // Seleccionar solo el nombre de la canción
              },
              // --- Añadir Inclusión de Sesion ---
              {
                model: Sesion,
                as: 'sesion', // Alias definido en la asociación de Grabacion
                attributes: ['id', 'descripcion'] // Seleccionar campos relevantes de Sesion, como 'descripcion'
              }
              // --- Fin Añadir ---
            ]
          }
        ]
      });
      res.status(200).json(demos);
    } catch (error) {
      console.error('Error en DemosController.getAll:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener las demos.' });
    }
  },


  // Obtener una demo por ID de grabación con datos de la grabación y la canción
  getById: async (req, res) => {
    try {
      const { id } = req.params; // Este id es el id_grabacion
      const demo = await Demo.findByPk(id, {
        include: [
          {
            model: Grabacion,
            as: 'grabacion',
            attributes: ['id', 'descripcion', 'tipo', 'fecha', 'lugar'],
            include: [
              {
                model: Cancion,
                as: 'cancion',
                attributes: ['id', 'nombre']
              },
              // --- Añadir Inclusión de Sesion ---
              {
                model: Sesion,
                as: 'sesion',
                attributes: ['id', 'descripcion']
              }
              // --- Fin Añadir ---
            ]
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

  // Crear, Actualizar, Eliminar: No se implementan directamente aquí
  // Se gestionan al crear/actualizar/eliminar la Grabación correspondiente
  create: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Las demos se crean al crear una Grabación de tipo Demo.' });
  },
  update: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Las demos se actualizan al actualizar la Grabación relacionada.' });
  },
  delete: async (req, res) => {
    res.status(405).json({ error: 'Método no permitido. Las demos se eliminan al eliminar la Grabación relacionada.' });
  }
};

module.exports = DemosController;