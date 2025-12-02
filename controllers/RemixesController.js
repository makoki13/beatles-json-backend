// backend-beatles/controllers/RemixesController.js
const { Op } = require('sequelize');

const Remix = require('../models/Remix');
const Cancion = require('../models/Cancion');
const Sesion = require('../models/Sesion');
const Grabacion = require('../models/Grabacion');
const Estudio = require('../models/Estudio'); // Importamos Estudio para validar tomas_ids
const sequelize = require('../config/database'); 
const { convertirCadenasVaciasANull } = require('../utils/utilidades');

const RemixesController = {
  // Obtener todas las mezclas con datos de canción y sesión (opcional)
  getAll: async (req, res) => {
    try {
      const { sort = 'id', order = 'ASC' } = req.query;
      const orderArray = [[sort, order.toUpperCase()]];

      const remixes = await Remix.findAll({
        order: orderArray,
        include: [ // Incluir datos de las tablas relacionadas
          {
            model: Cancion,
            as: 'cancion',
            attributes: ['id', 'nombre'] // Seleccionar solo campos necesarios
          },
          {
            model: Sesion,
            as: 'sesion',
            attributes: ['id', 'descripcion'] // Seleccionar solo campos necesarios
          }
        ]
      });
      res.status(200).json(remixes);
    } catch (error) {
      console.error('Error en RemixesController.getAll:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener las mezclas.' });
    }
  },

  // Obtener una mezcla por ID con datos de canción y sesión (opcional)
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const remix = await Remix.findByPk(id, {
        include: [
          {
            model: Cancion,
            as: 'cancion',
            attributes: ['id', 'nombre']
          },
          {
            model: Sesion,
            as: 'sesion',
            attributes: ['id', 'descripcion']
          }
        ]
      });
      if (!remix) {
        return res.status(404).json({ error: 'Mezcla no encontrada.' });
      }
      res.status(200).json(remix);
    } catch (error) {
      console.error('Error en RemixesController.getById:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener la mezcla.' });
    }
  },

  // Crear una nueva mezcla
  create: async (req, res) => {
    const transaction = await sequelize.transaction(); // Usamos transacciones para asegurar consistencia
    try {
      let datosMezcla = convertirCadenasVaciasANull(req.body);

      // Elimina id si está presente (debería ser autoincremental)
      if (datosMezcla.id) {
          delete datosMezcla.id;
      }

      // Validar tomas_ids: Deben ser IDs de grabaciones que existan en la tabla Estudio
      // y cuya grabación asociada esté relacionada con la canción del remix.
      const tomasIds = datosMezcla.tomas_ids || [];
      if (tomasIds.length > 0) {
        // Buscar las grabaciones correspondientes a tomasIds
        const grabacionesToma = await Grabacion.findAll({
          where: {
            id: tomasIds
          },
          attributes: ['id', 'cancion_id'], // Solo necesitamos id y cancion_id
          transaction // Usar la transacción
        });

        // Verificar que todas las tomas solicitadas existan
        const idsEncontrados = grabacionesToma.map(g => g.id);
        const idsNoEncontrados = tomasIds.filter(id => !idsEncontrados.includes(id));
        if (idsNoEncontrados.length > 0) {
          throw new Error(`Una o más grabaciones para las tomas no existen: ${idsNoEncontrados.join(', ')}`);
        }

        // Verificar que todas las grabaciones de toma estén relacionadas con la canción del remix
        const cancionIdMezcla = datosMezcla.cancion_id;
        
        // ANTES (incorrecto para instancias de modelo de Sequelize)
        //const tomasConCancionCorrecta = grabacionesToma.filter(g => g.cancion_id === cancionIdMezcla);
        // DESPUÉS (correcto para instancias de modelo de Sequelize)
        // DESPUÉS (accediendo directamente a dataValues)
        //const tomasConCancionCorrecta = grabacionesToma.filter(g => g.dataValues.cancion_id === cancionIdMezcla);
        // Modificamos la línea para incluir un console.log
        // DESPUÉS: Convertir cancionIdMezcla a número antes de la comparación
      const tomasConCancionCorrecta = grabacionesToma.filter(g => {
        console.log("Valor de g.dataValues.cancion_id:", g.dataValues.cancion_id, "Tipo:", typeof g.dataValues.cancion_id);
        console.log("Valor de cancionIdMezcla:", cancionIdMezcla, "Tipo:", typeof cancionIdMezcla);
        const cancionIdMezclaNumero = parseInt(cancionIdMezcla, 10); // Convertir a entero
        const coincide = g.dataValues.cancion_id === cancionIdMezclaNumero; // Comparación estricta ahora debería funcionar
        console.log("¿Coinciden?", coincide);
        return coincide;
      });
        
        console.log(grabacionesToma, cancionIdMezcla)
        console.log(tomasConCancionCorrecta.length, tomasIds.length)
        
        if (tomasConCancionCorrecta.length !== tomasIds.length) {
          // Encontrar las tomas que tienen cancion_id diferente          
          const idsConCancionIncorrecta = grabacionesToma
            .filter(g => g.dataValues.cancion_id !== cancionIdMezcla) // <-- Cambia esta línea
            .map(g => g.dataValues.id);                             // <-- Y esta usando dataValues
          throw new Error(`Una o más grabaciones para las tomas no pertenecen a la canción especificada (${cancionIdMezcla}): ${idsConCancionIncorrecta.join(', ')}`);
        }

        // Verificar que esas grabaciones tengan un registro correspondiente en la tabla Estudio
        const idsGrabacionesToma = grabacionesToma.map(g => g.id);
        const estudiosToma = await Estudio.findAll({
          where: {
            id_grabacion: idsGrabacionesToma
          },
          attributes: ['id_grabacion'], // Solo necesitamos id_grabacion
          transaction // Usar la transacción
        });

        const idsEstudios = estudiosToma.map(e => e.id_grabacion);
        const idsSinEstudio = idsGrabacionesToma.filter(id => !idsEstudios.includes(id));
        if (idsSinEstudio.length > 0) {
           throw new Error(`Una o más grabaciones para las tomas no están registradas como Toma (no tienen entrada en la tabla Estudio): ${idsSinEstudio.join(', ')}`);
        }
      }

      // Crear la mezcla principal
      const nuevaMezcla = await Remix.create(datosMezcla, { transaction });

      await transaction.commit();

      // Volver a obtener la mezcla con las asociaciones para devolverla completa
      const mezclaCreada = await Remix.findByPk(nuevaMezcla.id, {
        include: [
          {
            model: Cancion,
            as: 'cancion',
            attributes: ['id', 'nombre']
          },
          {
            model: Sesion,
            as: 'sesion',
            attributes: ['id', 'descripcion']
          }
        ]
      });

      res.status(201).json(mezclaCreada);
    } catch (error) {
      await transaction.rollback(); // Revertir cambios si hay error
      console.error('Error en RemixesController.create:', error);
      res.status(400).json({ error: error.message || 'Error al crear la mezcla.' });
    }
  },

  // Actualizar una mezcla existente
  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      let datosParaActualizar = convertirCadenasVaciasANull(req.body);

      // No intentamos actualizar campos que no existen directamente en la tabla 'remixes'
      // como campos de otras entidades o lógica compleja aquí, a menos que sea necesario.
      // Eliminamos 'id' si está presente en los datos de actualización
      if (datosParaActualizar.id) {
          delete datosParaActualizar.id;
      }

      // Validar tomas_ids si se está actualizando
      const tomasIds = datosParaActualizar.tomas_ids || [];
      if (tomasIds.length > 0) {
        const grabacionesToma = await Grabacion.findAll({
          where: {
            id: tomasIds
          },
          attributes: ['id', 'cancion_id'],
          transaction
        });

        const idsEncontrados = grabacionesToma.map(g => g.id);
        const idsNoEncontrados = tomasIds.filter(id => !idsEncontrados.includes(id));
        if (idsNoEncontrados.length > 0) {
          throw new Error(`Una o más grabaciones para las tomas no existen: ${idsNoEncontrados.join(', ')}`);
        }

        // Obtener la mezcla actual para conocer su cancion_id
        const mezclaActual = await Remix.findByPk(id, { transaction });
        if (!mezclaActual) {
          await transaction.rollback();
          return res.status(404).json({ error: 'Mezcla no encontrada para actualizar.' });
        }

        const cancionIdMezcla = mezclaActual.cancion_id;
        const tomasConCancionCorrecta = grabacionesToma.filter(g => g.cancion_id === cancionIdMezcla);
        if (tomasConCancionCorrecta.length !== tomasIds.length) {
          const idsConCancionIncorrecta = grabacionesToma
            .filter(g => g.cancion_id !== cancionIdMezcla)
            .map(g => g.id);
          throw new Error(`Una o más grabaciones para las tomas no pertenecen a la canción especificada (${cancionIdMezcla}): ${idsConCancionIncorrecta.join(', ')}`);
        }

        const idsGrabacionesToma = grabacionesToma.map(g => g.id);
        const estudiosToma = await Estudio.findAll({
          where: {
            id_grabacion: idsGrabacionesToma
          },
          attributes: ['id_grabacion'],
          transaction
        });

        const idsEstudios = estudiosToma.map(e => e.id_grabacion);
        const idsSinEstudio = idsGrabacionesToma.filter(id => !idsEstudios.includes(id));
        if (idsSinEstudio.length > 0) {
           throw new Error(`Una o más grabaciones para las tomas no están registradas como Toma (no tienen entrada en la tabla Estudio): ${idsSinEstudio.join(', ')}`);
        }
      }

      const [updatedRowsCount] = await Remix.update(datosParaActualizar, {
        where: { id: id },
        transaction
      });

      if (updatedRowsCount === 0) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Mezcla no encontrada para actualizar.' });
      }

      const updatedItem = await Remix.findByPk(id, {
        include: [
          {
            model: Cancion,
            as: 'cancion',
            attributes: ['id', 'nombre']
          },
          {
            model: Sesion,
            as: 'sesion',
            attributes: ['id', 'descripcion']
          }
        ]
      });
      res.status(200).json(updatedItem);
    } catch (error) {
      await transaction.rollback();
      console.error('Error en RemixesController.update:', error);
      res.status(400).json({ error: error.message || 'Error al actualizar la mezcla.' });
    }
  },

  // Eliminar una mezcla
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedRowsCount = await Remix.destroy({
        where: { id: id }
      });

      if (deletedRowsCount === 0) {
        return res.status(404).json({ error: 'Mezcla no encontrada para eliminar.' });
      }

      res.status(204).end(); // No Content
    } catch (error) {
      console.error('Error en RemixesController.delete:', error);
      res.status(500).json({ error: 'Error interno del servidor al eliminar la mezcla.' });
    }
  },

  /* getTomasDisponibles: async (req, res) => {
    try {
      const { cancionId } = req.params;

      // Validar que cancionId sea un número
      const id = parseInt(cancionId, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de canción inválido.' });
      }

      const estudios = await Estudio.findAll({
          attributes: ['id_grabacion'],
          transaction: null // Asegúrate de no pasar una transacción si no es necesaria aquí
      });

      const idsDeEstudio = estudios.map(est => est.id_grabacion);
      
      const tomas = await Grabacion.findAll({
        where: {
          tipo: 'Toma', // Asumiendo que el tipo se almacena tal cual
          cancion_id: id,
          // Subconsulta para filtrar solo grabaciones que existen en Estudio
          id: {[sequelize.Op.in]: idsDeEstudio}
        },
        attributes: ['id', 'descripcion', 'fecha', 'lugar'], // Seleccionar campos relevantes de la grabación Toma
        include: [
          {
            model: Cancion,
            as: 'cancion',
            attributes: ['id', 'nombre']
          },
          {
            model: Sesion,
            as: 'sesion',
            attributes: ['id', 'descripcion']
          }
        ]
      });
      res.status(200).json(tomas);

    } catch (error) {
      console.error('Error en RemixesController.getTomasDisponibles:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener las tomas disponibles.' });
    }
  }
 */

    // --- Nueva Función: Obtener tomas disponibles para una canción (Versión Segura)---
  getTomasDisponibles: async (req, res) => {
    try {
      const { cancionId } = req.params;

      // Validar que cancionId sea un número
      const id = parseInt(cancionId, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de canción inválido.' });
      }

      // Paso 1: Obtener los IDs de grabaciones que están en la tabla Estudio
      const estudios = await Estudio.findAll({
          attributes: ['id_grabacion'],
          // transaction: null // No es necesaria una transacción aquí
      });
      const idsDeEstudio = estudios.map(est => est.id_grabacion);

      // Paso 2: Obtener grabaciones de tipo 'Toma' relacionadas con la canción
      // y cuyo ID esté en la lista de IDs de la tabla Estudio
      const tomas = await Grabacion.findAll({
          where: {
              tipo: 'Toma', // Asegúrate que el valor coincida exactamente con la base de datos
              cancion_id: id,
              id: { [Op.in]: idsDeEstudio } // <-- Usa Op.in
          },
          attributes: ['id', 'descripcion', 'fecha', 'lugar'] // Seleccionar campos relevantes
      });

      res.status(200).json(tomas);
    } catch (error) {
      console.error('Error en RemixesController.getTomasDisponibles:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener las tomas disponibles.' });
    }
  }
  // --- Fin Nueva Función ---

};

module.exports = RemixesController;