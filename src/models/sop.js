import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

const sop = sequelize.define('sop' ,
    {
        id_sop: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        id_org: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        is_active: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 2
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

export default sop;
