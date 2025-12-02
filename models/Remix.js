// backend-beatles/models/Remix.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cancion = require('./Cancion'); // Importamos el modelo relacionado
const Sesion = require('./Sesion'); // Importamos el modelo relacionado
// Nota: No necesitamos importar Estudio aquí para la definición del modelo,
// pero sí lo usaremos en el controlador para manejar tomas_ids.

const Remix = sequelize.define('Remix', {
  cancion_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser nulo si no está asociada a una canción
    references: {
      model: Cancion, // 'Cancion' aquí debe coincidir con el nombre del modelo definido en Sequelize
      key: 'id'
    },
    onDelete: 'SET NULL', // O 'CASCADE' si quieres borrar el remix al borrar la canción
    onUpdate: 'CASCADE'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // tomas_ids: Array de IDs de grabaciones (que corresponden a tomas en la tabla Estudio)
  // Sequelize puede manejar arrays de integers con DataTypes.ARRAY(DataTypes.INTEGER)
  tomas_ids: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true // Puede ser nulo si no hay tomas asociadas aún
  },
  sesion_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser nulo si no está asociada a una sesión
    references: {
      model: Sesion,
      key: 'id'
    },
    onDelete: 'SET NULL', // O 'CASCADE' si quieres borrar el remix al borrar la sesión
    onUpdate: 'CASCADE'
  },
  duracion: {
    // PostgreSQL tiene INTERVAL. En Sequelize puedes usar DataTypes.INTERVAL
    // o guardarla como STRING en formato HH:MM:SS o como número de segundos.
    // Usaremos STRING para simplificar por ahora, pero INTERVAL es más preciso para duraciones.
    type: DataTypes.STRING, // Considera DataTypes.INTERVAL si usas PostgreSQL directamente
    allowNull: true
  },
  publicada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Valor por defecto como en la tabla
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'remixes',
  timestamps: false
});

// Definir asociaciones
// Remix pertenece a una Cancion
Remix.belongsTo(Cancion, { foreignKey: 'cancion_id', as: 'cancion' });
// Remix pertenece a una Sesion
Remix.belongsTo(Sesion, { foreignKey: 'sesion_id', as: 'sesion' });

module.exports = Remix;