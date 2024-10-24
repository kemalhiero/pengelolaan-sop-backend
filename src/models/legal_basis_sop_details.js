const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const legal_basis_sop_details = sequelize.define('legal_basis_sop_details' ,
    {
        id_sop_detail: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false
        },
        id_legal: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            allowNull: false
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = legal_basis_sop_details;
