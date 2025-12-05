// backend-beatles/models/Discografica.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Discografica = sequelize.define('Discografica', {
  nombre: {
    type: DataTypes.TEXT, // Usamos TEXT como en la definición de la tabla
    allowNull: false // No puede ser nulo
  },
  descripcion: {
    type: DataTypes.TEXT, // Usamos TEXT
    allowNull: true // Puede ser nulo
  },
  pais: {
    type: DataTypes.TEXT, // Usamos TEXT
    allowNull: true // Puede ser nulo
  }
}, {
  tableName: 'discograficas', // Nombre de la tabla en PostgreSQL
  timestamps: false // Si no tienes columnas created_at, updated_at
});

module.exports = Discografica;