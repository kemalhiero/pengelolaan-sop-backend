const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const relation_other_sop = sequelize.define('relation_other_sop' ,
    {
        id_relation_other_sop: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        id_sop_detail: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        related_sop: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = relation_other_sop;
