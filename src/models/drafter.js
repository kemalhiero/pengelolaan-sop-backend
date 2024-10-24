const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const drafter = sequelize.define('drafter' ,
    {
        id_sop_detail: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false
        },
        id_user: {
            type: DataTypes.STRING(15),
            primaryKey: true,
            allowNull: false
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = drafter;
