const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const roles = sequelize.define('roles' ,
    {
        id_role: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            allowNull: false
        }, 
        role_name: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = roles;
