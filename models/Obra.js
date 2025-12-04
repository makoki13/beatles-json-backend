// backend-beatles/models/Obra.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

console.log('Obras', sequelize);

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

Obra.associate = (models) => {
  // Definir la asociación: Una Obra tiene muchos Masters
  // La clave foránea 'obra_id' reside en la tabla 'masters'
  Obra.hasMany(models.Master, {
    foreignKey: 'obra_id', // El nombre del campo en la tabla 'masters'
    as: 'masters'          // El alias para acceder a los masters desde una instancia de Obra
  });
  // Por convención, Sequelize también generará el método inverso en Master
  // si defines Master.belongsTo(Obra, ...) en Master.js, lo cual es lo correcto.
};

module.exports = Obra;