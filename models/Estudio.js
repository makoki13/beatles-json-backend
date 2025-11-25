// backend-beatles/models/Estudio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Grabacion = require('./Grabacion');

const Estudio = sequelize.define('Estudio', {
  id_grabacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Grabacion,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  tipo: {
    type: DataTypes.ENUM('Toma', 'Overdub', 'Toma+Overdub'),
    allowNull: false
  },
  ordinal: {
    type: DataTypes.INTEGER,
    allowNull: true // Puede ser nulo
  }
}, {
  tableName: 'estudios',
  timestamps: false
});

Estudio.belongsTo(Grabacion, { foreignKey: 'id_grabacion', as: 'grabacion' });

module.exports = Estudio;