// backend-beatles/models/Actuacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Grabacion = require('./Grabacion');

const Actuacion = sequelize.define('Actuacion', {
  id_grabacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Grabacion,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  tipo: {
    type: DataTypes.ENUM('Radio', 'Concierto', 'TV'),
    allowNull: false
  },
  ordinal: {
    type: DataTypes.INTEGER,
    allowNull: false // Asumimos que siempre tiene un ordinal
  }
}, {
  tableName: 'actuaciones',
  timestamps: false
});

 Actuacion.associate = (models) => {
  // Actuacion pertenece a una Grabacion
  console.log("joderrr")
  Actuacion.belongsTo(models.Grabacion, { // Usar 'models.Grabacion' como se pasa al llamar associate
    foreignKey: 'id_grabacion',
    as: 'grabacion' // Alias para la asociación
  });
};

//Actuacion.belongsTo(Grabacion, { foreignKey: 'id_grabacion', as: 'grabacion' });

module.exports = Actuacion;