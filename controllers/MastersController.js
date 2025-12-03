// backend-beatles/controllers/MastersController.js
const Master = require('../models/Master');
const Obra = require('../models/Obra');
const MasterCancion = require('../models/MasterCancion');
const Cancion = require('../models/Cancion')

const { convertirCadenasVaciasANull } = require('../utils/utilidades');
const { Op } = require('sequelize'); // Importa Op
const sequelize = require('../config/database'); // Importa la instancia

const MastersController = {
  // Obtener todos los masters con datos de obra (opcional)
  // Incluir también las master_canciones asociadas si es necesario para listarlas de una vez
  getAll: async (req, res) => {
    try {
      const { sort = 'id', order = 'ASC' } = req.query;
      const orderArray = [[sort, order.toUpperCase()]];

      const masters = await Master.findAll({
        order: orderArray,
        include: [
          {
            model: Obra,
            as: 'obra',
            attributes: ['id', 'titulo'] // Seleccionar solo campos necesarios
          },
          {
            model: MasterCancion,
            as: 'master_canciones',
            attributes: ['id', 'descripcion', 'duracion'], // Seleccionar campos de MasterCancion
            through: { attributes: [] }, // No incluir campos de la tabla intermedia
            include: [ // Incluir datos de la canción original si se desea
              {
                model: Cancion,
                as: 'cancion',
                attributes: ['id', 'nombre']
              }
            ]
          }
        ]
      });
      res.status(200).json(masters);
    } catch (error) {
      console.error('Error en MastersController.getAll:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener los masters.' });
    }
  },

  // Obtener un master por ID con datos de obra y master_canciones
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const master = await Master.findByPk(id, {
        include: [
          {
            model: Obra,
            as: 'obra',
            attributes: ['id', 'titulo']
          },
          {
            model: MasterCancion,
            as: 'master_canciones',
            attributes: ['id', 'descripcion', 'duracion'],
            through: { attributes: [] },
            include: [
              {
                model: Cancion,
                as: 'cancion',
                attributes: ['id', 'nombre']
              }
            ]
          }
        ]
      });
      if (!master) {
        return res.status(404).json({ error: 'Master no encontrado.' });
      }
      res.status(200).json(master);
    } catch (error) {
      console.error('Error en MastersController.getById:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener el master.' });
    }
  },

  // Crear un nuevo master y opcionalmente asociar master_canciones
  create: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      let datosMaster = convertirCadenasVaciasANull(req.body);

      // Elimina id si está presente (debería ser autoincremental)
      if (datosMaster.id) {
          delete datosMaster.id;
      }
      // Extrae master_canciones_ids si están presentes
      const masterCancionesIds = datosMaster.master_canciones_ids || [];
      delete datosMaster.master_canciones_ids; // No es un campo directo de Master

      // Crear el master principal
      const nuevoMaster = await Master.create(datosMaster, { transaction });

      // Asociar master_canciones si se proporcionaron
      if (masterCancionesIds.length > 0) {
        // Verificar que las master_canciones existan
        const masterCancionesExistentes = await MasterCancion.findAll({
          where: {
            id: { [Op.in]: masterCancionesIds }
          },
          transaction
        });

        if (masterCancionesExistentes.length !== masterCancionesIds.length) {
          const idsSolicitados = new Set(masterCancionesIds);
          const idsEncontrados = new Set(masterCancionesExistentes.map(mc => mc.id));
          const idsNoEncontrados = [...idsSolicitados].filter(id => !idsEncontrados.has(id));
          throw new Error(`Una o más master_canciones no existen: ${idsNoEncontrados.join(', ')}`);
        }

        // Asociar las master_canciones al master
        await nuevoMaster.addMaster_canciones(masterCancionesExistentes, { transaction });
      }

      await transaction.commit();

      // Volver a obtener el master con las asociaciones para devolverlo completo
      const masterCreado = await Master.findByPk(nuevoMaster.id, {
        include: [
          {
            model: Obra,
            as: 'obra',
            attributes: ['id', 'titulo']
          },
          {
            model: MasterCancion,
            as: 'master_canciones',
            attributes: ['id', 'descripcion', 'duracion'],
            through: { attributes: [] },
            include: [
              {
                model: Cancion,
                as: 'cancion',
                attributes: ['id', 'nombre']
              }
            ]
          }
        ]
      });

      res.status(201).json(masterCreado);
    } catch (error) {
      await transaction.rollback();
      console.error('Error en MastersController.create:', error);
      res.status(400).json({ error: error.message || 'Error al crear el master.' });
    }
  },

  // Actualizar un master existente y sus master_canciones asociadas
  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      let datosParaActualizar = convertirCadenasVaciasANull(req.body);

      // Elimina id si está presente en los datos de actualización
      if (datosParaActualizar.id) {
          delete datosParaActualizar.id;
      }
      // Extrae master_canciones_ids si están presentes
      const masterCancionesIds = datosParaActualizar.master_canciones_ids || [];
      delete datosParaActualizar.master_canciones_ids; // No es un campo directo de Master

      // Actualizar el master principal
      const [updatedRowsCount] = await Master.update(datosParaActualizar, {
        where: { id: id },
        transaction
      });

      if (updatedRowsCount === 0) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Master no encontrado para actualizar.' });
      }

      // Actualizar asociaciones de master_canciones
      if (masterCancionesIds.length >= 0) { // Siempre se actualiza la lista, incluso si es vacía
        // Verificar que las master_canciones existan
        if (masterCancionesIds.length > 0) {
          const masterCancionesExistentes = await MasterCancion.findAll({
            where: {
              id: { [Op.in]: masterCancionesIds }
            },
            transaction
          });

          if (masterCancionesExistentes.length !== masterCancionesIds.length) {
            const idsSolicitados = new Set(masterCancionesIds);
            const idsEncontrados = new Set(masterCancionesExistentes.map(mc => mc.id));
            const idsNoEncontrados = [...idsSolicitados].filter(id => !idsEncontrados.has(id));
            throw new Error(`Una o más master_canciones no existen: ${idsNoEncontrados.join(', ')}`);
          }

          // Reemplazar las asociaciones actuales con las nuevas
          await Master.findByPk(id, { transaction }).then(master => {
             if (master) {
               return master.setMaster_canciones(masterCancionesExistentes, { transaction });
             }
          });
        } else {
          // Si la lista es vacía, simplemente desasocia todas
          await Master.findByPk(id, { transaction }).then(master => {
             if (master) {
               return master.setMaster_canciones([], { transaction });
             }
          });
        }
      }

      await transaction.commit();

      const updatedItem = await Master.findByPk(id, {
        include: [
          {
            model: Obra,
            as: 'obra',
            attributes: ['id', 'titulo']
          },
          {
            model: MasterCancion,
            as: 'master_canciones',
            attributes: ['id', 'descripcion', 'duracion'],
            through: { attributes: [] },
            include: [
              {
                model: Cancion,
                as: 'cancion',
                attributes: ['id', 'nombre']
              }
            ]
          }
        ]
      });
      res.status(200).json(updatedItem);
    } catch (error) {
      await transaction.rollback();
      console.error('Error en MastersController.update:', error);
      res.status(400).json({ error: error.message || 'Error al actualizar el master.' });
    }
  },

  // Eliminar un master (esto eliminará también las entradas en masters_master_canciones por CASCADE)
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedRowsCount = await Master.destroy({
        where: { id: id }
      });

      if (deletedRowsCount === 0) {
        return res.status(404).json({ error: 'Master no encontrado para eliminar.' });
      }

      res.status(204).end(); // No Content
    } catch (error) {
      console.error('Error en MastersController.delete:', error);
      res.status(500).json({ error: 'Error interno del servidor al eliminar el master.' });
    }
  }
};

module.exports = MastersController;