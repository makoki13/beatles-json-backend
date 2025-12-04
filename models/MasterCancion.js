// backend-beatles/models/MasterCancion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cancion = require('./Cancion'); // Importamos el modelo relacionado
const Master = require('./Master');

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
  timestamps: false,
  toJSON: function() {
    const values = this.get({ plain: true });
    if (values.duracion && typeof values.duracion === 'object' && values.duracion.hours !== undefined) {
      const signo = values.duracion.hours < 0 ? '-' : '';
      const horasAbs = Math.abs(values.duracion.hours);
      const minutos = values.duracion.minutes || 0;
      const segundos = values.duracion.seconds || 0;
      values.duracion = `${signo}${horasAbs.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }
    return values;
  }
});

// Definir asociaciones
// MasterCancion pertenece a una Cancion
MasterCancion.belongsTo(Cancion, { foreignKey: 'cancion_id', as: 'cancion' });

MasterCancion.belongsToMany(Master, {
  through: 'masters_master_canciones',
  foreignKey: 'master_cancion_id', // La FK en la tabla intermedia que apunta a MasterCancion
  otherKey: 'master_id',          // La FK en la tabla intermedia que apunta a Master
  as: 'masters'                   // Alias para la asociación inversa
});

module.exports = MasterCancion;