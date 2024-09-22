const sequelize = require("../config/db.js");
const { DataTypes } = require('sequelize');

const feedback = sequelize.define('feedback' ,
    {
        id_feedback: {
            type: DataTypes.STRING(25),
            primaryKey: true,
            allowNull: false
        }, 
        id_user: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        id_sop_detail: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        feedback: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        created_at: {
            type : DataTypes.DATE,
        },
        updated_at: {
            type : DataTypes.DATE,
        }
    }, {
        freezeTableName: true,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    }
);

module.exports = feedback;
