// backend-beatles/models/Publicacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Master = require('./Master'); // Importamos el modelo relacionado
const Discografica = require('./Discografica'); // Importamos el modelo relacionado

const Publicacion = sequelize.define('Publicacion', {
  master_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Asumiendo que siempre debe estar asociada a un master
    references: {
      model: Master, // 'Master' aquí debe coincidir con el nombre del modelo definido en Sequelize
      key: 'id'
    },
    onDelete: 'CASCADE', // O 'RESTRICT' si no quieres borrar la publicación al borrar el master
    onUpdate: 'CASCADE'
  },
  discografica_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser nulo si no está asociada a una discográfica específica
    references: {
      model: Discografica, // 'Discografica' aquí debe coincidir con el nombre del modelo definido en Sequelize
      key: 'id'
    },
    onDelete: 'SET NULL', // O 'CASCADE' si quieres borrar la publicación al borrar la discográfica
    onUpdate: 'CASCADE'
  },
  oficial: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Valor por defecto como en la tabla
  },
  formato: {
    type: DataTypes.TEXT, // Usamos TEXT como en la definición de la tabla
    allowNull: true // Puede ser nulo
  },
  pais: {
    type: DataTypes.TEXT, // Usamos TEXT como en la definición de la tabla
    allowNull: true // Puede ser nulo
  },
  fecha: {
    type: DataTypes.DATE, // Usamos DATE para almacenar la fecha
    allowNull: true // Puede ser nulo
  },
  label: {
    type: DataTypes.TEXT, // Usamos TEXT como en la definición de la tabla
    allowNull: true // Puede ser nulo
  },
  codigo_planta_prensado: {
    type: DataTypes.TEXT, // Usamos TEXT como en la definición de la tabla
    allowNull: true // Puede ser nulo
  }
}, {
  tableName: 'publicaciones',
  timestamps: false // Si no tienes columnas created_at, updated_at
});

// Definir asociaciones
// Publicacion pertenece a un Master
Publicacion.belongsTo(Master, { foreignKey: 'master_id', as: 'master' });
// Publicacion pertenece a una Discografica
Publicacion.belongsTo(Discografica, { foreignKey: 'discografica_id', as: 'discografica' });

module.exports = Publicacion;