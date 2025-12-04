// backend-beatles/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('beatles', 'postgres', 'J0P4G3R1#beatles', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5433,
  logging: console.log, // Opcional: para ver las consultas SQL
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;