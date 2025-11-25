// backend-beatles/models/Demo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Grabacion = require('./Grabacion'); // Importamos el modelo principal

const Demo = sequelize.define('Demo', {
  id_grabacion: {
    type: DataTypes.INTEGER,
    primaryKey: true, // La PK es también FK
    references: {
      model: Grabacion, // 'Grabacion' aquí debe coincidir con el nombre del modelo definido en Sequelize
      key: 'id'
    },
    onDelete: 'CASCADE', // Si se borra la grabación, se borra la demo
    onUpdate: 'CASCADE'
  },
  estudio: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'demos',
  timestamps: false
});

// Asociación: Una Demo pertenece a una Grabacion
Demo.belongsTo(Grabacion, { foreignKey: 'id_grabacion', as: 'grabacion' });

module.exports = Demo;