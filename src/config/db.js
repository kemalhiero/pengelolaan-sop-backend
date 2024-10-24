const { Sequelize } = require('sequelize');
const { env } = require('node:process');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USERNAME, env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mariadb'
});

module.exports = sequelize;
