const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const law_types = sequelize.define('law_types' ,
    {
        id_law_type: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        law_type: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(200),
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = law_types;
