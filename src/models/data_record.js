const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const data_record = sequelize.define('data_record' ,
    {
        id_data_record: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        id_sop_detail: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false
        },
        data_record: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        data_record_description: {
            type: DataTypes.STRING(300),
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = data_record;
