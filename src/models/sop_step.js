const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const sop_step = sequelize.define('sop_step' ,
    {
        id_step: {
            type: DataTypes.STRING(25),
            primaryKey: true,
            allowNull: false
        }, 
        id_sop_detail: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        id_next_step_if_no: {
            type: DataTypes.STRING(25),
        },
        id_next_step_if_yes: {
            type: DataTypes.STRING(25),
        },
        activity_seq_number: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
        },
        activity_name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        activity_type: {
            type: DataTypes.ENUM('terminator', 'process', 'decision', 'arrow'),
            allowNull: false,
        },
        id_sop_implementer: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
        },
        fittings: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        output: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },

    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = sop_step;
