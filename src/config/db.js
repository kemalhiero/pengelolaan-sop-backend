import { Sequelize } from 'sequelize';
import { env } from 'node:process';

const sequelize = new Sequelize(env.DB_NAME, env.DB_USERNAME, env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mariadb'
});

export default sequelize;
