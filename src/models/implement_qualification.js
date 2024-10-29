import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

const implement_qualification = sequelize.define('implement_qualification' ,
    {
        id_qualification: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        id_sop_detail: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        qualification: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

export default implement_qualification;
