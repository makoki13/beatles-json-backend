// backend-beatles/models/Master.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Obra = require('./Obra'); // Importamos el modelo relacionado
const MasterCancion = require('./MasterCancion'); // Importamos el modelo relacionado

const Master = sequelize.define('Master', {
  obra_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser nulo si el master no está asociado a una obra específica
    references: {
      model: Obra, // 'Obra' aquí debe coincidir con el nombre del modelo definido en Sequelize
      key: 'id'
    },
    onDelete: 'SET NULL', // O 'CASCADE' si quieres borrar el master al borrar la obra
    onUpdate: 'CASCADE'
  },
  fecha: {
    type: DataTypes.DATE, // Usamos DATE para almacenar la fecha
    allowNull: true
  },
  matrix_number: {
    type: DataTypes.TEXT, // Usamos TEXT para el matrix number
    allowNull: true
  }
}, {
  tableName: 'masters',
  timestamps: false
});

// Definir asociaciones
// Master pertenece a una Obra
Master.belongsTo(Obra, { foreignKey: 'obra_id', as: 'obra' });

// Asociación M:N entre Master y MasterCancion a través de la tabla intermedia 'masters_master_canciones'
Master.belongsToMany(MasterCancion, {
  through: 'masters_master_canciones', // Nombre de la tabla intermedia
  foreignKey: 'master_id',           // Clave foránea para Master en la tabla intermedia
  otherKey: 'master_cancion_id',     // Clave foránea para MasterCancion en la tabla intermedia
  as: 'master_canciones'             // Alias para la asociación
});

MasterCancion.belongsToMany(Master, {
  through: 'masters_master_canciones',
  foreignKey: 'master_cancion_id',
  otherKey: 'master_id',
  as: 'masters' // Alias para la asociación inversa
});

module.exports = Master;