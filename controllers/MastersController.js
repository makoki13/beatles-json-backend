// backend-beatles/controllers/MastersController.js
const Master = require('../models/Master');
const Obra = require('../models/Obra');
const Cancion = require('../models/Cancion')
const MasterCancion = require('../models/MasterCancion');

const { convertirCadenasVaciasANull } = require('../utils/utilidades');
const { Op } = require('sequelize');
const sequelize = require('../config/database'); // Importa la instancia

const MastersMasterCancion = require('../models/MastersMasterCancion'); // Asegúrate de crear este modelo


const MastersController = {
  // Obtener todos los masters con datos de obra y master_canciones (opcional)
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
            attributes: ['id', 'titulo']
          },
          {
            model: MasterCancion,
            as: 'master_canciones',
            attributes: ['id', 'descripcion', 'duracion'],
            through: { attributes: [] }, // No incluir campos de la tabla intermedia en la respuesta JSON
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
      res.status(200).json(masters);
    } catch (error) {
      console.error('Error en MastersController.getAll:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener los masters.' });
    }
  },

  // Obtener un master por ID con datos de obra y master_canciones (opcional)
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

      if (datosMaster.id) {
          delete datosMaster.id;
      }
      // Extrae master_canciones_ids
      const masterCancionesIds = datosMaster.master_canciones_ids || [];
      delete datosMaster.master_canciones_ids;

      console.log("DEBUG: Datos para crear Master:", datosMaster); // Log
      console.log("DEBUG: IDs de MasterCanciones a asociar:", masterCancionesIds); // Log

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

        console.log("DEBUG: MasterCanciones encontradas para asociar:", masterCancionesExistentes.map(mc => mc.id)); // Log

        if (masterCancionesExistentes.length !== masterCancionesIds.length) {
          const idsSolicitados = new Set(masterCancionesIds);
          const idsEncontrados = new Set(masterCancionesExistentes.map(mc => mc.id));
          const idsNoEncontrados = [...idsSolicitados].filter(id => !idsEncontrados.has(id));
          throw new Error(`Una o más master_canciones no existen: ${idsNoEncontrados.join(', ')}`);
        }

        // Crear registros en la tabla intermedia masters_master_canciones
        const registrosParaCrear = masterCancionesExistentes.map(mc => ({
          master_id: nuevoMaster.id,
          master_cancion_id: mc.id
        }));

        // --- CAMBIO AQUÍ: Usar setMaster_canciones en lugar de addMaster_canciones ---
        // Asociar las master_canciones al master (reemplaza la lista actual)

        console.log('nuevoMaster', nuevoMaster)

        //await nuevoMaster.setMaster_canciones(masterCancionesExistentes, { transaction });
        await MastersMasterCancion.bulkCreate(registrosParaCrear, { transaction });

        console.log("DEBUG: Asociación setMaster_canciones ejecutada."); // Log
        // --- FIN CAMBIO ---
      } else {
         console.log("DEBUG: No se proporcionaron IDs de MasterCanciones para asociar."); // Log
      }

      await transaction.commit();
      console.log("DEBUG: Transacción COMMITTED."); // Log

      // Volver a obtener el master con las asociaciones
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
            through: { attributes: [] }, // No incluir campos de la tabla intermedia en la respuesta JSON
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

      console.log("DEBUG: Master devuelto con asociaciones:", masterCreado.id, "master_canciones:", masterCreado.master_canciones.map(mc => mc.id)); // Log
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

      if (datosParaActualizar.id) {
          delete datosParaActualizar.id;
      }
      // Extrae master_canciones_ids
      const masterCancionesIds = datosParaActualizar.master_canciones_ids || [];
      delete datosParaActualizar.master_canciones_ids;

      console.log("DEBUG UPDATE: Datos para actualizar Master ID:", id, datosParaActualizar); // Log
      console.log("DEBUG UPDATE: IDs de MasterCanciones a asociar:", masterCancionesIds); // Log

      const [updatedRowsCount] = await Master.update(datosParaActualizar, {
        where: { id: id },
        transaction
      });

      if (updatedRowsCount === 0) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Master no encontrado para actualizar.' });
      }

      // Actualizar asociaciones de master_canciones
      // --- CAMBIO AQUÍ: Actualizar manualmente la tabla intermedia ---
      // Primero, eliminar todas las asociaciones actuales para este master
      await MastersMasterCancion.destroy({
        where: { master_id: id },
        transaction
      });
      console.log("DEBUG UPDATE: Asociaciones anteriores eliminadas."); // Log


      // Asociar master_canciones si se proporcionaron
      if (masterCancionesIds.length >= 0) { // Siempre se actualiza la lista, incluso si es vacía
        if (masterCancionesIds.length > 0) {
          const masterCancionesExistentes = await MasterCancion.findAll({
            where: {
              id: { [Op.in]: masterCancionesIds }
            },
            transaction
          });

          console.log("DEBUG UPDATE: MasterCanciones encontradas para asociar:", masterCancionesExistentes.map(mc => mc.id)); // Log

          if (masterCancionesExistentes.length !== masterCancionesIds.length) {
            const idsSolicitados = new Set(masterCancionesIds);
            const idsEncontrados = new Set(masterCancionesExistentes.map(mc => mc.id));
            const idsNoEncontrados = [...idsSolicitados].filter(id => !idsEncontrados.has(id));
            throw new Error(`Una o más master_canciones no existen: ${idsNoEncontrados.join(', ')}`);
          }

          // --- CAMBIO AQUÍ: Usar setMaster_canciones en lugar de add/remove individuales ---
          // Reemplazar las asociaciones actuales con las nuevas
          await Master.findByPk(id, { transaction }).then(master => {
             if (master) {
               return master.setMaster_canciones(masterCancionesExistentes, { transaction });
             }
          });
          console.log("DEBUG UPDATE: Asociación setMaster_canciones ejecutada con lista nueva."); // Log
        } else {
          // Si la lista es vacía, simplemente desasocia todas
          await Master.findByPk(id, { transaction }).then(master => {
             if (master) {
               return master.setMaster_canciones([], { transaction });
             }
          });
          console.log("DEBUG UPDATE: Asociación setMaster_canciones ejecutada con lista vacía."); // Log
        }
      }

      await transaction.commit();
      console.log("DEBUG UPDATE: Transacción COMMITTED."); // Log

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

  // Eliminar un master
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