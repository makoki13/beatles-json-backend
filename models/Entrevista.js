// backend-beatles/models/Entrevista.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Grabacion = require('./Grabacion');

const Entrevista = sequelize.define('Entrevista', {
  id_grabacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Grabacion,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
  // No tiene otros campos según la definición
}, {
  tableName: 'entrevistas',
  timestamps: false
});

Entrevista.belongsTo(Grabacion, { foreignKey: 'id_grabacion', as: 'grabacion' });

module.exports = Entrevista;