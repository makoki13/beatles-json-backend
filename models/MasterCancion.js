// backend-beatles/models/MasterCancion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cancion = require('./Cancion'); // Importamos el modelo relacionado

const MasterCancion = sequelize.define('MasterCancion', {
  cancion_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser nulo si la master canción no está asociada a una canción específica de la tabla 'canciones'
    references: {
      model: Cancion, // 'Cancion' aquí debe coincidir con el nombre del modelo definido en Sequelize
      key: 'id'
    },
    onDelete: 'SET NULL', // O 'CASCADE' si quieres borrar la master_cancion al borrar la canción
    onUpdate: 'CASCADE'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duracion: {
    // Usamos STRING para manejar intervalos o HH:MM:SS, o DataTypes.INTERVAL si se usa directamente
    type: DataTypes.STRING, // Considera DataTypes.INTERVAL si usas PostgreSQL directamente
    allowNull: true
  }
}, {
  tableName: 'master_canciones',
  timestamps: false
});

// Definir asociaciones
// MasterCancion pertenece a una Cancion
MasterCancion.belongsTo(Cancion, { foreignKey: 'cancion_id', as: 'cancion' });

module.exports = MasterCancion;