// backend-beatles/models/Obra.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Obra = sequelize.define('Obra', {
  titulo: {
    type: DataTypes.TEXT, // Usamos TEXT como en la definición de la tabla
    allowNull: false // No puede ser nulo
  },
  oficial: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Valor por defecto como en la tabla
  }
}, {
  tableName: 'obras', // Nombre de la tabla en PostgreSQL
  timestamps: false // Si no tienes columnas created_at, updated_at
});

module.exports = Obra;