// backend-beatles/controllers/GrabacionesController.js
const Grabacion = require('../models/Grabacion');
const Cancion = require('../models/Cancion');
const Sesion = require('../models/Sesion');
const Demo = require('../models/Demo');
const Estudio = require('../models/Estudio');
const Actuacion = require('../models/Actuacion');
const Entrevista = require('../models/Entrevista');
const sequelize = require('../config/database');
const { convertirCadenasVaciasANull } = require('../utils/utilidades');

const GrabacionesController = {
  // Obtener todas las grabaciones con datos de canción y sesión (opcional)
  getAll: async (req, res) => {
    try {
      const { sort = 'id', order = 'ASC' } = req.query;
      const orderArray = [[sort, order.toUpperCase()]];

      const grabaciones = await Grabacion.findAll({
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
      res.status(200).json(grabaciones);
    } catch (error) {
      console.error('Error en GrabacionesController.getAll:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener las grabaciones.' });
    }
  },

  // Obtener una grabación por ID con datos de canción y sesión (opcional)
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const grabacion = await Grabacion.findByPk(id, {
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
      if (!grabacion) {
        return res.status(404).json({ error: 'Grabación no encontrada.' });
      }
      res.status(200).json(grabacion);
    } catch (error) {
      console.error('Error en GrabacionesController.getById:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener la grabación.' });
    }
  },

  // Crear una nueva grabación y su registro específico si aplica
  create: async (req, res) => {
    const transaction = await sequelize.transaction(); // Usamos transacciones para asegurar consistencia
    try {
      let datosGrabacion = convertirCadenasVaciasANull(req.body);

      // Eliminar campos específicos del tipo de grabación del objeto principal antes de crear la grabación
      const tipo = datosGrabacion.tipo;
      const datosTipo = {}; // Almacenará datos específicos para la tabla secundaria

      if (tipo === 'Demo') {
        datosTipo.estudio = datosGrabacion.estudio || false; // Extrae 'estudio' del body
        delete datosGrabacion.estudio; // Elimina del objeto principal
      } else if (tipo === 'Toma') {
        datosTipo.tipo_estudio = datosGrabacion.tipo_estudio; // Extrae 'tipo_estudio'
        datosTipo.ordinal = datosGrabacion.ordinal; // Extrae 'ordinal' (puede ser null)
        delete datosGrabacion.tipo_estudio; // Elimina del objeto principal
        delete datosGrabacion.ordinal;
      } else if (tipo === 'Actuación') {
        datosTipo.tipo_actuacion = datosGrabacion.tipo_actuacion; // Extrae 'tipo_actuacion'
        datosTipo.ordinal = datosGrabacion.ordinal_actuacion; // Extrae 'ordinal_actuacion' (no puede ser null según el modelo)
        delete datosGrabacion.tipo_actuacion; // Elimina del objeto principal
        delete datosGrabacion.ordinal_actuacion;
      } // Para 'Entrevista', no hay campos específicos extras en este ejemplo

      // Elimina id si está presente (debería ser autoincremental)
      if (datosGrabacion.id) {
          delete datosGrabacion.id;
      }

      // Crear la grabación principal
      const nuevaGrabacion = await Grabacion.create(datosGrabacion, { transaction });

      // Crear el registro específico según el tipo
      if (tipo === 'Demo') {
        await Demo.create({
          id_grabacion: nuevaGrabacion.id,
          estudio: datosTipo.estudio
        }, { transaction });
      } else if (tipo === 'Toma') {
        await Estudio.create({
          id_grabacion: nuevaGrabacion.id,
          tipo: datosTipo.tipo_estudio,
          ordinal: datosTipo.ordinal
        }, { transaction });
      } else if (tipo === 'Actuación') {
        await Actuacion.create({
          id_grabacion: nuevaGrabacion.id,
          tipo: datosTipo.tipo_actuacion,
          ordinal: datosTipo.ordinal
        }, { transaction });
      } else if (tipo === 'Entrevista') {
        await Entrevista.create({
          id_grabacion: nuevaGrabacion.id
        }, { transaction });
      }

      await transaction.commit();

      // Volver a obtener la grabación con las asociaciones para devolverla completa
      const grabacionCreada = await Grabacion.findByPk(nuevaGrabacion.id, {
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

      res.status(201).json(grabacionCreada);
    } catch (error) {
      await transaction.rollback(); // Revertir cambios si hay error
      console.error('Error en GrabacionesController.create:', error);
      res.status(400).json({ error: error.message || 'Error al crear la grabación.' });
    }
  },

  // Actualizar una grabación existente y su registro específico si aplica
  // La actualización es más compleja porque implica posiblemente borrar el registro específico anterior
  // y crear uno nuevo si cambia el tipo. Por simplicidad en este ejemplo, asumiremos que el 'tipo'
  // no cambia durante la actualización, o que se manejará como una operación separada (borrar y crear).
  // Este es un caso de uso más avanzado.
  update: async (req, res) => {
    // NOTA: La actualización de tipo y sus tablas secundarias es compleja.
    // Por ahora, actualizamos solo la tabla 'grabaciones'.
    // Si el tipo cambia, se debería borrar el registro de la tabla secundaria anterior
    // y crear uno nuevo en la nueva tabla secundaria, posiblemente en una transacción.
    // Este escenario se omite en esta implementación básica.
    // Se podría ofrecer una API específica para cambiar solo el tipo y migrar datos si es necesario.
    try {
        const { id } = req.params;
        let datosParaActualizar = convertirCadenasVaciasANull(req.body);

        // No intentamos actualizar campos del tipo aquí, asumimos que no cambia o se maneja aparte
        // Eliminamos campos específicos del tipo que podrían estar en req.body
        delete datosParaActualizar.tipo_estudio;
        delete datosParaActualizar.ordinal;
        delete datosParaActualizar.tipo_actuacion;
        delete datosParaActualizar.ordinal_actuacion;
        delete datosParaActualizar.estudio;

        const [updatedRowsCount] = await Grabacion.update(datosParaActualizar, {
          where: { id: id }
        });

        if (updatedRowsCount === 0) {
          return res.status(404).json({ error: 'Grabación no encontrada para actualizar.' });
        }

        const updatedItem = await Grabacion.findByPk(id, {
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
        console.error('Error en GrabacionesController.update:', error);
        res.status(400).json({ error: error.message || 'Error al actualizar la grabación.' });
      }
  },

  // Eliminar una grabación y sus registros específicos
  delete: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;

      // Primero, obtenemos la grabación para saber su tipo
      const grabacion = await Grabacion.findByPk(id);
      if (!grabacion) {
        await transaction.commit();
        return res.status(404).json({ error: 'Grabación no encontrada para eliminar.' });
      }

      const tipo = grabacion.tipo;

      // Eliminar el registro específico según el tipo
      if (tipo === 'Demo') {
        await Demo.destroy({ where: { id_grabacion: id } }, { transaction });
      } else if (tipo === 'Toma') {
        await Estudio.destroy({ where: { id_grabacion: id } }, { transaction });
      } else if (tipo === 'Actuación') {
        await Actuacion.destroy({ where: { id_grabacion: id } }, { transaction });
      } else if (tipo === 'Entrevista') {
        await Entrevista.destroy({ where: { id_grabacion: id } }, { transaction });
      }

      // Luego, eliminar la grabación principal
      const deletedRowsCount = await Grabacion.destroy({
        where: { id: id }
      }, { transaction });

      if (deletedRowsCount === 0) {
        // Esto no debería ocurrir si la grabación existía, pero por si acaso
        await transaction.commit();
        return res.status(404).json({ error: 'Grabación no encontrada para eliminar.' });
      }

      await transaction.commit();
      res.status(204).end(); // No Content
    } catch (error) {
      await transaction.rollback();
      console.error('Error en GrabacionesController.delete:', error);
      res.status(500).json({ error: 'Error interno del servidor al eliminar la grabación.' });
    }
  }
};

module.exports = GrabacionesController;