const Sequelize = require("sequelize");

const db = new Sequelize('messenger', 'postgres', 'Bugsbunny777!', {
  host: 'localhost',
  dialect:'postgres'
});

module.exports = db;
