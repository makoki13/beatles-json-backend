// backend-beatles/models/Personaje.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que la ruta sea correcta

const Personaje = sequelize.define('Personaje', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_nacimiento: {
    type: DataTypes.DATE
  },
  lugar_nacimiento: {
    type: DataTypes.STRING
  },
  fecha_fallecimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lugar_fallecimiento: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'personajes', // Nombre de la tabla en PostgreSQL
  timestamps: false // Si no tienes columnas created_at, updated_at
});

module.exports = Personaje;