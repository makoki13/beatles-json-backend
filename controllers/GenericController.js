// backend-beatles/controllers/GenericController.js

// Función fábrica que devuelve un objeto con métodos CRUD genéricos
const GenericController = (model) => {
  return {
    // Obtener todos los registros
    getAll: async (req, res) => {
      try {
        // req.query puede contener filtros (p.ej., ?nombre=John)
        // Aquí puedes aplicar lógica de búsqueda si es necesario
        // Por ahora, simplemente findAll
        const items = await model.findAll();
        res.status(200).json(items);
      } catch (error) {
        console.error('Error en GenericController.getAll:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener los registros.' });
      }
    },

    // Obtener un registro por ID
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

    // Crear un nuevo registro
    create: async (req, res) => {
      try {
        const newItem = await model.create(req.body);
        res.status(201).json(newItem);
      } catch (error) {
        console.error('Error en GenericController.create:', error);
        // Manejo de errores de validación de Sequelize u otros
        res.status(400).json({ error: error.message || 'Error al crear el registro.' });
      }
    },

    // Actualizar un registro existente
    update: async (req, res) => {
      try {
        const { id } = req.params;
        const [updatedRowsCount] = await model.update(req.body, {
          where: { id: id }
        });

        if (updatedRowsCount === 0) {
          return res.status(404).json({ error: 'Registro no encontrado para actualizar.' });
        }

        // Opcional: Devolver el registro actualizado
        const updatedItem = await model.findByPk(id);
        res.status(200).json(updatedItem);
      } catch (error) {
        console.error('Error en GenericController.update:', error);
        res.status(400).json({ error: error.message || 'Error al actualizar el registro.' });
      }
    },

    // Eliminar un registro
    delete: async (req, res) => {
      try {
        const { id } = req.params;
        const deletedRowsCount = await model.destroy({
          where: { id: id }
        });

        if (deletedRowsCount === 0) {
          return res.status(404).json({ error: 'Registro no encontrado para eliminar.' });
        }

        res.status(204).end(); // No Content
      } catch (error) {
        console.error('Error en GenericController.delete:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar el registro.' });
      }
    }
  };
};

module.exports = GenericController;