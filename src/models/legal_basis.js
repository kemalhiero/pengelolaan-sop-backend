const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const legal_basis = sequelize.define('legal_basis' ,
    {
        id_legal: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        id_law_type: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false
        }, 
        number: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false
        },
        year: {
            type: DataTypes.SMALLINT,
            allowNull: false
        },
        about: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

// const modelLawTypes = require('./law_types.js');
// legal_basis.belongsTo(modelLawTypes);

module.exports = legal_basis;
