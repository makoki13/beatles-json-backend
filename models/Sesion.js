// backend-beatles/models/Sesion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sesion = sequelize.define('Sesion', {
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true // Puede ser nulo si no hay descripción
  },
  lugar: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ciudad: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pais: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATE, // Usamos DATE para almacenar la fecha
    allowNull: true
  }
}, {
  tableName: 'sesiones', // Nombre de la tabla en PostgreSQL
  timestamps: false // Si no tienes columnas created_at, updated_at
});

module.exports = Sesion;