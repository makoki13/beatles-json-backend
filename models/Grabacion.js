// backend-beatles-api/models/Grabacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cancion = require('./Cancion'); // Importamos el modelo relacionado
const Sesion = require('./Sesion'); // Importamos el modelo relacionado

const Grabacion = sequelize.define('Grabacion', {
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancion_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser nulo si no está asociada a una canción
    references: {
      model: Cancion, // 'Cancion' aquí debe coincidir con el nombre del modelo definido en Sequelize
      key: 'id'
    },
    onDelete: 'SET NULL', // O 'CASCADE' si quieres borrar la grabación al borrar la canción
    onUpdate: 'CASCADE'
  },
  tipo: {
    type: DataTypes.ENUM('Demo', 'Toma', 'Actuación', 'Entrevista'), // Usamos ENUM para limitar los valores
    allowNull: false
  },
  duracion: {
    // Para duración, PostgreSQL tiene INTERVAL. En Sequelize puedes usar DataTypes.INTERVAL
    // o guardarla como STRING en formato HH:MM:SS o como número de segundos.
    // Usaremos STRING para simplificar por ahora, pero INTERVAL es más preciso para duraciones.
    type: DataTypes.STRING, // Considera DataTypes.INTERVAL si usas PostgreSQL directamente
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lugar: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  publicacion: {
    type: DataTypes.ENUM('Existe_Sin_Publicar', 'Publico', 'Oficial'),
    allowNull: true // Puede ser nulo si no se ha publicado aún
  },
  soporte: {
    type: DataTypes.ENUM('No_existe', 'Existe_Sin_Publicar', 'Publico', 'Oficial'),
    allowNull: true // Puede ser nulo si no hay soporte aún
  },
  sesion_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser nulo si no está asociada a una sesión
    references: {
      model: Sesion,
      key: 'id'
    },
    onDelete: 'SET NULL', // O 'CASCADE' si quieres borrar la grabación al borrar la sesión
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'grabaciones',
  timestamps: false
});

// Definir asociaciones
// Grabacion pertenece a una Cancion
Grabacion.belongsTo(Cancion, { foreignKey: 'cancion_id', as: 'cancion' });
// Grabacion pertenece a una Sesion
Grabacion.belongsTo(Sesion, { foreignKey: 'sesion_id', as: 'sesion' });

module.exports = Grabacion;