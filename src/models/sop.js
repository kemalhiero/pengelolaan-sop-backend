const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const sop = sequelize.define('sop' ,
    {
        id_sop: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        id_org: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = sop;
