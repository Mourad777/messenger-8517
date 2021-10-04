const Sequelize = require("sequelize");

const db = new Sequelize('messenger', 'postgres', process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect:'postgres'
});

module.exports = db;
