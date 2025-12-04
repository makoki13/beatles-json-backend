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
  timestamps: false,
  toJSON: function() {
    const values = this.get({ plain: true });
    // Aplica la lógica de formateo de duración si es necesario aquí también
    // si esperas recibir master_canciones en el JSON del Master.
    // Aunque generalmente se formatea en el modelo MasterCancion.
    return values;
  }
});

Master.associate = (models) => {
  Master.belongsTo(models.Obra, { foreignKey: 'obra_id', as: 'obra' });
  Master.belongsToMany(models.MasterCancion, {
    through: 'masters_master_canciones',
    foreignKey: 'master_id',
    otherKey: 'master_cancion_id',
    as: 'master_canciones'
  });
};

module.exports = Master;