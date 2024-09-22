const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const sop_step_implementer = sequelize.define('sop_step_implementer' ,
    {
        id_sop_implementer: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        implementer_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(300),
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = sop_step_implementer;
