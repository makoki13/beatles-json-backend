// backend-beatles-api/models/Cancion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cancion = sequelize.define('Cancion', {
  nombre: {
    type: DataTypes.TEXT, // Usamos TEXT como en la definición de la tabla
    allowNull: false
  },
  nombres_alternativos: {
    type: DataTypes.ARRAY(DataTypes.TEXT), // Campo ARRAY de TEXT
    allowNull: true // Asumiendo que puede ser nulo si no hay alternativos
  },
  hay_grabacion: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Valor por defecto como en la tabla
  }
}, {
  tableName: 'canciones', // Nombre de la tabla en PostgreSQL
  timestamps: false // Si no tienes columnas created_at, updated_at
});

module.exports = Cancion;