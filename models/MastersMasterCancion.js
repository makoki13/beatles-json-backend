// backend-beatles/models/MastersMasterCancion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Master = require('./Master'); // Importar modelos relacionados si es necesario para claves foráneas
const MasterCancion = require('./MasterCancion');

const MastersMasterCancion = sequelize.define('MastersMasterCancion', {
  master_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Combinado con master_cancion_id para formar la clave primaria compuesta
    allowNull: false,
    references: {
      model: Master, // El modelo al que referencia
      key: 'id'
    },
    onDelete: 'CASCADE', // Opción recomendada para mantener integridad
    onUpdate: 'CASCADE'
  },
  master_cancion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Combinado con master_id para formar la clave primaria compuesta
    allowNull: false,
    references: {
      model: MasterCancion, // El modelo al que referencia
      key: 'id'
    },
    onDelete: 'CASCADE', // Opción recomendada para mantener integridad
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'masters_master_canciones', // Nombre exacto de la tabla en la DB
  timestamps: false // No suele tener created_at, updated_at
  // indexes: [{ unique: true, fields: ['master_id', 'master_cancion_id'] }] // Normalmente la PK es única implícitamente
});

// Opcional: Definir asociaciones aquí si se van a usar (no es común para tablas intermedias puras)
// MastersMasterCancion.belongsTo(Master, { foreignKey: 'master_id', as: 'master' });
// MastersMasterCancion.belongsTo(MasterCancion, { foreignKey: 'master_cancion_id', as: 'master_cancion' });

module.exports = MastersMasterCancion;