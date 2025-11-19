// backend-beatles-api/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('beatles', 'postgres', 'J0P4G3R1#beatles', {
  host: 'localhost', // o la IP/dominio de tu servidor PostgreSQL
  dialect: 'postgres',
  port: 5433, // Puerto por defecto de PostgreSQL
  // Opcional: Configuración adicional
  logging: console.log, // Muestra las consultas SQL generadas (útil para debugging, deshabilitar en producción)
  pool: {
    max: 5, // Número máximo de conexiones en el pool
    min: 0, // Número mínimo de conexiones en el pool
    acquire: 30000, // Milisegundos que espera una conexión antes de lanzar un error
    idle: 10000 // Milisegundos que una conexión puede estar inactiva antes de ser liberada
  }
});

module.exports = sequelize;