const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const drafter = sequelize.define('drafter' ,
    {
        id_drafter: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_org: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false
        },
        id_user: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = drafter;
