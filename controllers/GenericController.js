// backend-beatles/controllers/GenericController.js

const { convertirCadenasVaciasANull } = require('../utils/utilidades');

const GenericController = (model) => {
  return {
    // Obtener todos los registros
    getAll: async (req, res) => {
      try {
        // --- Cambio Aquí ---
        // Obtener parámetros de ordenación desde la query string (por ejemplo, ?sort=nombre&order=ASC)
        const { sort = 'id', order = 'ASC' } = req.query; // Valores por defecto: ordenar por 'id', ascendente

        // Construir el objeto de ordenación para Sequelize
        // Asegúrate de que 'sort' sea un campo válido para prevenir inyección SQL
        // Opciones válidas para Personaje: id, nombre, fecha_nacimiento, lugar_nacimiento, fecha_fallecimiento, lugar_fallecimiento
        // Opciones válidas para Cancion: id, nombre, ...
        // Debes validar sort según el modelo que se esté usando.
        // Por simplicidad en este ejemplo, asumiremos que 'sort' es un campo conocido para el modelo en cuestión.
        // En producción, deberías validar 'sort' contra una lista blanca de campos permitidos para cada modelo.
        const orderArray = [[sort, order.toUpperCase()]]; // Sequelize espera un array de arrays

        const items = await model.findAll({
          order: orderArray // Aplica el orden aquí
        });
        // --- Fin Cambio ---
        res.status(200).json(items);
      } catch (error) {
        console.error('Error en GenericController.getAll:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener los registros.' });
      }
    },

    getById: async (req, res) => {
      try {
        const { id } = req.params;
        const item = await model.findByPk(id);
        if (!item) {
          return res.status(404).json({ error: 'Registro no encontrado.' });
        }
        res.status(200).json(item);
      } catch (error) {
        console.error('Error en GenericController.getById:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener el registro.' });
      }
    },

    create: async (req, res) => {
      try {
        const datosParaCrear = convertirCadenasVaciasANull(req.body);
        const newItem = await model.create(datosParaCrear);
        res.status(201).json(newItem);
      } catch (error) {
        console.error('Error en GenericController.create:', error);
        res.status(400).json({ error: error.message || 'Error al crear el registro.' });
      }
    },

    update: async (req, res) => {
      try {
        const { id } = req.params;
        const datosParaActualizar = convertirCadenasVaciasANull(req.body);
        const [updatedRowsCount] = await model.update(datosParaActualizar, {
          where: { id: id }
        });

        if (updatedRowsCount === 0) {
          return res.status(404).json({ error: 'Registro no encontrado para actualizar.' });
        }

        const updatedItem = await model.findByPk(id);
        res.status(200).json(updatedItem);
      } catch (error) {
        console.error('Error en GenericController.update:', error);
        res.status(400).json({ error: error.message || 'Error al actualizar el registro.' });
      }
    },

    delete: async (req, res) => {
      try {
        const { id } = req.params;
        const deletedRowsCount = await model.destroy({
          where: { id: id }
        });

        if (deletedRowsCount === 0) {
          return res.status(404).json({ error: 'Registro no encontrado para eliminar.' });
        }

        res.status(204).end();
      } catch (error) {
        console.error('Error en GenericController.delete:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar el registro.' });
      }
    }
  };
};

module.exports = GenericController;